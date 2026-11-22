/* LARI KOKI – logika murni (tanpa DOM), bisa dites di Node.
 * Pemain (koki) lari di jalan 3 jalur. Di depan ada barisan kelompok "kue jahe" berwarna.
 * Lewati kelompok WARNA SAMA = ikut jadi kru (+n). Warna BEDA = kru berkurang (−n). Kru 0 = kalah.
 * Gerbang warna mengganti warna pemain. Setiap baris SELALU punya minimal 1 jalur aman (warna pemain) -> selalu bisa menang. */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else { root.App = root.App || {}; root.App.lariLogic = mod; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const WARNA = ['pink', 'kuning', 'hijau', 'biru'];
  const JALUR = 3, JARAK_BARIS = 12, AWAL = 18;
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  /* spesifikasi level (data-driven, makin tinggi makin panjang & banyak warna) */
  function spec(L) {
    return { baris: Math.min(26, 6 + L * 2), warna: L < 3 ? 2 : L < 6 ? 3 : 4, maksN: Math.min(9, 2 + L), gerbangTiap: L < 2 ? 0 : Math.max(3, 6 - Math.floor(L / 3)) };
  }
  /* buat level: rows = [{z, tipe:'kelompok', lanes:[{warna,n}]} | {z, tipe:'gerbang', lanes:[warna,warna,warna]}] */
  function genLevel(L, seed) {
    const r = rng(seed == null ? (Date.now() ^ (L * 2654435761)) : seed), sp = spec(L), pal = WARNA.slice(0, sp.warna);
    const pick = (a) => a[Math.floor(r() * a.length)];
    const rows = []; let z = AWAL;
    for (let i = 0; i < sp.baris; i++, z += JARAK_BARIS) {
      if (sp.gerbangTiap && i > 0 && i % sp.gerbangTiap === 0) {
        const g = []; for (let k = 0; k < JALUR; k++) g.push(pick(pal));
        rows.push({ z, tipe: 'gerbang', lanes: g });
        continue;
      }
      // warna yang mungkin dipegang pemain di baris ini (karena gerbang sebelumnya bisa memberi warna apa pun)
      const mungkin = possibleColors(rows, pal[0]);
      const lanes = [];
      for (let k = 0; k < JALUR; k++) lanes.push({ warna: pick(pal), n: 1 + Math.floor(r() * sp.maksN) });
      // jaminan: setiap warna yang mungkin dipegang pemain punya jalur aman di baris ini
      mungkin.forEach((w) => { if (!lanes.some((x) => x.warna === w)) { const k = Math.floor(r() * JALUR); if (!mungkin.includes(lanes[k].warna) || lanes.filter((x) => x.warna === lanes[k].warna).length > 1) lanes[k].warna = w; else lanes[(k + 1) % JALUR].warna = w; } });
      // kalau masih ada yang tidak terjamin (warna > jalur), paksa urut
      mungkin.forEach((w, idx) => { if (!lanes.some((x) => x.warna === w) && idx < JALUR) lanes[idx].warna = w; });
      rows.push({ z, tipe: 'kelompok', lanes });
    }
    return { level: L, rows, panjang: z + 8, warnaAwal: pal[0], palet: pal };
  }
  function possibleColors(rows, awal) {
    let set = [awal];
    rows.forEach((row) => { if (row.tipe === 'gerbang') set = Array.from(new Set(row.lanes)); });
    return set;
  }
  /* aturan tabrakan */
  function apply(state, row, lane) {
    const s = { kru: state.kru, warna: state.warna };
    if (row.tipe === 'gerbang') { s.warna = row.lanes[lane]; return Object.assign(s, { efek: 'warna' }); }
    const g = row.lanes[lane];
    if (g.warna === s.warna) { s.kru += g.n; return Object.assign(s, { efek: 'tambah', n: g.n }); }
    s.kru -= g.n; return Object.assign(s, { efek: 'kurang', n: g.n });
  }
  function simulate(lv, choices, kruAwal = 1) {
    let st = { kru: kruAwal, warna: lv.warnaAwal };
    for (let i = 0; i < lv.rows.length; i++) { st = apply(st, lv.rows[i], choices[i] | 0); if (st.kru <= 0) return { menang: false, kru: 0, baris: i }; }
    return { menang: true, kru: st.kru };
  }
  /* jalur terbaik (DP per warna) -> kru maksimum & pilihan jalurnya */
  function best(lv, kruAwal = 1) {
    let dp = { [lv.warnaAwal]: { kru: kruAwal, ch: [] } };
    lv.rows.forEach((row) => {
      const nx = {};
      Object.keys(dp).forEach((w) => { const cur = dp[w];
        for (let k = 0; k < JALUR; k++) { const s = apply({ kru: cur.kru, warna: w }, row, k); if (s.kru <= 0) continue;
          if (!nx[s.warna] || nx[s.warna].kru < s.kru) nx[s.warna] = { kru: s.kru, ch: cur.ch.concat(k) }; } });
      dp = nx;
    });
    let b = null; Object.keys(dp).forEach((w) => { if (!b || dp[w].kru > b.kru) b = dp[w]; });
    return b || { kru: 0, ch: [] };
  }
  /* hadiah: koin dibatasi (pagar untung pemilik); bintang dari kru vs kru terbaik */
  function hadiah(Cl, L, kru, kruTerbaik) {
    const koin = Math.min(Cl.koinMenangMaks, Cl.koinMenangDasar + Cl.koinMenangPerLevel * L);
    const r = kruTerbaik > 0 ? kru / kruTerbaik : 0;
    return { koin, bintang: r >= .7 ? 3 : r >= .4 ? 2 : 1 };
  }
  const laneOfX = (x) => Math.max(0, Math.min(JALUR - 1, Math.round((x + 1) * (JALUR - 1) / 2)));   // x -1..1 -> 0..2
  const xOfLane = (k) => -1 + k * 2 / (JALUR - 1);
  return { WARNA, JALUR, JARAK_BARIS, spec, genLevel, apply, simulate, best, hadiah, laneOfX, xOfLane, rng };
});
