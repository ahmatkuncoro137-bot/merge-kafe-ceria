/* Pengaturan pemilik (override config). Hanya halaman admin yang menulis. Game hanya membaca.
 * PREVIEW: disimpan di localStorage perangkat ini. PRODUKSI: disimpan di server (tabel settings,
 * hanya bisa ditulis admin lewat security rules) dan diambil saat app dibuka. Lihat README > SECURITY. */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else { root.App = root.App || {}; root.App.settings = mod; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const KEY = 'settings_v1';
  const int = (v, min, max) => { v = Math.floor(Number(v)); if (!Number.isFinite(v) || v < min || v > max) throw new Error('angka di luar batas'); return v; };
  /* Hanya field ini yang boleh diubah (whitelist) + validasinya */
  const FIELDS = {
    'kurs.koin': (v) => int(v, 1, 1e7), 'kurs.rupiah': (v) => int(v, 1, 1e7),
    minTarikKoin: (v) => int(v, 1, 1e9), batasHarianRupiah: (v) => int(v, 0, 1e8),
    pilihanNominalRupiah: (v) => { const a = (Array.isArray(v) ? v : String(v).split(',')).map((x) => int(x, 1000, 1e8)); if (!a.length || a.length > 6) throw new Error('1–6 nominal'); return a.sort((x, y) => x - y); },
    'bonusLevel.level': (v) => int(v, 2, 999), 'bonusLevel.koin': (v) => int(v, 0, 1e9), 'bonusLevel.minIklan': (v) => int(v, 0, 10000),
    'bonusDaftar.koin': (v) => int(v, 0, 1e8),
    'iklan.hadiahKoin': (v) => int(v, 0, 1e6), 'iklan.batasPerHari': (v) => int(v, 0, 1000),
    'hadiahNaikLevel.koin': (v) => int(v, 0, 1e7), 'ubin.koinMenangDasar': (v) => int(v, 0, 1e7), 'ubin.koinMenangPerLevel': (v) => int(v, 0, 1e6), 'ubin.koinMenangMaks': (v) => int(v, 0, 1e7),
    'lari.koinMenangDasar': (v) => int(v, 0, 1e7), 'lari.koinMenangPerLevel': (v) => int(v, 0, 1e6), 'lari.koinMenangMaks': (v) => int(v, 0, 1e7),
    'referral.koinPengundang': (v) => int(v, 0, 1e8), 'referral.koinDiundang': (v) => int(v, 0, 1e8),
    'pendapatan.rpPerRewarded': (v) => int(v, 0, 10000), 'pendapatan.rpPerInterstitial': (v) => int(v, 0, 10000), 'pendapatan.maksPayoutPersen': (v) => int(v, 1, 90),
    metodeAktif: (v) => { if (!Array.isArray(v)) throw new Error('daftar metode'); return v.map(String); }
  };
  const getPath = (o, p) => p.split('.').reduce((a, k) => a && a[k], o);
  const setPath = (o, p, v) => { const ks = p.split('.'), last = ks.pop(); const t = ks.reduce((a, k) => (a[k] = a[k] || {}), o); t[last] = v; };
  function sanitize(over) {
    const out = {};
    Object.keys(over || {}).forEach((k) => { if (FIELDS[k]) { try { out[k] = FIELDS[k](over[k]); } catch (e) { /* abaikan nilai rusak */ } } });
    return out;
  }
  function apply(C, over) {
    const o = sanitize(over);
    Object.keys(o).forEach((k) => {
      if (k === 'metodeAktif') C.metodeTarik.forEach((m) => { m.aktif = o.metodeAktif.includes(m.id); });
      else setPath(C, k, o[k]);
    });
    return C;
  }
  function current(C) { const o = {}; Object.keys(FIELDS).forEach((k) => { o[k] = k === 'metodeAktif' ? C.metodeTarik.filter((m) => m.aktif).map((m) => m.id) : getPath(C, k); }); return o; }
  function load(kv) { const d = kv.get(KEY); return d && d.values ? d : { values: {}, diubah: null }; }
  function save(kv, values, now) { const v = sanitize(values); kv.set(KEY, { values: v, diubah: new Date(now || Date.now()).toISOString() }); return v; }
  return { KEY, FIELDS, sanitize, apply, current, load, save };
});
