/* Helper umum */
(function (App) {
  'use strict';
  const C = App.C;
  App.util = {
    $: (s) => document.querySelector(s),
    $$: (s) => document.querySelectorAll(s),
    fmt: (n) => Math.floor(n).toLocaleString('id-ID'),
    rp: (n) => 'Rp' + Math.floor(n).toLocaleString('id-ID'),
    koinKeRp: (k) => App.economy.koinKeRp(C, k),
    rpKeKoin: (r) => App.economy.rpKeKoin(C, r),
    today: () => App.economy.dayKey(Date.now()),
    yesterday: () => { const d = new Date(); d.setDate(d.getDate() - 1); return App.economy.dayKey(d); },
    mmss: (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h}j ${m}m` : `${m}:${String(s % 60).padStart(2, '0')}`; },
    /* tampilan rupiah perkiraan dari koin (pakai kurs config). Penarikan tetap dibulatkan ke bawah di economy.js */
    rpOf: (k) => { const v = Math.floor(k * C.kurs.rupiah / C.kurs.koin * 10) / 10; return 'Rp' + v.toLocaleString('id-ID', { maximumFractionDigits: v < 100 ? 1 : 0 }); },
    koinTxt: (k) => Math.floor(k).toLocaleString('id-ID') + ' Koin ≈ ' + App.util.rpOf(k),
    koinHTML: (k, plus) => `<span class="kv"><img src="${ART.url('koin')}" alt="">${plus ? '+' : ''}${Math.floor(k).toLocaleString('id-ID')} <small>≈ ${App.util.rpOf(k)}</small></span>`,
    centerOf: (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  };
})(window.App);
