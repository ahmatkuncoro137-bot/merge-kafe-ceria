/* ===== PENGATURAN GAME (ubah di sini) ===== */
(function (root) {
const GAME_CONFIG = {
  namaGame: 'Merge Kafe Ceria',
  namaKoin: 'Koin',

  // Kurs penukaran: sekian koin = sekian rupiah. Sengaja KONSERVATIF (angka koin besar & memuaskan, nilai rupiah kecil).
  kurs: { koin: 100000, rupiah: 1000 },          // 100 koin = Rp1
  // Tarik tunai. aktif:false = halaman tetap tampil tapi pengajuan MATI (dipakai build publik tanpa server).
  tarikTunai: { aktif: false, pesanNonaktif: 'Tarik tunai segera hadir — koin kamu tetap tersimpan' },
  // Minimal sekali tarik (dalam koin)
  minTarikKoin: 500000,                          // = Rp5.000
  // Batas total penarikan per hari (rupiah), per perangkat/akun
  batasHarianRupiah: 10000,
  // Pilihan nominal di form (rupiah)
  pilihanNominalRupiah: [5000, 10000],

  // Energi
  energiMaks: 100,
  energiRegenDetik: 60,   // +1 energi tiap 60 detik
  energiPerKlik: 1,       // biaya 1x ketuk generator

  // Tombol iklan (PLACEHOLDER – nanti AdMob rewarded ad)
  iklan: { hadiahKoin: 200, batasPerHari: 10 },

  // Nilai koin per tingkat item saat dikirim ke pesanan (index = tingkat)
  koinPerTingkat: [0, 8, 20, 40, 80, 160],

  // Dekorasi kafe yang dibuka pakai bintang
  // minLevel = baru bisa dibuka di level itu (sebelumnya tampil "???" sebagai teaser)
  dekor: [
    { id: 'lampu',   nama: 'Lampu',      bintang: 3,  minLevel: 1 },
    { id: 'rak',     nama: 'Rak Roti',   bintang: 5,  minLevel: 1 },
    { id: 'tanaman', nama: 'Tanaman',    bintang: 8,  minLevel: 2 },
    { id: 'papan',   nama: 'Papan Menu', bintang: 12, minLevel: 3 },
    { id: 'etalase', nama: 'Etalase',    bintang: 18, minLevel: 4 },
    { id: 'eskrim',  nama: 'Mesin Es Krim', bintang: 25, minLevel: 5 },
    { id: 'kucing',  nama: 'Kucing Kafe', bintang: 35, minLevel: 7 }
  ],
  // Area baru (teaser, belum dibuat di preview)
  areaBaru: { nama: 'Teras Taman', level: 10 },

  // Pesanan selesai per naik level
  pesananPerLevel: 4,
  // Hadiah naik level
  hadiahNaikLevel: { koin: 150, energiPenuh: true },

  // Hadiah login harian (7 hari, berulang). Bolos sehari = mulai dari hari 1 lagi.
  hadiahHarian: [
    { koin: 100 }, { energi: 20 }, { koin: 200 }, { kotak: 1 },
    { koin: 300, bintang: 1 }, { energi: 50 }, { koin: 600, bintang: 2 }
  ],

  // Kotak misteri gratis tiap X jam. Peluang ditampilkan ke pemain.
  kotakMisteri: {
    jedaJam: 4,
    hadiah: [
      { peluang: 40, koin: 100 },
      { peluang: 20, koin: 250 },
      { peluang: 20, energi: 15 },
      { peluang: 10, bintang: 1 },
      { peluang: 10, item: 3 }   // 1 barang tingkat 3 acak masuk papan
    ]
  },

  // Pelanggan & cerita (muncul bertahap sesuai level)
  pelanggan: [
    { nama: 'Bu Rina',    level: 1, cerita: 'Guru TK depan kafe. Tiap pulang ngajar beli kue buat murid yang ulang tahun.' },
    { nama: 'Pak Darto',  level: 1, cerita: 'Tukang ojek langganan. Katanya kopi di sini bikin semangat narik sampai malam.' },
    { nama: 'Mbak Sari',  level: 2, cerita: 'Mahasiswi rantau yang lagi skripsi. Ngetik di pojok kafe sambil ngemil pancake.' },
    { nama: 'Kakek Harjo', level: 3, cerita: 'Pensiunan masinis. Tiap sore beli puding buat cucunya, sambil cerita zaman kereta uap.' },
    { nama: 'Dik Nayla',  level: 5, cerita: 'Anak kecil yang bercita-cita jadi pembuat kue. Selalu nanya resep ke kamu!' }
  ],

  // Metode penarikan. aktif:false untuk menyembunyikan.
  // Warna = warna label (bukan logo resmi).
  metodeTarik: [
    { id: 'dana',      nama: 'DANA',      jenis: 'ewallet', warna: '#118EEA', aktif: true },
    { id: 'shopeepay', nama: 'ShopeePay', jenis: 'ewallet', warna: '#EE4D2D', aktif: true },
    { id: 'gopay',     nama: 'GoPay',     jenis: 'ewallet', warna: '#00AA13', aktif: true },
    { id: 'ovo',       nama: 'OVO',       jenis: 'ewallet', warna: '#4C3494', aktif: true },
    { id: 'linkaja',   nama: 'LinkAja',   jenis: 'ewallet', warna: '#E82529', aktif: true },
    { id: 'bank',      nama: 'Transfer Bank', jenis: 'bank', warna: '#0A3D7A', aktif: true,
      // Panjang nomor rekening per bank (cek ulang sebelum rilis)
      bank: [
        { nama: 'BCA', digitMin: 10, digitMax: 10 },
        { nama: 'BRI', digitMin: 15, digitMax: 15 },
        { nama: 'BNI', digitMin: 10, digitMax: 10 },
        { nama: 'Mandiri', digitMin: 13, digitMax: 13 },
        { nama: 'BSI', digitMin: 10, digitMax: 10 },
        { nama: 'CIMB Niaga', digitMin: 12, digitMax: 14 },
        { nama: 'Permata', digitMin: 10, digitMax: 16 },
        { nama: 'BTN', digitMin: 16, digitMax: 16 }
      ] }
  ],

  /* ===== MODE SUSUN UBIN (tile-match) ===== */
  ubin: {
    slotNampan: 7,           // nampan bawah
    koinMenangDasar: 60,     // koin saat menang level = dasar + perLevel x level (maks koinMenangMaks)
    koinMenangPerLevel: 15,
    koinMenangMaks: 250,
    powerUpPerLevel: 1,      // tiap power-up bisa dipakai sekian kali per level (tiap pakai = nonton iklan)
    lanjutPerLevel: 1,       // "Lanjut" setelah kalah (nonton iklan), sekian kali per level
    iklanAntarLevel: true    // iklan interstitial (CONTOH) setiap naik level
  },

  // Bonus pencapaian: sampai level X di Susun Ubin dapat bonus rupiah,
  // TAPI baru bisa dicairkan setelah total nonton iklan >= minIklan.
  bonusLevel: { level: 5, koin: 50000, minIklan: 150 },

  // Bonus pendaftaran (sekali per perangkat; di produksi dicek server per device + nomor HP)
  bonusDaftar: { koin: 3000 },
  // Undang teman (butuh server; di preview hanya tampilan)
  // Hadiah referral baru dibayar setelah teman yang diundang menonton minIklanDiundang iklan (tidak bisa dipancing akun palsu)
  referral: { aktif: false, koinPengundang: 10000, koinDiundang: 5000, minIklanDiundang: 30 },

  // Batas wajar untuk tanda curang (dipakai admin & nanti server)
  antiCurang: { maksKoinPerJamMain: 15000, maksPesananPerMenit: 6, maksReferralPerPerangkat: 2 },

  /* ===== UNTUNG PEMILIK =====
   * Estimasi KONSERVATIF pendapatan iklan Indonesia (eCPM rendah). Dipakai untuk:
   * 1) panel "Estimasi Untung" di admin, 2) KUOTA TARIK: total rupiah yang bisa ditarik seorang pemain
   *    tidak boleh melebihi maksPayoutPersen% dari pendapatan iklan yang ia hasilkan. Jadi pemilik SELALU untung
   *    per pemain, berapa pun koin yang ia kumpulkan. (Produksi: hitungan iklan dari AdMob SSV di server.) */
  pendapatan: { rpPerRewarded: 20, rpPerInterstitial: 8, maksPayoutPersen: 40, kuotaTarikDariIklan: true },
  // Profil pemain rata-rata untuk estimasi (per hari aktif)
  estimasiProfil: { hari: 30, rewardedPerHari: 8, interstitialPerHari: 6, pesananPerHari: 15, levelMerge: 6,
    menangUbinPerHari: 5, levelUbin: 8, naikLevelPerHari: 1, kotakPerHari: 3, loginHarian: true, referralPerPemain: 0.2 },

  /* ===== PEMBELIAN DALAM APLIKASI (opsional, PLACEHOLDER -> Google Play Billing) =====
   * Pembelian TIDAK PERNAH memberi koin yang bisa ditarik (bukan deposit). Hanya kenyamanan. */
  iap: { aktif: true, produk: [
    { id: 'hapus_iklan', nama: 'Hapus Iklan', harga: 'Rp15.000', ket: 'Iklan antar level hilang selamanya. Iklan berhadiah tetap bisa kamu pilih sendiri.', efek: { hapusIklan: true } },
    { id: 'paket_energi', nama: 'Paket Energi', harga: 'Rp5.000', ket: '+300 energi untuk Merge Kafe.', efek: { energi: 300 } }
  ] },

  // Ranking: DATA CONTOH untuk preview (versi asli butuh server)
  rankingDemo: [
    ['Rina', 42], ['Budi', 37], ['Sari', 31], ['Agus', 26], ['Dewi', 22],
    ['Joko', 18], ['Putri', 14], ['Eko', 11], ['Lina', 8], ['Rudi', 6], ['Tono', 4], ['Wati', 3]
  ]
};
if (typeof module === 'object' && module.exports) module.exports = GAME_CONFIG;
else { root.GAME_CONFIG = GAME_CONFIG; root.App = root.App || {}; root.App.C = GAME_CONFIG; }
})(typeof self !== 'undefined' ? self : this);
