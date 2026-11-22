/* Data mode Merge Kafe. Tambah rantai/barang di sini (gambar di art.js dengan id <rantai><tingkat>). */
(function (root) {
  const DATA = {
    cols: 7, rows: 8, maxTier: 5,  // nama 'gen' di bawah hanya label lama (generator sudah dihapus)
    chains: {
      tepung: { gen: 'Karung Tepung', names: ['', 'Tepung', 'Adonan', 'Roti', 'Cupcake', 'Kue Tart'] },
      telur: { gen: 'Ayam Petelur', names: ['', 'Telur', 'Kocokan Telur', 'Puding', 'Pancake', 'Kue Lapis'] },
      buah: { gen: 'Kebun Stroberi', names: ['', 'Stroberi', 'Keranjang Buah', 'Selai', 'Pie Buah', 'Kue Stroberi'] },
      kopi: { gen: 'Mesin Kopi', names: ['', 'Biji Kopi', 'Kopi', 'Kopi Susu', 'Es Kopi', 'Frappe'] }
    },
    // Papan awal: barang tetap di sel berikut, sisa sel langsung diisi acak -> papan PENUH sejak awal (tanpa generator)
    // [indeks sel, rantai, tingkat]
    startBoard: [[9, 'tepung', 1], [10, 'tepung', 1], [12, 'telur', 1], [17, 'tepung', 2], [23, 'buah', 1], [24, 'buah', 1],
      [30, 'kopi', 1], [31, 'kopi', 1], [38, 'telur', 1], [44, 'kopi', 2]],
    // Pesanan: tingkat maks = min(maxTier, 2 + floor(level / naikTiapLevel))
    // Isi ulang papan: sel kosong langsung diisi barang tingkat 1 (atau tingkat 2 dengan peluang ini)
    papan: { peluangT2: 0.18 },
    pesanan: { slot: 3, naikTiapLevel: 2, peluangDuaBarangMulaiLv2: 0.5, peluangSpawnTingkat2: 0.12 }
  };
  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else { root.App = root.App || {}; root.App.data = root.App.data || {}; root.App.data.merge = DATA; }
})(typeof self !== 'undefined' ? self : this);
