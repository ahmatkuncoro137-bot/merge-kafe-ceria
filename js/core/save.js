/* Data simpanan ber-versi + migrasi. Tambah versi baru: naikkan VERSION dan tambah fungsi di MIGRATIONS. */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else { root.App = root.App || {}; root.App.saveData = mod; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const VERSION = 3, KEY = 'save';
  const dayKey = (d) => { d = new Date(d); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  function defaults(C, data, now) {
    now = now || Date.now();
    const N = data.cols * data.rows, b = new Array(N).fill(null);
    data.startBoard.forEach((x) => { b[x[0]] = x[1] === 'gen' ? { g: x[2] } : { c: x[1], t: x[2] }; });
    return {
      v: VERSION, dibuat: now,
      koin: 0, bintang: 0, energi: C.energiMaks, eTime: now,
      merge: { board: b, done: 0, orders: [], oid: 1, lvSeen: 1, dekor: {} },
      ubin: { level: 1, best: 1, run: null },
      iklan: { day: dayKey(now), n: 0 }, iklanTotal: 0, iklanRewarded: 0, iklanInter: 0,
      iap: { hapusIklan: false, beli: [] },
      daily: { last: null, streak: 0 }, boxAt: 0,
      bonus: { didapat: false, dicairkan: false },
      wal: { pending: null }, refunded: [],
      suara: true
    };
  }
  /* MIGRATIONS[n] mengubah data versi n menjadi versi n+1 */
  const MIGRATIONS = {
    1(o) { // v1 (preview awal, semua di root) -> v2 (merge dipisah, ledger, refunded)
      return {
        v: 2, dibuat: o.eTime || Date.now(), koin: o.koin || 0, bintang: o.bintang || 0, energi: o.energi, eTime: o.eTime,
        merge: { board: o.board, done: o.done || 0, orders: o.orders || [], oid: o.oid || 1, lvSeen: o.lvSeen || 1, dekor: o.dekor || {} },
        ubin: Object.assign({ level: 1, best: 1 }, o.ubin || {}, { run: null }),
        iklan: o.iklan, iklanTotal: o.iklanTotal || 0, daily: o.daily, boxAt: o.boxAt || 0,
        bonus: o.bonus || { didapat: false, dicairkan: false }, wal: { pending: null }, refunded: [], suara: o.suara !== false
      };
    },
    2(o) { // v2 -> v3: hitungan iklan dipisah per jenis (kuota tarik). Iklan lama dihitung sebagai interstitial (nilai terendah = konservatif).
      return Object.assign({}, o, { v: 3, iklanRewarded: 0, iklanInter: o.iklanTotal || 0, iap: { hapusIklan: false, beli: [] } });
    }
  };
  function migrate(raw, C, data, now) {
    const base = defaults(C, data, now);
    if (!raw || typeof raw !== 'object' || !raw.v) return { state: base, migrated: false, reset: !!raw };
    let o = raw, from = raw.v;
    if (from > VERSION) return { state: base, migrated: false, reset: true, error: 'versi lebih baru' };
    while (o.v < VERSION) { const f = MIGRATIONS[o.v]; if (!f) return { state: base, migrated: false, reset: true }; o = f(o); }
    // isi field baru yang belum ada (deep 1 level)
    const st = Object.assign({}, base, o);
    ['merge', 'ubin', 'bonus', 'wal', 'daily', 'iklan', 'iap'].forEach((k) => { st[k] = Object.assign({}, base[k], o[k] || {}); });
    if (!Array.isArray(st.merge.board) || st.merge.board.length !== data.cols * data.rows) st.merge.board = base.merge.board;
    return { state: st, migrated: from !== VERSION, from };
  }
  /* Penyimpan: satu objek state yang TIDAK pernah diganti (modul lain memegang referensinya). */
  function createStore(storage, C, data, legacyLoader) {
    let raw = storage.get(KEY);
    if (!raw && legacyLoader) raw = legacyLoader();
    const res = migrate(raw, C, data);
    const state = res.state; let t = 0;
    const saveNow = () => { clearTimeout(t); state.disimpan = Date.now(); storage.set(KEY, state); };
    const save = () => { clearTimeout(t); t = setTimeout(saveNow, 150); };
    if (res.migrated || !raw) saveNow();
    return { state, save, saveNow, info: res };
  }
  return { VERSION, KEY, defaults, migrate, MIGRATIONS, createStore, dayKey };
});
