/* LARI KOKI – mode lari warna (orisinal). Logika di lari-logic.js; di sini tampilan canvas + kontrol geser.
 * Koin menang masuk dompet yang SAMA (App.wallet.credit) -> ikut kuota tarik & pagar untung pemilik. */
(function (App) {
  'use strict';
  const C = App.C, CL = C.lari, LG = App.lariLogic, U = App.util;
  const $ = (s) => document.querySelector(s);
  const WARNA_HEX = { pink: '#ff4f9a', kuning: '#ffc21a', hijau: '#2fcf5a', biru: '#2f9bff' };
  const WARNA_DARK = { pink: '#c2185b', kuning: '#c98a00', hijau: '#178a35', biru: '#1660b8' };
  const NAMA = { pink: 'Pink', kuning: 'Kuning', hijau: 'Hijau', biru: 'Biru' };

  document.body.insertAdjacentHTML('beforeend', `
  <div id="pgLari" class="page lari" hidden>
    <div class="lTop"><button class="back" id="lBack" aria-label="Kembali">‹</button>
      <div class="lDots"><span class="d" id="lD0">1</span><i class="bar"><i id="lBar"></i></i><span class="d n" id="lD1">2</span><i class="bar"><i></i></i><span class="d n" id="lD2">3</span></div>
      <div class="uKoin"><img src="${window.ART.url('koin')}" alt=""><span class="kcol"><b id="lKoin">0</b><small id="lKoinRp">≈ Rp0</small></span></div></div>
    <div class="lWrap"><canvas id="lCv"></canvas>
      <div class="lLv">Level <b id="lLv">1</b></div>
      <div class="lHint" id="lHint"><div class="arrows"><span>⟵</span><b>👆</b><span>⟶</span></div><p>Geser kiri / kanan</p><small>Lewati <b>warna yang sama</b> = kru bertambah · warna beda = kru berkurang</small><button class="primary wide" id="lGo">Mulai lari!</button></div>
    </div>
  </div>`);
  const page = $('#pgLari'), cv = $('#lCv'), ctx = cv.getContext('2d');
  let G = null, W = 360, H = 600, DPR = 1, last = 0, raf = 0;
  const api = { timeScale: 1 };

  /* ---------- level ---------- */
  function start(L) {
    const lv = LG.genLevel(L), b = LG.best(lv);
    G = { L, lv, terbaik: b.kru, z: 0, x: 0, tx: 0, kru: 1, warna: lv.warnaAwal, i: 0, run: false, over: false, used: { lanjut: 0 }, pops: [], flash: 0, t: 0 };
    $('#lLv').textContent = L; ['lD0', 'lD1', 'lD2'].forEach((id, k) => { $('#' + id).textContent = L + k; });
    $('#lHint').hidden = false; koinHud(); resize(); draw();
  }
  function koinHud() { $('#lKoin').textContent = U.fmt(App.state.koin); $('#lKoinRp').textContent = '≈ ' + U.rpOf(App.state.koin); }
  function go() { if (!G || G.over) return; $('#lHint').hidden = true; G.run = true; App.fx.unlockAudio(); }
  $('#lGo').onclick = go;

  /* ---------- kontrol geser ---------- */
  let drag = null;
  cv.addEventListener('pointerdown', (e) => { if (!G) return; if (!G.run && !G.over) go(); drag = { x: e.clientX, tx: G.tx }; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => { if (!drag || !G) return; G.tx = Math.max(-1, Math.min(1, drag.tx + (e.clientX - drag.x) / (W * .36))); });
  const up = () => { drag = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  window.addEventListener('keydown', (e) => { if (!G || page.hidden) return; const k = LG.laneOfX(G.tx); if (e.key === 'ArrowLeft') G.tx = LG.xOfLane(Math.max(0, k - 1)); if (e.key === 'ArrowRight') G.tx = LG.xOfLane(Math.min(2, k + 1)); if (!G.run) go(); });

  /* ---------- loop ---------- */
  function loop(t) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (t - (last || t)) / 1000) * api.timeScale; last = t;
    if (!G || page.hidden) return;
    G.t += dt;
    if (G.run && !G.over) {
      G.z += CL.kecepatan * dt;
      G.x += (G.tx - G.x) * Math.min(1, dt * 14);
      while (G.i < G.lv.rows.length && G.lv.rows[G.i].z <= G.z) hit(G.lv.rows[G.i++]);
      if (!G.over && G.z >= G.lv.panjang) win();
      $('#lBar').style.width = Math.min(100, G.z / G.lv.panjang * 100) + '%';
    }
    G.flash = Math.max(0, G.flash - dt * 2.5);
    G.pops = G.pops.filter((p) => (p.t += dt) < 1);
    draw();
  }
  function hit(row) {
    const lane = LG.laneOfX(G.x), s = LG.apply({ kru: G.kru, warna: G.warna }, row, lane);
    row.hit = lane; G.kru = Math.max(0, s.kru); G.warna = s.warna;
    if (s.efek === 'tambah') { pop('+' + s.n, '#1fae4a'); App.fx.sfx.merge(Math.min(4, 1 + (s.n >> 1))); App.fx.buzz(15); }
    else if (s.efek === 'kurang') { pop('−' + s.n, '#e02424'); G.flash = 1; App.fx.sfx.no(); App.fx.buzz([40, 30, 40]); }
    else { pop('Warna ' + NAMA[G.warna] + '!', WARNA_DARK[G.warna]); App.fx.sfx.spawn(); App.fx.buzz(10); }
    if (G.kru <= 0) lose();
  }
  function pop(txt, col) { G.pops.push({ txt, col, t: 0 }); }

  /* ---------- menang / kalah ---------- */
  function win() {
    G.over = true; G.run = false;
    const L = G.L, S = App.state, h = LG.hadiah(CL, L, G.kru, G.terbaik);
    App.wallet.credit(h.koin, 'lari-menang'); S.lari.level = L + 1; S.lari.best = Math.max(S.lari.best || 1, L + 1); S.lari.menang = (S.lari.menang || 0) + 1;
    App.store.saveNow(); App.shell.hud(); koinHud();
    App.fx.confetti(); App.fx.sfx.yay(); setTimeout(App.fx.sfx.yay, 400); App.fx.buzz([40, 60, 40, 60, 80]);
    App.fx.modal(`<h3>Level ${L} selesai!</h3><div class="lvbig">${'⭐'.repeat(h.bintang)}${'☆'.repeat(3 - h.bintang)}</div><p>Kru kamu: <b>${G.kru}</b> (terbaik mungkin ${G.terbaik})</p><div class="rwds">${U.koinHTML(h.koin, true)}</div><p>Lanjut ke <b>Level ${L + 1}</b></p>`,
      [{ t: 'Lanjut ▶', p: 1, f: () => { if (CL.iklanAntarLevel) App.ads.interstitial({ placement: 'lari-antar-level' }).then(() => start(L + 1)); else start(L + 1); } }]);
  }
  function lose() {
    G.over = true; G.run = false;
    const can = G.used.lanjut < CL.lanjutPerLevel;
    App.fx.modal(`<h3>Kru habis! 😵</h3><p>Level ${G.L} belum selesai. ${can ? 'Tonton 1 iklan untuk <b>lanjut</b> dengan 3 kru.' : 'Kesempatan lanjut di level ini sudah dipakai.'}</p>`,
      can ? [{ t: 'Ulangi', f: () => start(G.L) }, { t: '📺 Lanjut', p: 1, f: () => App.shell.watchAd({ judul: 'Lanjut lari', hadiah: '3 kru & lanjut', onDone: () => { G.used.lanjut++; G.kru = 3; G.over = false; G.run = true; }, onCancel: () => start(G.L) }) }]
        : [{ t: 'Ulangi level', p: 1, f: () => start(G.L) }]);
  }

  /* ---------- gambar ---------- */
  function resize() {
    const r = cv.parentElement.getBoundingClientRect(); DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(200, r.width); H = Math.max(300, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
  }
  window.addEventListener('resize', () => { if (!page.hidden) resize(); });
  const F = 7, BACK = 3;
  const HY = () => H * .27, PY = () => H * .80;
  function proj(d) { // d = jarak di depan pemain
    const s = F / (F + d + BACK), s0 = F / (F + BACK), k = s / s0, hy = HY(), yb = hy + (PY() - hy) * (F + BACK) / F;
    return { y: hy + (yb - hy) * s, k, half: W * .40 * k };
  }
  function person(x, y, sz, col, dark, ph, chef) {
    const sw = Math.sin(ph) * .35;
    ctx.lineCap = 'round'; ctx.strokeStyle = dark; ctx.lineWidth = sz * .16;
    ctx.beginPath(); ctx.moveTo(x - sz * .12, y - sz * .45); ctx.lineTo(x - sz * .12 - sz * sw * .5, y); ctx.moveTo(x + sz * .12, y - sz * .45); ctx.lineTo(x + sz * .12 + sz * sw * .5, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - sz * .2, y - sz * .82); ctx.lineTo(x - sz * .38, y - sz * (.55 + sw * .3)); ctx.moveTo(x + sz * .2, y - sz * .82); ctx.lineTo(x + sz * .38, y - sz * (.55 - sw * .3)); ctx.stroke();
    ctx.fillStyle = col; ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, sz * .05);
    rr(x - sz * .22, y - sz * .95, sz * .44, sz * .55, sz * .18); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - sz * 1.12, sz * .21, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (sz > 14) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x - sz * .07, y - sz * 1.14, sz * .045, 0, 7); ctx.arc(x + sz * .07, y - sz * 1.14, sz * .045, 0, 7); ctx.fill(); }
    if (chef) {
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#c9d3df'; ctx.lineWidth = Math.max(1, sz * .04);
      rr(x - sz * .2, y - sz * 1.42, sz * .4, sz * .14, sz * .04); ctx.fill(); ctx.stroke();
      [[-.13, -1.5, .13], [.13, -1.5, .13], [0, -1.58, .16]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * sz, y + dy * sz, r * sz, 0, 7); ctx.fill(); ctx.stroke(); });
      ctx.fillStyle = '#fff'; rr(x - sz * .18, y - sz * .9, sz * .36, sz * .42, sz * .1); ctx.fill();
      ctx.fillStyle = col; rr(x - sz * .12, y - sz * .74, sz * .24, sz * .28, sz * .06); ctx.fill();
    }
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function draw() {
    if (!G) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const hy = HY(), cx = W / 2;
    let g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#5ec8ff'); g.addColorStop(1, '#bfeaff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 1);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; [[.18, .1, 34], [.3, .08, 24], [.78, .14, 40], [.66, .12, 22]].forEach(([fx, fy, r]) => { ctx.beginPath(); ctx.ellipse(W * fx, H * fy, r, r * .45, 0, 0, 7); ctx.fill(); });
    g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, '#48b4f0'); g.addColorStop(1, '#1f7fd0'); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2;
    for (let i = 0; i < 9; i++) { const d = ((i * 6 - G.z * .6) % 54 + 54) % 54, p = proj(d); ctx.beginPath(); ctx.moveTo(cx - p.half * 2.2, p.y); ctx.lineTo(cx - p.half * 1.5, p.y); ctx.moveTo(cx + p.half * 1.5, p.y); ctx.lineTo(cx + p.half * 2.2, p.y); ctx.stroke(); }
    // jalan biskuit dengan pagar krim
    const FAR = 70, STEP = 2;
    for (let d = FAR; d > -BACK; d -= STEP) {
      const a = proj(d), b = proj(Math.max(-BACK + .01, d - STEP)), seg = Math.floor((d + G.z) / STEP) % 2 === 0;
      ctx.fillStyle = seg ? '#f6dcae' : '#efd09a';
      ctx.beginPath(); ctx.moveTo(cx - a.half, a.y); ctx.lineTo(cx + a.half, a.y); ctx.lineTo(cx + b.half, b.y); ctx.lineTo(cx - b.half, b.y); ctx.fill();
      ctx.fillStyle = seg ? '#ff7aa8' : '#fff';
      [[-1, -1.12], [1, 1.12]].forEach(([s1, s2]) => { ctx.beginPath(); ctx.moveTo(cx + s1 * a.half, a.y); ctx.lineTo(cx + s2 * a.half, a.y); ctx.lineTo(cx + s2 * b.half, b.y); ctx.lineTo(cx + s1 * b.half, b.y); ctx.fill(); });
      if (seg && d < FAR - 2) { ctx.fillStyle = 'rgba(190,130,60,.25)'; [-1 / 3, 1 / 3].forEach((lx) => { ctx.fillRect(cx + lx * a.half - a.k * 2, a.y, a.k * 4, b.y - a.y); }); }
    }
    // objek dari jauh ke dekat
    const items = [];
    G.lv.rows.forEach((row) => { const d = row.z - G.z; if (d > -2 && d < FAR) items.push({ d, row }); });
    const df = G.lv.panjang - G.z; if (df > -2 && df < FAR) items.push({ d: df, fin: true });
    items.sort((a, b) => b.d - a.d);
    let drewPlayer = false;
    const drawPlayer = () => {
      drewPlayer = true;
      const p = proj(0), px = cx + G.x * p.half * (2 / 3) * 1.0, sz = H * .085, n = Math.min(G.kru - 1, 28);
      for (let i = n; i >= 1; i--) { const a = i * 2.399, r = Math.sqrt(i) * sz * .42; const ox = Math.cos(a) * r, oy = Math.sin(a) * r * .35 + r * .15;
        person(px + ox, p.y + oy - sz * .05, sz * .62, WARNA_HEX[G.warna], WARNA_DARK[G.warna], G.t * 14 + i, false); }
      person(px, p.y + sz * .25, sz, WARNA_HEX[G.warna], WARNA_DARK[G.warna], G.t * 14, true);
      ctx.font = `800 ${Math.round(sz * .42)}px Fredoka, sans-serif`; ctx.textAlign = 'center';
      const lbl = String(G.kru), tw = ctx.measureText(lbl).width + 16;
      ctx.fillStyle = 'rgba(0,0,0,.55)'; rr(px - tw / 2, p.y - sz * 2.05, tw, sz * .55, sz * .27); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(lbl, px, p.y - sz * 1.64);
      G.pops.forEach((q, k) => { ctx.globalAlpha = 1 - q.t; ctx.fillStyle = q.col; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.font = `900 ${Math.round(sz * .6)}px Fredoka, sans-serif`;
        const yy = p.y - sz * 2.3 - q.t * sz * 1.4 - k * 4; ctx.strokeText(q.txt, px, yy); ctx.fillText(q.txt, px, yy); ctx.globalAlpha = 1; });
    };
    items.forEach((it) => {
      if (it.d < 0 && !drewPlayer) drawPlayer();
      const p = proj(it.d);
      if (it.fin) { const b = proj(it.d + 1.2); for (let k = 0; k < 12; k++) { ctx.fillStyle = k % 2 ? '#222' : '#fff'; const x0 = cx - p.half + k * p.half * 2 / 12; const x1 = cx - b.half + k * b.half * 2 / 12;
        ctx.beginPath(); ctx.moveTo(x0, p.y); ctx.lineTo(x0 + p.half / 6, p.y); ctx.lineTo(x1 + b.half / 6, b.y); ctx.lineTo(x1, b.y); ctx.fill(); }
        ctx.fillStyle = '#ffd23a'; ctx.font = `900 ${Math.round(28 * p.k)}px Fredoka, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('FINIS', cx, b.y - 34 * p.k); return; }
      const row = it.row;
      for (let k = 0; k < LG.JALUR; k++) {
        const lx = cx + LG.xOfLane(k) * p.half * (2 / 3);
        if (row.tipe === 'gerbang') {
          const w = p.half * .58, h = 90 * p.k, col = WARNA_HEX[row.lanes[k]];
          ctx.globalAlpha = row.hit === k ? .35 : .8; ctx.fillStyle = col; rr(lx - w / 2, p.y - h, w, h, 10 * p.k); ctx.fill();
          ctx.globalAlpha = 1; ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1.5, 4 * p.k); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.max(8, Math.round(15 * p.k))}px Fredoka, sans-serif`; ctx.textAlign = 'center'; ctx.fillText(NAMA[row.lanes[k]], lx, p.y - h * .45);
        } else {
          const gr = row.lanes[k]; if (row.hit === k) continue;
          const n = Math.min(gr.n, 9), sz = H * .085 * p.k * .8;
          for (let i = n - 1; i >= 0; i--) { const ox = ((i % 3) - 1) * sz * .5, oy = -Math.floor(i / 3) * sz * .28; person(lx + ox, p.y + oy, sz, WARNA_HEX[gr.warna], WARNA_DARK[gr.warna], G.t * 6 + i + k, false); }
          if (p.k > .28) { ctx.font = `800 ${Math.round(sz * .55)}px Fredoka, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = WARNA_DARK[gr.warna]; ctx.lineWidth = 3;
            const yy = p.y - sz * (1.75 + Math.floor((n - 1) / 3) * .28); ctx.strokeText('×' + gr.n, lx, yy); ctx.fillText('×' + gr.n, lx, yy); }
        }
      }
    });
    if (!drewPlayer) drawPlayer();
    if (G.flash > 0) { ctx.fillStyle = `rgba(255,40,40,${G.flash * .28})`; ctx.fillRect(0, 0, W, H); }
    // penunjuk warna pemain
    ctx.font = '700 13px Fredoka, sans-serif'; ctx.textAlign = 'left'; const lb = 'Warnamu: ' + NAMA[G.warna], tw = ctx.measureText(lb).width + 30;
    ctx.fillStyle = 'rgba(255,255,255,.92)'; rr(10, H - 40, tw, 28, 14); ctx.fill(); ctx.fillStyle = WARNA_HEX[G.warna]; ctx.beginPath(); ctx.arc(24, H - 26, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#333'; ctx.fillText(lb, 36, H - 21);
  }

  function open() {
    page.hidden = false; page.style.zIndex = 25;
    requestAnimationFrame(() => { resize(); start(App.state.lari.level || 1); if (!raf) raf = requestAnimationFrame(loop); });
  }
  $('#lBack').onclick = () => { page.hidden = true; if (G) { G.run = false; } App.shell.hud(); document.getElementById('hudStreak').click(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && G && G.run) { G.run = false; $('#lHint').hidden = false; $('#lGo').textContent = 'Lanjut lari'; } });
  Object.assign(api, { open, start, go, steer: (lane) => { if (G) G.tx = LG.xOfLane(lane); } });
  Object.defineProperty(api, 'G', { get: () => G });
  App.lari = api;
})(window.App);
