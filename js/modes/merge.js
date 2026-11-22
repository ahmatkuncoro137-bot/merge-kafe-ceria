/* Mode MERGE KAFE: papan 7x8, generator, gabung barang, pesanan pelanggan, dekor, naik level. */
(function (App) {
  'use strict';
  const C = App.C, D = App.data.merge, S = App.state, MS = S.merge;
  const { $, fmt, rp, centerOf } = App.util;
  const { sfx, burst, buzz, ftext, toast, bump, modal, fly, confetti } = App.fx;
  const COLS = D.cols, ROWS = D.rows, N = COLS * ROWS, MAXT = D.maxTier, CHAINS = D.chains, CH = Object.keys(CHAINS);
  const artOf = (it) => it.g ? 'gen_' + it.g : it.c + it.t;
  const nameOf = (it) => it.g ? CHAINS[it.g].gen : CHAINS[it.c].names[it.t];
  const save = () => App.store.save(), saveNow = () => App.store.saveNow();
  const hud = () => App.shell.hud(), regen = () => App.shell.regen();
  const giveReward = (r, f) => App.shell.giveReward(r, f), rewardHTML = (r) => App.shell.rewardHTML(r);
  let bubT;
  // Dua koki bergantian bicara (who: 0 = Mbak Koki, 1 = Mas Koki; kosong = gantian)
  let giliran = 0;
  function say(m, who) {
    if (who !== 0 && who !== 1) { who = giliran; giliran = 1 - giliran; }
    const b = $(who ? '#bubble2' : '#bubble'), o = $(who ? '#bubble' : '#bubble2');
    o.classList.remove('show'); b.textContent = m; b.classList.add('show');
    const k = $(who ? '.karakter.kB' : '.karakter.kA'); k.classList.remove('happy'); void k.offsetWidth; k.classList.add('happy');
    clearTimeout(bubT); bubT = setTimeout(() => b.classList.remove('show'), 2600);
  }
  function level() { return 1 + Math.floor(MS.done / C.pesananPerLevel); }
  function custUnlocked(L = level()) { return C.pelanggan.map((c, i) => Object.assign({}, c, { i })).filter((c) => c.level <= L); }

  /* ---------- LAYOUT ---------- */
  function layout() {
    const app = $('#app'), W = app.clientWidth, H = app.clientHeight;
    const scene = H < 760 ? Math.max(140, Math.round(H * .22)) : 222; // layar pendek: adegan diperkecil agar papan tetap enak disentuh
    const fixed = 46 + 86 + 8 + 34 + 58 + scene;
    const c = Math.floor(Math.min((W - 14) / COLS, (H - fixed) / ROWS, 64));
    document.documentElement.style.setProperty('--c', c + 'px');
    CELL = c;
  }
  let CELL = 50;
  window.addEventListener('resize', () => { layout(); renderBoard(); });
  /* ---------- DEKOR ---------- */
  function renderDekor() {
    const bar = $('#dekorBar'); bar.innerHTML = '';
    C.dekor.forEach((d) => {
      const done = !!MS.dekor[d.id], el = document.createElement('button'), lk = level() < d.minLevel;
      el.className = 'dk' + (done ? ' done' : lk ? ' lock' : S.bintang >= d.bintang ? ' can' : '');
      el.dataset.id = d.id;
      el.innerHTML = `<img class="ic" src="${ART.url('d_' + d.id)}"><span class="cost">${done ? '✓' : lk ? `<span class="lk">🔒 Lv ${d.minLevel}</span>` : `<img src="${ART.url('bintang')}">${d.bintang}`}</span>`;
      el.onclick = () => buyDekor(d, el);
      bar.appendChild(el);
      const sc = document.querySelector(`[data-dekor="${d.id}"]`); sc.classList.toggle('locked', !done);
    });
  }
  function buyDekor(d, el) {
    if (MS.dekor[d.id]) { say(d.nama + ' sudah terpasang 😊'); return; }
    if (level() < d.minLevel) { toast(`??? Dekor rahasia terbuka di Level ${d.minLevel}!`); sfx.no(); return; }
    if (S.bintang < d.bintang) { toast(`Butuh ${d.bintang} ⭐ untuk ${d.nama}. Selesaikan pesanan dulu!`); sfx.no(); return; }
    S.bintang -= d.bintang; MS.dekor[d.id] = 1; save();
    renderDekor(); hud();
    const sc = document.querySelector(`[data-dekor="${d.id}"]`); sc.classList.add('pop');
    const c = centerOf(sc); burst(c.x, c.y, 34, 1.2); sfx.yay();
    document.querySelectorAll('.karakter').forEach((k) => { k.classList.remove('happy'); void k.offsetWidth; k.classList.add('happy'); });
    say(`Yay, ${d.nama} baru! Kafenya makin cantik ✨`); buzz([20, 40, 20]);
  }

  /* ---------- PESANAN ---------- */
  function newOrder() {
    const L = level(), maxT = Math.min(MAXT, 2 + Math.floor(L / 2)), n = L < 2 ? 1 : (Math.random() < .5 ? 1 : 2);
    const need = [];
    for (let i = 0; i < n; i++) need.push({ c: CH[Math.floor(Math.random() * CH.length)], t: 2 + Math.floor(Math.random() * (maxT - 1)) });
    const koin = need.reduce((s, x) => s + C.koinPerTingkat[x.t], 0);
    const bintang = need.length + (need.some((x) => x.t >= 4) ? 1 : 0);
    const cs = custUnlocked(), cu = cs[Math.floor(Math.random() * cs.length)];
    return { id: MS.oid++, need, koin, bintang, face: cu.i };
  }
  function ensureOrders() { while (MS.orders.length < 3) MS.orders.push(newOrder()); }
  function findFor(need) {
    const used = new Set(), idx = [];
    for (const x of need) {
      let f = -1;
      for (let i = 0; i < N; i++) { const b = MS.board[i]; if (b && !b.g && b.c === x.c && b.t === x.t && !used.has(i)) { f = i; break; } }
      idx.push(f); if (f >= 0) used.add(f);
    }
    return idx;
  }
  function renderOrders(animId) {
    const box = $('#orders'); box.innerHTML = '';
    MS.orders.forEach((o) => {
      const idx = findFor(o.need), ok = idx.every((i) => i >= 0);
      const el = document.createElement('div'); el.className = 'order' + (o.id === animId ? ' in' : ''); el.dataset.oid = o.id;
      el.innerHTML = `<div class="top"><img class="face" src="${ART.url('wajah' + o.face)}"><span class="cn">${C.pelanggan[o.face].nama}</span><span class="rw"><span><img src="${ART.url('koin')}" alt="">${o.koin}</span><small>≈${App.util.rpOf(o.koin)}</small><span><img src="${ART.url('bintang')}" alt="">${o.bintang}</span></span></div>
        <div class="need">${o.need.map((x, k) => `<div class="ni${idx[k] >= 0 ? ' ok' : ''}" title="${CHAINS[x.c].names[x.t]}"><img src="${ART.url(x.c + x.t)}"></div>`).join('')}</div>
        <button class="${ok ? 'go' : ''}">${ok ? 'Kirim' : CHAINS[o.need[0].c].names[o.need[0].t] + (o.need.length > 1 ? ' +1' : '')}</button>`;
      el.querySelector('.face').onclick = () => toast(`${C.pelanggan[o.face].nama}: ${C.pelanggan[o.face].cerita}`);
      el.querySelector('button').onclick = () => ok ? deliver(o, el) : toast('Gabungkan barang sampai jadi ' + o.need.map((x) => CHAINS[x.c].names[x.t]).join(' & '));
      box.appendChild(el);
    });
  }
  function deliver(o, el) {
    const idx = findFor(o.need); if (idx.some((i) => i < 0)) return;
    const target = centerOf(el);
    idx.forEach((i) => { const ie = boardEl.querySelector(`.it[data-i="${i}"]`); if (ie) fly(artOf(MS.board[i]), centerOf(ie), target); MS.board[i] = null; });
    if (sel != null && !MS.board[sel]) sel = null;
    MS.done++; MS.orders = MS.orders.filter((x) => x !== o);
    const nO = newOrder(); MS.orders.splice(Math.min(2, MS.orders.length), 0, nO);
    App.wallet.credit(o.koin, 'pesanan'); S.bintang += o.bintang;   // dicatat bersamaan dengan papan (satu kali simpan)
    saveNow(); renderBoard();
    el.classList.add('out');
    setTimeout(() => {
      burst(target.x, target.y, 26);
      const kc = centerOf($('#hudKoin img')), bc = centerOf($('#hudBintang img'));
      for (let k = 0; k < 5; k++) setTimeout(() => fly('koin', target, kc, () => { if (k === 4) { hud(); bump('#hudKoin'); sfx.coin(); } }), k * 70);
      fly('bintang', target, bc, () => { hud(); bump('#hudBintang'); renderDekor(); });
      renderOrders(nO.id);
      say(['Terima kasih! Enak banget 😍', 'Pelanggan senang! 💕', 'Mantap, pesanan selesai! ✨', 'Siap, pesanan berikutnya! 👨‍🍳', 'Kerja tim kita keren! 🙌'][MS.done % 5]);
      sfx.yay(); buzz(30); ftext('+' + o.koin + ' Koin', target.x, target.y);
      if (level() > MS.lvSeen) setTimeout(levelUp, 900);
    }, 320);
  }

  /* ---------- PAPAN ---------- */
  const boardEl = $('#board');
  let sel = null;
  function cellXY(i) { return { x: (i % COLS) * CELL, y: Math.floor(i / COLS) * CELL }; }
  function buildCells() {
    boardEl.innerHTML = '';
    for (let i = 0; i < N; i++) { const c = document.createElement('div'); const { x, y } = cellXY(i); c.className = 'cell' + (((i % COLS) + Math.floor(i / COLS)) % 2 ? ' alt' : ''); c.style.left = x + 'px'; c.style.top = y + 'px'; c.dataset.c = i; boardEl.appendChild(c); }
  }
  function renderBoard(opts = {}) {
    buildCells();
    MS.board.forEach((it, i) => {
      if (!it) return;
      const e = document.createElement('div'), { x, y } = cellXY(i);
      e.className = 'it' + (it.g ? ' gen' : '') + (sel === i ? ' sel' : '') + (opts.pop === i ? ' pop' : '');
      e.dataset.i = i; e.style.left = x + 'px'; e.style.top = y + 'px';
      e.innerHTML = `<img src="${ART.url(artOf(it))}">` + (it.g ? '' : `<span class="lvl">${it.t}</span>`);
      if (opts.from && opts.from.i === i) {
        e.style.transition = 'none'; e.style.left = opts.from.x + 'px'; e.style.top = opts.from.y + 'px'; e.style.transform = 'scale(.4)';
        requestAnimationFrame(() => requestAnimationFrame(() => { e.style.transition = 'left .28s cubic-bezier(.3,1.4,.5,1),top .28s cubic-bezier(.3,1.4,.5,1),transform .28s'; e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.transform = ''; }));
      }
      boardEl.appendChild(e);
    });
    renderOrders(); info();
  }
  function info() {
    const b = $('#btnBuang'), t = $('#infoText');
    if (sel == null || !MS.board[sel]) { b.hidden = true; t.textContent = 'Seret 2 barang yang sama untuk digabung ✨ Ketuk generator untuk bikin bahan.'; return; }
    const it = MS.board[sel];
    if (it.g) { b.hidden = true; t.textContent = `${CHAINS[it.g].gen}: ketuk untuk bikin ${CHAINS[it.g].names[1]} (−${C.energiPerKlik} energi)`; return; }
    b.hidden = false;
    t.textContent = it.t < MAXT ? `${nameOf(it)} (Lv ${it.t}) → gabung 2 jadi ${CHAINS[it.c].names[it.t + 1]}` : `${nameOf(it)} (Lv ${it.t}) – tingkat tertinggi! 🎉`;
  }
  $('#btnBuang').onclick = () => {
    if (sel == null) return; const it = MS.board[sel];
    modal(`<h3>Buang?</h3><p>${nameOf(it)} akan dibuang dari papan (tidak dapat koin).</p>`, [{ t: 'Batal' }, { t: 'Buang', p: 1, f: () => { MS.board[sel] = null; sel = null; save(); renderBoard(); } }]);
  };

  function emptyNear(i) {
    const r0 = Math.floor(i / COLS), c0 = i % COLS; let best = -1, bd = 1e9;
    for (let k = 0; k < N; k++) if (!MS.board[k]) { const d = Math.hypot(Math.floor(k / COLS) - r0, k % COLS - c0) + Math.random() * .1; if (d < bd) { bd = d; best = k; } }
    return best;
  }
  function tapGen(i) {
    regen();
    const it = MS.board[i];
    if (S.energi < C.energiPerKlik) { sfx.no(); modal(`<h3>Energi habis</h3><p>Energi nambah sendiri +1 tiap ${C.energiRegenDetik} detik. Istirahat dulu ya ☕</p>`); return; }
    const k = emptyNear(i);
    if (k < 0) { sfx.no(); toast('Papan penuh! Gabungkan atau kirim barang dulu.'); return; }
    if (S.energi >= C.energiMaks) S.eTime = Date.now();
    S.energi -= C.energiPerKlik;
    MS.board[k] = { c: it.g, t: Math.random() < .12 ? 2 : 1 };
    save(); sfx.spawn(); hud();
    renderBoard({ from: { i: k, ...cellXY(i) } });
    const ge = boardEl.querySelector(`.it[data-i="${i}"]`); if (ge) { ge.classList.add('wiggle'); }
  }
  function tryMerge(a, b) {
    const A = MS.board[a], B = MS.board[b];
    if (!A || a === b) return false;
    if (!B) { MS.board[b] = A; MS.board[a] = null; if (sel === a) sel = b; save(); renderBoard(); return 'move'; }
    if (!A.g && !B.g && A.c === B.c && A.t === B.t && A.t < MAXT) {
      MS.board[b] = { c: A.c, t: A.t + 1 }; MS.board[a] = null; sel = b; save();
      renderBoard({ pop: b });
      const ce = boardEl.querySelector(`.it[data-i="${b}"]`), p = centerOf(ce);
      burst(p.x, p.y, 18 + A.t * 6, .8 + A.t * .15); sfx.merge(A.t); buzz(12 + A.t * 6);
      if (A.t >= 2) ftext(['', '', 'Bagus!', 'Mantap!', 'Luar biasa!'][A.t], p.x, p.y - 10);
      if (A.t + 1 === MAXT) say(`Wah, ${CHAINS[A.c].names[MAXT]}! Hebat 🎉`);
      return 'merge';
    }
    // tukar posisi
    MS.board[b] = A; MS.board[a] = B; if (sel === a) sel = b; save(); renderBoard(); return 'swap';
  }

  /* drag & drop (pointer events, jalan di HP dan laptop) */
  let drag = null;
  function idxAt(cx_, cy_) {
    const r = boardEl.getBoundingClientRect(), c = Math.floor((cx_ - r.left) / CELL), rr = Math.floor((cy_ - r.top) / CELL);
    if (c < 0 || c >= COLS || rr < 0 || rr >= ROWS) return -1; return rr * COLS + c;
  }
  boardEl.addEventListener('pointerdown', (e) => {
    const i = idxAt(e.clientX, e.clientY); if (i < 0 || !MS.board[i]) { sel = null; renderBoard(); return; }
    App.fx.unlockAudio();
    drag = { i, x0: e.clientX, y0: e.clientY, on: false, id: e.pointerId };
    boardEl.setPointerCapture(e.pointerId);
  });
  boardEl.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.on && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) {
      drag.on = true;
      const it = MS.board[drag.i], src = boardEl.querySelector(`.it[data-i="${drag.i}"]`);
      src && src.classList.add('drag');
      const g = document.createElement('img'); g.src = ART.url(artOf(it)); g.className = 'ghost'; g.style.width = g.style.height = CELL + 'px'; document.body.appendChild(g); drag.g = g;
      boardEl.querySelectorAll('.it').forEach((el) => { const j = +el.dataset.i, o = MS.board[j]; if (j !== drag.i && o && !o.g && !it.g && o.c === it.c && o.t === it.t && it.t < MAXT) el.classList.add('match'); });
    }
    if (drag.on) {
      drag.g.style.left = e.clientX + 'px'; drag.g.style.top = e.clientY + 'px';
      const t = idxAt(e.clientX, e.clientY);
      if (t !== drag.hover) { boardEl.querySelectorAll('.cell.hint').forEach((c) => c.classList.remove('hint')); drag.hover = t; if (t >= 0 && t !== drag.i) boardEl.querySelector(`.cell[data-c="${t}"]`).classList.add('hint'); }
    }
  });
  function endDrag(e, cancel) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.g) d.g.remove();
    if (!d.on) {
      if (cancel) return;
      const it = MS.board[d.i];
      if (it && it.g) { sel = d.i; tapGen(d.i); }
      else { sel = sel === d.i ? null : d.i; renderBoard(); }
      return;
    }
    const t = cancel ? -1 : idxAt(e.clientX, e.clientY);
    if (t < 0 || t === d.i) { renderBoard(); return; }
    tryMerge(d.i, t);
  }
  boardEl.addEventListener('pointerup', (e) => endDrag(e, false));
  boardEl.addEventListener('pointercancel', (e) => endDrag(e, true));


  /* ---------- NAIK LEVEL ---------- */
  function levelUp() {
    const L = level(); if (L <= MS.lvSeen) return;
    MS.lvSeen = L; const h = C.hadiahNaikLevel;
    if (h.energiPenuh) S.energi = Math.max(S.energi, C.energiMaks);
    App.wallet.credit(h.koin, 'naik-level'); saveNow(); hud(); renderDekor();
    confetti(); sfx.yay(); setTimeout(sfx.yay, 450); buzz([40, 60, 40, 60, 80]);
    const unl = [];
    C.pelanggan.forEach((c, i) => { if (c.level === L) unl.push(`<div class="unl"><img src="${ART.url('wajah' + i)}"><div><b>Pelanggan baru: ${c.nama}</b><br>${c.cerita}</div></div>`); });
    C.dekor.forEach((d) => { if (d.minLevel === L) unl.push(`<div class="unl"><img src="${ART.url('d_' + d.id)}"><div><b>Dekor terbuka: ${d.nama}</b><br>Buka pakai ${d.bintang} ⭐</div></div>`); });
    const nx = nextTeaser();
    modal(`<h3>NAIK LEVEL!</h3><div class="lvbig">${L}</div>${rewardHTML({ koin: h.koin })}<p>${h.energiPenuh ? 'Energi diisi penuh ⚡' : ''}</p>${unl.join('')}${nx ? `<p class="odds">Berikutnya: ${nx.t} di Lv ${nx.l} 👀</p>` : ''}`,
      [{ t: 'Asyik!', p: 1, f: () => { const c = centerOf($('#hudKoin img')); burst(c.x, c.y, 16); bump('#hudKoin'); sfx.coin(); } }]);
    renderOrders();
  }
  function nextTeaser() {
    const L = level(), c = [];
    C.dekor.forEach((d) => { if (d.minLevel > L) c.push({ l: d.minLevel, t: 'Dekor rahasia ???' }); });
    C.pelanggan.forEach((p) => { if (p.level > L) c.push({ l: p.level, t: 'Pelanggan baru ???' }); });
    if (C.areaBaru.level > L) c.push({ l: C.areaBaru.level, t: 'Area baru ???' });
    c.sort((a, b) => a.l - b.l); return c[0];
  }

  function placeRandomItem(t) {
    const k = emptyNear(24); if (k < 0) return false;
    MS.board[k] = { c: CH[Math.floor(Math.random() * CH.length)], t }; saveNow(); renderBoard({ pop: k }); return true;
  }
  function init() { layout(); ensureOrders(); renderBoard(); renderDekor(); }
  App.merge = { init, layout, renderBoard, renderDekor, renderOrders, ensureOrders, level, nextTeaser, levelUp, say, placeRandomItem, artOf, CHAINS, cell: () => CELL };
})(window.App);
