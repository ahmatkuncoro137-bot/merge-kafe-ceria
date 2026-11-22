/* Level Susun Ubin (data). Tambah level = tambah baris. Setelah baris terakhir pakai rumus `lanjutan`.
 * layout: 'grid' (1 lapis rapi) | 'tumpuk' (berlapis acak, selalu bisa diselesaikan).
 * ubin harus kelipatan 3. jenis = banyak jenis gambar. */
(function (root) {
  const LEVELS = [
    { layout: 'grid', ubin: 12, jenis: 4, lapis: 1 },     // 1: sangat gampang
    { layout: 'tumpuk', ubin: 72, jenis: 10, lapis: 4 },  // 2: lonjakan kesulitan
    { layout: 'tumpuk', ubin: 90, jenis: 12, lapis: 5 },
    { layout: 'tumpuk', ubin: 108, jenis: 14, lapis: 6 },
    { layout: 'tumpuk', ubin: 120, jenis: 15, lapis: 6 },
    { layout: 'tumpuk', ubin: 132, jenis: 16, lapis: 7 },
    { layout: 'tumpuk', ubin: 141, jenis: 17, lapis: 7 },
    { layout: 'tumpuk', ubin: 150, jenis: 18, lapis: 8 }
  ];
  const lanjutan = (L) => ({ layout: 'tumpuk', ubin: 150, jenis: Math.min(22, 18 + Math.floor((L - 8) / 3)), lapis: 8 });
  const get = (L) => LEVELS[L - 1] || lanjutan(L);
  const API = { LEVELS, get };
  if (typeof module === 'object' && module.exports) module.exports = API;
  else { root.App = root.App || {}; root.App.data = root.App.data || {}; root.App.data.ubin = API; }
})(typeof self !== 'undefined' ? self : this);
