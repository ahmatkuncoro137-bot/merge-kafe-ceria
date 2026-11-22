/* Susun Ubin (tile-match) – PREVIEW. Pakai dompet Koin yang sama dengan Merge Kafe. */
(function (App) {
  'use strict';
  const ART = window.ART, C = App.C, U = C.ubin, LV = App.data.ubin;
  const M = {
    get S() { return App.state; }, C, fmt: App.util.fmt, rp: App.util.rp, centerOf: App.util.centerOf,
    sfx: App.fx.sfx, buzz: App.fx.buzz, burst: App.fx.burst, toast: App.fx.toast, modal: App.fx.modal, confetti: App.fx.confetti,
    saveNow: () => App.store.saveNow(), save: () => App.store.save(), hud: () => App.shell.hud(), openTarik: () => App.shell.openTarik(), watchAd: (o) => App.shell.watchAd(o)
  };
  const $ = (s) => document.querySelector(s);
  const TYPES = ['tepung1', 'tepung3', 'tepung4', 'tepung5', 'telur1', 'telur3', 'telur4', 'telur5', 'buah1', 'buah2', 'buah3', 'buah4', 'buah5',
    'kopi1', 'kopi2', 'kopi3', 'kopi4', 'kopi5', 'gen_telur', 'gen_buah', 'tepung2', 'telur2'];
  const PW = { undo: ['↩️', 'Undo'], acak: ['🔀', 'Acak'], keluar: ['⏏️', 'Keluarkan 3'] };
  const AV = ['#ff7aa2', '#4fc3f7', '#81c784', '#ba68c8', '#ffb74d', '#e57373'];

  /* ---------- DOM ---------- */
  document.body.insertAdjacentHTML('beforeend', `
  <div id="pgUbin" class="page ubin" hidden>
    <div class="uTop"><button class="back" id="uBack">‹</button><div class="uLv">Level <b id="uLv">1</b></div>
      <div class="uProg"><i class="prog"><i id="uBar"></i></i><small id="uCnt">0/0</small></div>
      <div class="uKoin"><img src="${ART.url('koin')}" alt=""><span class="kcol"><b id="uKoin">0</b><small id="uKoinRp">≈ Rp0</small></span></div><button class="rk" id="uRank">🏆</button></div>
    <div id="uBoard"></div>
    <div id="uOutRow"></div>
    <div id="uTray">${'<div class="sl"></div>'.repeat(U.slotNampan)}</div>
    <div class="uPw">${Object.keys(PW).map((k) => `<button data-pw="${k}">${PW[k][0]}<span>${PW[k][1]}</span><i class="ad">📺 iklan</i></button>`).join('')}</div>
  </div>
  <div id="pgRank" class="page" hidden>
    <div class="pageHead"><button class="back" id="rBack">‹</button><h2>Ranking</h2></div>
    <div class="pageBody"><div class="demo">DATA CONTOH (demo preview) – nama &amp; skor di bawah ini bukan pemain asli. Ranking sungguhan butuh server.</div>
    <div class="card"><h3>🏆 Level tertinggi Susun Ubin</h3><div class="rankList" id="rankList"></div></div></div>
  </div>`);
  const page = $('#pgUbin'), boardEl = $('#uBoard');

  let G = null, T = 50, OX = 0, OY = 0;

  /* ---------- GENERATOR LEVEL (selalu bisa diselesaikan) ---------- */
  const rnd = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const over = (a, b) => Math.abs(a.cx - b.cx) < 2 && Math.abs(a.cy - b.cy) < 2;
  function genLevel(L) {
    const spec = LV.get(L); let tiles = [];
    if (spec.layout === 'grid') {
      const n = spec.ubin, cols = 4, rows = Math.ceil(n / cols), gy = Math.min(4, 14 / rows);
      for (let i = 0; i < n; i++) tiles.push({ cx: 1 + (i % cols) * 3.5, cy: (16 - 2 - (rows - 1) * gy) / 2 + Math.floor(i / cols) * gy, z: 0 });
    } else {
      const layers = spec.lapis, total = spec.ubin;
      const W = 14, H = 16, w = []; for (let z = 0; z < layers; z++) w.push(layers - z + 2);
      const sw = w.reduce((a, b) => a + b, 0);
      let left = total;
      for (let z = 0; z < layers && left > 0; z++) {
        const m = Math.floor(z / 2), off = z % 2, cand = [];
        for (let x = m + off; x <= W - 2 - m; x += 2) for (let y = m + off; y <= H - 2 - m; y += 2) cand.push({ cx: x, cy: y, z });
        shuffle(cand);
        let q = z === layers - 1 ? left : Math.min(left, Math.round(total * w[z] / sw), cand.length);
        q = Math.min(q, cand.length); tiles.push(...cand.slice(0, q)); left -= q;
      }
      tiles = tiles.slice(0, tiles.length - tiles.length % 3);
    }
    tiles.forEach((t, i) => { t.id = i; t.state = 'board'; });
    // urutan pengambilan yang valid (simulasi), lalu isi jenis sambil maksimal 2 jenis "terbuka"
    const alive = new Set(tiles), order = [];
    while (alive.size) {
      const free = [...alive].filter((t) => ![...alive].some((o) => o.z > t.z && over(o, t)));
      const pick = free[rnd(free.length)]; order.push(pick); alive.delete(pick);
    }
    const nTypes = Math.min(TYPES.length, spec.jenis), pool = shuffle(TYPES.slice()).slice(0, nTypes), used = {};
    const pickType = () => { const open2 = open.map((o) => o.type); const c = pool.filter((t) => !open2.includes(t)); const m = Math.min(...c.map((t) => used[t] || 0)); const best = c.filter((t) => (used[t] || 0) === m); const t = best[rnd(best.length)]; used[t] = (used[t] || 0) + 1; return t; };
    const open = []; let remaining = order.length;
    order.forEach((t) => {
      const need = open.reduce((a, o) => a + (3 - o.n), 0);
      let o;
      if (!open.length || (open.length < 2 && need + 3 <= remaining && Math.random() < .55)) { o = { type: pickType(), n: 0 }; open.push(o); }
      else o = open[rnd(open.length)];
      t.type = o.type; o.n++; remaining--;
      if (o.n === 3) open.splice(open.indexOf(o), 1);
    });
    if (spec.layout === 'grid') { // level 1: semua terbuka, jenis diacak bebas; urutan solusi = per jenis
      const ty = shuffle(tiles.map((t) => t.type)); tiles.forEach((t, i) => t.type = ty[i]);
      return { tiles, order: tiles.slice().sort((a, b) => (a.type < b.type ? -1 : a.type > b.type ? 1 : a.id - b.id)).map((t) => t.id) };
    }
    return { tiles, order: order.map((t) => t.id) };
  }

  /* ---------- LOGIKA ---------- */
  const isFree = (t) => t.state === 'out' || (t.state === 'board' && !G.tiles.some((o) => o.state === 'board' && o.z > t.z && over(o, t)));
  function start(L) {
    const g = genLevel(L);
    G = { level: L, tiles: g.tiles, order: g.order, tray: [], out: [], hist: [], used: { undo: 0, acak: 0, keluar: 0, lanjut: 0 }, over: false, busy: 0 };
    build(); render(true); persistRun(true);
  }
  /* simpan & lanjutkan permainan yang belum selesai */
  function persistRun(now) {
    if (!G) return;
    M.S.ubin.run = G.over && G.tiles.every((t) => t.state === 'gone') ? null : {
      level: G.level, order: G.order, used: G.used,
      tiles: G.tiles.map((t) => ({ id: t.id, type: t.type, cx: t.cx, cy: t.cy, z: t.z, state: t.state })),
      tray: G.tray.map((t) => t.id), out: G.out.map((t) => t.id), hist: G.hist.map((h) => ({ id: h.t.id, from: h.from }))
    };
    now ? M.saveNow() : M.save();
  }
  function restore(run) {
    const tiles = run.tiles.map((t) => Object.assign({}, t)), byId = (id) => tiles.find((t) => t.id === id);
    G = { level: run.level, tiles, order: run.order || [], tray: run.tray.map(byId), out: run.out.map(byId), hist: (run.hist || []).map((h) => ({ t: byId(h.id), from: h.from })).filter((h) => h.t), used: Object.assign({ undo: 0, acak: 0, keluar: 0, lanjut: 0 }, run.used), over: false, busy: 0 };
    // rapikan: hapus triple yang mungkin belum sempat hilang
    const cnt = {}; G.tray.forEach((t) => { cnt[t.type] = (cnt[t.type] || 0) + 1; });
    Object.keys(cnt).forEach((ty) => { if (cnt[ty] >= 3) G.tray.filter((t) => t.type === ty).slice(0, 3).forEach((t) => { t.state = 'gone'; G.tray.splice(G.tray.indexOf(t), 1); }); });
    build(); render(true); setTimeout(check, 300);
  }
  function measure() {
    const r = boardEl.getBoundingClientRect(), pr = page.getBoundingClientRect();
    T = Math.floor(Math.min((r.width - 16) / 7.2, (r.height - 16) / 8.4));
    OX = r.left - pr.left + (r.width - T * 7) / 2; OY = r.top - pr.top + (r.height - T * 8.3) / 2;
  }
  function build() {
    page.querySelectorAll('.ut').forEach((e) => e.remove());
    measure();
    G.tiles.filter((t) => t.state !== 'gone').forEach((t) => {
      const e = document.createElement('div'); e.className = 'ut in'; e.innerHTML = `<img src="${ART.url(t.type)}">`;
      e.style.width = T + 'px'; e.style.height = T * 1.06 + 'px'; e.style.animationDelay = (t.z * 60 + rnd(120)) + 'ms';
      e.dataset.id = t.id; e.onclick = () => tap(t); t.el = e; page.appendChild(e);
    });
  }
  function slotPos(i, row) {
    const sl = row === 'out' ? null : page.querySelectorAll('#uTray .sl')[i], pr = page.getBoundingClientRect();
    if (sl) { const r = sl.getBoundingClientRect(); return { x: r.left - pr.left + (r.width - T * .92) / 2, y: r.top - pr.top + (r.height - T) / 2 }; }
    const o = $('#uOutRow').getBoundingClientRect(), tr = page.querySelectorAll('#uTray .sl')[i].getBoundingClientRect();
    return { x: tr.left - pr.left + (tr.width - T * .92) / 2, y: o.top - pr.top + (o.height - T) / 2 };
  }
  function render(first) {
    G.tiles.forEach((t) => {
      const e = t.el; if (!e) return;
      if (t.state === 'gone') return;
      let x, y, z, sc = 1;
      if (t.state === 'board') { x = OX + t.cx * T / 2; y = OY + t.cy * T / 2; z = 10 + t.z * 10; }
      else if (t.state === 'tray') { const p = slotPos(G.tray.indexOf(t)); x = p.x; y = p.y; z = 2000; sc = .92; }
      else { const p = slotPos(G.out.indexOf(t), 'out'); x = p.x; y = p.y; z = 1500; sc = .92; }
      e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.zIndex = z;
      e.style.width = T * sc + 'px'; e.style.height = T * 1.06 * sc + 'px';
      e.classList.toggle('cov', !isFree(t)); e.classList.toggle('tr', t.state === 'tray');
    });
    const done = G.tiles.filter((t) => t.state === 'gone').length;
    $('#uLv').textContent = G.level; $('#uCnt').textContent = `${done}/${G.tiles.length} ubin`; $('#uBar').style.width = done / G.tiles.length * 100 + '%';
    $('#uKoin').textContent = M.fmt(M.S.koin); $('#uKoinRp').textContent = '≈ ' + App.util.rpOf(M.S.koin);
    $('#uTray').classList.toggle('danger', G.tray.length >= U.slotNampan - 2);
    $('#uOutRow').classList.toggle('has', G.out.length > 0);
    page.querySelectorAll('.uPw button').forEach((b) => b.classList.toggle('used', G.used[b.dataset.pw] >= U.powerUpPerLevel));
    if (!first) persistRun();
  }
  function tap(t) {
    if (!G || G.over || G.busy || !isFree(t) || (t.state !== 'board' && t.state !== 'out')) return;
    if (G.tray.length >= U.slotNampan) return;
    const from = { state: t.state, outIdx: G.out.indexOf(t) };
    if (t.state === 'out') G.out.splice(G.out.indexOf(t), 1);
    let at = G.tray.length; for (let i = G.tray.length - 1; i >= 0; i--) if (G.tray[i].type === t.type) { at = i + 1; break; }
    G.tray.splice(at, 0, t); t.state = 'tray'; G.hist.push({ t, from });
    M.sfx.spawn(); M.buzz(8); render();
    const same = G.tray.filter((x) => x.type === t.type);
    if (same.length >= 3) {
      G.busy++;
      setTimeout(() => {
        const three = same.slice(0, 3), c = M.centerOf(three[1].el);
        three.forEach((x) => { x.el.classList.add('gone'); x.state = 'gone'; G.tray.splice(G.tray.indexOf(x), 1); });
        G.hist = G.hist.filter((h) => h.t.state === 'tray');
        M.burst(c.x, c.y, 26, 1); M.sfx.merge(3); M.buzz(25);
        setTimeout(() => { three.forEach((x) => x.el.remove()); render(); G.busy--; check(); }, 260);
      }, 230);
    } else setTimeout(check, 240);
  }
  function check() {
    if (G.over || G.busy) return;
    if (G.tiles.every((t) => t.state === 'gone')) return win();
    if (G.tray.length >= U.slotNampan) lose();
  }
  function keluar3() {
    const take = G.tray.splice(0, 3);
    take.forEach((t) => { t.state = 'out'; G.out.push(t); });
    G.hist = G.hist.filter((h) => h.t.state === 'tray');
    render();
  }
  const PWF = {
    undo: { ok: () => G.hist.length > 0, why: 'Belum ada langkah untuk di-undo.', run() { const h = G.hist.pop(); const t = h.t; G.tray.splice(G.tray.indexOf(t), 1); if (h.from.state === 'out') { t.state = 'out'; G.out.splice(Math.max(0, h.from.outIdx), 0, t); } else t.state = 'board'; render(); } },
    acak: { ok: () => G.tiles.some((t) => t.state === 'board'), why: 'Tidak ada ubin untuk diacak.', run() { const b = G.tiles.filter((t) => t.state === 'board'), ty = shuffle(b.map((t) => t.type)); b.forEach((t, i) => { t.type = ty[i]; t.el.querySelector('img').src = ART.url(t.type); t.el.classList.remove('in'); void t.el.offsetWidth; t.el.classList.add('in'); }); render(); } },
    keluar: { ok: () => G.tray.length > 0 && G.out.length + Math.min(3, G.tray.length) <= U.slotNampan, why: 'Nampan masih kosong.', run: keluar3 }
  };
  page.querySelectorAll('.uPw button').forEach((b) => b.onclick = () => {
    const k = b.dataset.pw, f = PWF[k];
    if (!G || G.over) return;
    if (G.used[k] >= U.powerUpPerLevel) return M.toast(`${PW[k][1]} sudah dipakai di level ini.`);
    if (!f.ok()) return M.toast(f.why);
    M.watchAd({ judul: 'Power-up: ' + PW[k][1], hadiah: PW[k][0] + ' ' + PW[k][1], onDone: () => { G.used[k]++; f.run(); M.sfx.yay(); } });
  });
  function lose() {
    G.over = true; M.sfx.no(); M.buzz([60, 40, 60]);
    const canLanjut = G.used.lanjut < U.lanjutPerLevel;
    M.modal(`<h3>Nampan penuh! 😵</h3><p>Level ${G.level} belum selesai. ${canLanjut ? 'Tonton 1 iklan untuk <b>lanjut</b>: 3 ubin dikeluarkan dari nampan.' : 'Kesempatan lanjut di level ini sudah dipakai.'}</p>`,
      (canLanjut ? [{ t: 'Ulangi' , f: () => start(G.level) }, { t: '📺 Lanjut', p: 1, f: () => M.watchAd({ judul: 'Lanjut main', hadiah: 'Keluarkan 3 ubin & lanjut', onDone: () => { G.used.lanjut++; G.over = false; keluar3(); }, onCancel: lose }) }]
        : [{ t: 'Ulangi level', p: 1, f: () => start(G.level) }]));
  }
  function win() {
    G.over = true;
    const L = G.level, koin = Math.min(U.koinMenangMaks || Infinity, U.koinMenangDasar + U.koinMenangPerLevel * L), S = M.S;
    App.wallet.credit(koin, 'ubin-menang'); S.ubin.level = L + 1; S.ubin.best = Math.max(S.ubin.best || 1, L + 1); S.ubin.run = null;
    const B = C.bonusLevel; const bonusBaru = L + 1 >= B.level && !S.bonus.didapat; if (bonusBaru) S.bonus.didapat = true;
    M.saveNow(); M.hud();
    M.confetti(); M.sfx.yay(); setTimeout(M.sfx.yay, 400); M.buzz([40, 60, 40, 60, 80]); render();
    M.modal(`<h3>Level ${L} selesai!</h3><div class="lvbig">⭐⭐⭐</div><div class="rwds">${App.util.koinHTML(koin, true)}</div><p>Lanjut ke <b>Level ${L + 1}</b>${L === 1 ? ' – awas, mulai sini jauh lebih susah! 😈' : ''}</p>`,
      [{ t: 'Lanjut ▶', p: 1, f: () => { if (U.iklanAntarLevel) App.ads.interstitial({ placement: 'antar-level' }).then(after); else after(); } }]);
    function after() { if (bonusBaru) showBonus(); else start(L + 1); }
  }
  function showBonus() {
    const B = C.bonusLevel, n = Math.min(M.S.iklanTotal || 0, B.minIklan);
    M.confetti(); M.sfx.yay();
    M.modal(`<h3>Level ${B.level} tercapai! 🎉</h3><p>Kamu dapat bonus</p><div class="bonusBig">+${M.fmt(B.koin)} Koin</div><div class="bonusRp">≈ ${App.util.rpOf(B.koin)}</div>
      <div class="card" style="box-shadow:none;background:#fff7e0;margin-top:8px;text-align:left"><div class="sHead" style="font-size:13px"><span>📺 Iklan ditonton ${n}/${B.minIklan}</span><b>${n >= B.minIklan ? '🔓' : '🔒'}</b></div>
      <i class="prog big"><i style="width:${n / B.minIklan * 100}%"></i></i>
      <small>${n >= B.minIklan ? 'Syarat terpenuhi! Masukkan bonus ke saldo di halaman Tarik Tunai.' : `Bonus terkunci sampai kamu menonton total ${B.minIklan} iklan (tinggal ${B.minIklan - n} lagi). Iklan dari power-up, lanjut, dan iklan antar level ikut dihitung.`}</small></div>`,
      [{ t: 'Main lagi', f: () => start(M.S.ubin.level) }, { t: '💸 Lihat', p: 1, f: () => { start(M.S.ubin.level); M.openTarik(); } }]);
  }

  /* ---------- RANKING ---------- */
  function openRank() {
    const me = ['Kamu', M.S.ubin.best || 1], rows = C.rankingDemo.map((r) => r.slice()).concat([me]).sort((a, b) => b[1] - a[1]);
    $('#rankList').innerHTML = rows.map((r, i) => `<div class="rrow${r === me ? ' me' : ''}"><span class="no">${i + 1}</span><span class="av" style="background:${AV[i % AV.length]}">${r[0][0]}</span><span class="nm">${r[0]}${r === me ? ' (kamu)' : ' <small style="opacity:.5">· contoh</small>'}</span><b>Lv ${r[1]}</b></div>`).join('');
    $('#pgRank').hidden = false; $('#pgRank').style.zIndex = 35;
  }
  $('#rBack').onclick = () => { $('#pgRank').hidden = true; };
  $('#uRank').onclick = openRank;
  $('#uBack').onclick = () => { page.hidden = true; M.hud(); document.getElementById('hudStreak').click(); };
  window.addEventListener('resize', () => { if (G && !page.hidden) { measure(); render(); } });

  function open() {
    page.hidden = false; page.style.zIndex = 25;
    requestAnimationFrame(() => { const run = M.S.ubin.run; if (run && run.level === M.S.ubin.level && run.tiles) restore(run); else start(M.S.ubin.level || 1); });
  }
  App.ubin = { open, openRank, start, get G() { return G; }, render, isFree };
})(window.App);
