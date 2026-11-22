/* Ekonomi & penarikan – logika murni + buku besar (ledger). Bisa diuji di Node (tests/economy.test.js).
 * Aturan penting:
 *  - Koin dipotong/ditahan SEKALI saat pengajuan (write-ahead: simpan ke save dulu, lalu ledger).
 *  - ID pengajuan idempoten: kirim dua kali dengan reqId sama = tidak memotong dua kali.
 *  - Status: Menunggu -> Diproses -> Dibayar ; Menunggu/Diproses -> Ditolak. Dibayar & Ditolak terkunci.
 *  - Ditolak -> koin dikembalikan tepat satu kali (dicatat di save.refunded).
 *  - Semua perubahan masuk audit log. */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else { root.App = root.App || {}; root.App.economy = mod; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ST = { MENUNGGU: 'Menunggu', DIPROSES: 'Diproses', DIBAYAR: 'Dibayar', DITOLAK: 'Ditolak' };
  const TRANSITIONS = { Menunggu: ['Diproses', 'Ditolak'], Diproses: ['Dibayar', 'Ditolak'], Dibayar: [], Ditolak: [] };
  const LEDGER_KEY = 'ledger_v1';

  const koinKeRp = (C, k) => Math.floor(k * C.kurs.rupiah / C.kurs.koin);
  const rpKeKoin = (C, r) => Math.ceil(r * C.kurs.koin / C.kurs.rupiah);
  const dayKey = (d) => { d = new Date(d); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  const normPhone = (s) => { s = String(s || '').replace(/[\s.\-()]/g, ''); if (s.startsWith('+62')) s = '0' + s.slice(3); else if (/^62\d/.test(s)) s = '0' + s.slice(2); return s; };
  const normAcc = (s) => String(s || '').replace(/[\s.\-]/g, '');
  const normName = (s) => String(s || '').trim().replace(/\s+/g, ' ');
  const findMethod = (C, id) => C.metodeTarik.find((m) => m.id === id && m.aktif);
  const usedToday = (list, day) => list.filter((r) => r.hari === day && r.status !== ST.DITOLAK).reduce((a, r) => a + r.rupiah, 0);
  const newReqId = (now, rnd) => 'TT-' + Number(now).toString(36).toUpperCase() + '-' + Math.floor((rnd != null ? rnd : Math.random()) * 46656).toString(36).toUpperCase().padStart(3, '0');

  /* Validasi input form. ctx: { saldo, list, day } */
  function validate(C, input, ctx) {
    const e = {};
    if (C.tarikTunai && C.tarikTunai.aktif === false) return { ok: false, errors: { umum: C.tarikTunai.pesanNonaktif || 'Tarik tunai belum tersedia.' }, clean: null };
    const m = findMethod(C, input.metode);
    if (!m) e.metode = 'Pilih metode penarikan.';
    const rupiah = Number(input.rupiah);
    if (!C.pilihanNominalRupiah.includes(rupiah)) e.rupiah = 'Pilih nominal.';
    const koin = rpKeKoin(C, rupiah || 0);
    let nomor = '', bank = '';
    if (m) {
      if (m.jenis === 'bank') {
        const b = (m.bank || []).find((x) => x.nama === input.bank);
        if (!b) e.bank = 'Pilih bank.';
        nomor = normAcc(input.nomor);
        if (!/^\d+$/.test(nomor)) e.nomor = 'Nomor rekening hanya boleh angka.';
        else if (b && (nomor.length < b.digitMin || nomor.length > b.digitMax)) e.nomor = `Nomor rekening ${b.nama} harus ${b.digitMin === b.digitMax ? b.digitMin : b.digitMin + '–' + b.digitMax} digit.`;
        bank = b ? b.nama : '';
        if (normAcc(input.nomor2) !== nomor) e.nomor2 = 'Nomor rekening tidak sama. Ketik ulang dengan teliti.';
      } else {
        nomor = normPhone(input.nomor);
        if (!/^08\d{8,11}$/.test(nomor)) e.nomor = `Nomor ${m.nama} harus diawali 08 dan 10–13 digit.`;
        if (normPhone(input.nomor2) !== nomor) e.nomor2 = 'Nomor tidak sama. Ketik ulang dengan teliti.';
      }
    }
    const nama = normName(input.nama);
    if (!/^[\p{L}][\p{L} .'\-]{2,49}$/u.test(nama)) e.nama = 'Isi nama penerima sesuai akun (minimal 3 huruf).';
    if (!e.rupiah) {
      if (koin < C.minTarikKoin) e.rupiah = 'Nominal di bawah minimal penarikan.';
      else if (ctx.saldo < koin) e.rupiah = `Koin belum cukup. Butuh ${koin.toLocaleString('id-ID')} Koin.`;
      else if (usedToday(ctx.list, ctx.day) + rupiah > C.batasHarianRupiah) e.rupiah = 'Melebihi batas penarikan hari ini.';
      else if (ctx.iklan) { const k = kuotaTarik(C, ctx.iklan, ctx.list); if (k.aktif && rupiah > k.sisaRp) e.rupiah = `Kuota tarik dari iklan baru Rp${k.sisaRp.toLocaleString('id-ID')}. Tonton iklan untuk menambah kuota.`; }
    }
    if (ctx.list.some((r) => r.status === ST.MENUNGGU)) e.umum = 'Masih ada penarikan yang menunggu. Tunggu diproses dulu ya.';
    const ok = Object.keys(e).length === 0;
    return { ok, errors: e, clean: ok ? { metode: m.id, metodeNama: m.nama, metodeWarna: m.warna, jenis: m.jenis, bank, nomor, nama, rupiah, koin } : null };
  }

  /* Pendapatan iklan (Rp, estimasi konservatif) dari jumlah iklan yang benar-benar ditonton. */
  function pendapatanIklan(C, iklan) {
    const P = C.pendapatan || {};
    return Math.floor((iklan.rewarded || 0) * (P.rpPerRewarded || 0) + (iklan.interstitial || 0) * (P.rpPerInterstitial || 0));
  }
  /* KUOTA TARIK: total tarik (Menunggu/Diproses/Dibayar) <= maksPayoutPersen% x pendapatan iklan pemain ini.
   * Inilah yang menjamin pemilik selalu untung per pemain. Pembelian (IAP) sengaja TIDAK menambah kuota. */
  function kuotaTarik(C, iklan, list) {
    const P = C.pendapatan || {};
    if (!P.kuotaTarikDariIklan) return { aktif: false, sisaRp: Infinity, batasRp: Infinity, terpakaiRp: 0 };
    const batasRp = Math.floor(pendapatanIklan(C, iklan) * (P.maksPayoutPersen || 0) / 100);
    const terpakaiRp = (list || []).filter((r) => r.status !== ST.DITOLAK).reduce((a, r) => a + r.rupiah, 0);
    return { aktif: true, batasRp, terpakaiRp, sisaRp: Math.max(0, batasRp - terpakaiRp) };
  }
  /* ESTIMASI UNTUNG per pemain rata-rata (profil di config.estimasiProfil, bisa diubah di admin). */
  function estimasi(C, prof) {
    const P = Object.assign({}, C.estimasiProfil || {}, prof || {}), H = P.hari || 30, U = C.ubin || {};
    const rata = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
    const maxT = Math.min(5, 2 + Math.floor((P.levelMerge || 1) / 2)), tiers = [];
    for (let t = 2; t <= maxT; t++) tiers.push(C.koinPerTingkat[t] || 0);
    const koinPesanan = rata(tiers) * ((P.levelMerge || 1) < 2 ? 1 : 1.5);
    const koinUbin = Math.min(U.koinMenangMaks || Infinity, (U.koinMenangDasar || 0) + (U.koinMenangPerLevel || 0) * (P.levelUbin || 1));
    const KM = (C.kotakMisteri && C.kotakMisteri.hadiah) || [], totP = KM.reduce((a, h) => a + h.peluang, 0) || 1;
    const koinKotak = KM.reduce((a, h) => a + (h.koin || 0) * h.peluang / totP, 0);
    const HH = C.hadiahHarian || [], koinHarian = HH.reduce((a, h) => a + (h.koin || 0) + (h.kotak || 0) * koinKotak, 0) / (HH.length || 1);
    const rewarded = Math.min(P.rewardedPerHari, (C.iklan && C.iklan.batasPerHari) || Infinity) * H, inter = P.interstitialPerHari * H;
    const B = C.bonusLevel || {}, R = C.referral || {};
    const dapatBonus = rewarded + inter >= (B.minIklan || 0) ? 1 : 0;
    const rows = [
      ['Iklan berhadiah', rewarded * ((C.iklan && C.iklan.hadiahKoin) || 0)],
      ['Pesanan Merge', P.pesananPerHari * H * koinPesanan],
      ['Naik level Merge', (P.naikLevelPerHari || 0) * H * ((C.hadiahNaikLevel && C.hadiahNaikLevel.koin) || 0)],
      ['Menang Susun Ubin', P.menangUbinPerHari * H * koinUbin],
      ['Menang Lari Koki', (P.menangLariPerHari || 0) * H * (C.lari ? Math.min(C.lari.koinMenangMaks, C.lari.koinMenangDasar + C.lari.koinMenangPerLevel * (P.levelLari || 1)) : 0)],
      ['Kalender harian', P.loginHarian ? H * koinHarian : 0],
      ['Kotak misteri', (P.kotakPerHari || 0) * H * koinKotak],
      ['Bonus daftar', (C.bonusDaftar && C.bonusDaftar.koin) || 0],
      [`Bonus Level ${B.level || '-'} (${B.minIklan || 0} iklan)`, dapatBonus * (B.koin || 0)],
      ['Referral (rata-rata)', R.aktif === false ? 0 : (P.referralPerPemain || 0) * ((R.koinPengundang || 0) + (R.koinDiundang || 0))]
    ].map(([sumber, koin]) => ({ sumber, koin: Math.round(koin), rp: koinKeRp(C, Math.round(koin)) }));
    const pend = { rewarded: rewarded * ((C.pendapatan || {}).rpPerRewarded || 0), interstitial: inter * ((C.pendapatan || {}).rpPerInterstitial || 0) };
    pend.total = pend.rewarded + pend.interstitial;
    const koin = rows.reduce((a, r) => a + r.koin, 0), payoutRp = koinKeRp(C, koin);
    const persen = pend.total ? Math.round(payoutRp / pend.total * 1000) / 10 : (payoutRp ? Infinity : 0);
    const maks = (C.pendapatan || {}).maksPayoutPersen || 40;
    return { hari: H, iklan: { rewarded, interstitial: inter }, pendapatan: pend, rows, koin, payoutRp, persen, maks, marginRp: pend.total - payoutRp, aman: persen <= maks };
  }

  /* Ledger: { requests:[], audit:[] } di storage */
  function createLedger(storage) {
    const read = () => { const d = storage.get(LEDGER_KEY); return d && Array.isArray(d.requests) ? d : { requests: [], audit: [] }; };
    const write = (d) => storage.set(LEDGER_KEY, d);
    const log = (d, entry) => { d.audit.push(Object.assign({ t: new Date(entry.now || Date.now()).toISOString() }, entry, { now: undefined })); };
    return {
      read, list: () => read().requests, audit: () => read().audit,
      has(id) { return read().requests.some((r) => r.id === id); },
      append(req, now) {
        const d = read(); if (d.requests.some((r) => r.id === req.id)) return false;
        d.requests.push(req); log(d, { now, aksi: 'ajukan', id: req.id, oleh: 'pemain', detail: `${req.metodeNama}${req.bank ? ' ' + req.bank : ''} ${req.nomor} a.n. ${req.nama} Rp${req.rupiah}` }); write(d); return true;
      },
      transition(id, to, opt) {
        opt = opt || {}; const d = read(), r = d.requests.find((x) => x.id === id);
        if (!r) return { ok: false, error: 'Pengajuan tidak ditemukan.' };
        if (!(TRANSITIONS[r.status] || []).includes(to)) return { ok: false, error: `Status ${r.status} tidak bisa diubah ke ${to}.` };
        const dari = r.status; r.status = to; r.diubah = new Date(opt.now || Date.now()).toISOString();
        if (to === ST.DIBAYAR) { r.dibayarPada = r.diubah; r.refTransfer = opt.ref || ''; }
        if (to === ST.DITOLAK) r.alasan = opt.alasan || '';
        log(d, { now: opt.now, aksi: dari + '→' + to, id, oleh: opt.oleh || 'admin', detail: opt.ref || opt.alasan || '' });
        write(d); return { ok: true, request: r };
      },
      markRefunded(id, now) {
        const d = read(), r = d.requests.find((x) => x.id === id); if (!r || r.dikembalikan) return;
        r.dikembalikan = true; log(d, { now, aksi: 'koin dikembalikan', id, oleh: 'sistem', detail: r.koin + ' Koin' }); write(d);
      },
      logEvent(entry) { const d = read(); log(d, entry); write(d); },
      importLegacy(arr) { const d = read(); let n = 0; (arr || []).forEach((r) => { if (r && r.id && !d.requests.some((x) => x.id === r.id)) { d.requests.push(Object.assign({ nomor: r.dana, metodeNama: 'DANA', metode: 'dana' }, r)); n++; } }); if (n) { log(d, { aksi: 'impor data lama', id: '-', oleh: 'sistem', detail: n + ' pengajuan' }); write(d); } return n; }
    };
  }

  /* Ajukan penarikan secara atomik. state = objek save (punya koin, wal, refunded). persist() = simpan state SEKARANG.
   * Urutan: (1) potong koin + simpan pengajuan di state.wal.pending -> persist  (2) tulis ke ledger  (3) hapus pending -> persist.
   * Kalau app mati di antara (1) dan (2), recover() menuliskan ulang pending ke ledger tanpa memotong lagi. */
  function submit({ C, state, persist, ledger, input, now }) {
    now = now || Date.now();
    if (!input.reqId) return { ok: false, errors: { umum: 'ID pengajuan kosong.' } };
    const existing = ledger.list().find((r) => r.id === input.reqId) || (state.wal && state.wal.pending && state.wal.pending.id === input.reqId ? state.wal.pending : null);
    if (existing) return { ok: true, duplicate: true, request: existing };
    const v = validate(C, input, { saldo: state.koin, list: ledger.list(), day: dayKey(now), iklan: { rewarded: state.iklanRewarded || 0, interstitial: state.iklanInter || 0 } });
    if (!v.ok) return { ok: false, errors: v.errors };
    const req = Object.assign({ id: input.reqId, waktu: new Date(now).toISOString(), hari: dayKey(now), status: ST.MENUNGGU, dikembalikan: false }, v.clean, { device: String(input.device || ''), snap: input.snap || null });
    state.koin -= req.koin; state.wal = { pending: req }; persist();
    ledger.append(req, now);
    state.wal = { pending: null }; persist();
    return { ok: true, request: req };
  }
  function recover({ state, persist, ledger, now }) {
    const p = state.wal && state.wal.pending; if (!p) return false;
    if (!ledger.has(p.id)) ledger.append(p, now);
    state.wal = { pending: null }; persist(); return true;
  }
  /* Kembalikan koin untuk pengajuan Ditolak, tepat sekali per ID. */
  function applyRefunds({ state, persist, ledger, now }) {
    state.refunded = state.refunded || [];
    let total = 0;
    ledger.list().forEach((r) => {
      if (r.status === ST.DITOLAK && !state.refunded.includes(r.id)) { state.koin += r.koin; state.refunded.push(r.id); total += r.koin; persist(); ledger.markRefunded(r.id, now); }
    });
    return total;
  }
  /* Tanda curang untuk ditinjau admin (di produksi dihitung server). */
  function fraudFlags(r, all, C) {
    const f = [], A = C.antiCurang || {};
    const others = all.filter((x) => x.id !== r.id && x.status !== ST.DITOLAK);
    if (r.device && others.some((x) => x.nomor === r.nomor && x.device && x.device !== r.device)) f.push('Nomor penerima sama dipakai perangkat lain');
    if (r.device) { const nos = new Set(others.filter((x) => x.device === r.device).map((x) => x.nomor)); nos.delete(r.nomor); if (nos.size) f.push(`Perangkat ini pakai ${nos.size + 1} nomor penerima berbeda`); }
    if (!r.snap) f.push('Tanpa data main (tidak bisa dicek)');
    else {
      const jam = Math.max(r.snap.detikMain || 0, 60) / 3600, laju = (r.snap.koinDidapat || 0) / jam;
      if (A.maksKoinPerJamMain && laju > A.maksKoinPerJamMain) f.push(`Koin terlalu cepat: ${Math.round(laju).toLocaleString('id-ID')}/jam main (batas ${A.maksKoinPerJamMain.toLocaleString('id-ID')})`);
      if ((r.snap.koinDidapat || 0) < r.koin) f.push('Koin didapat dari main lebih kecil dari yang ditarik');
      if ((r.snap.referralSePerangkat || 0) >= (A.maksReferralPerPerangkat || 2)) f.push(`Banyak referral dari perangkat yang sama (${r.snap.referralSePerangkat})`);
    }
    return f;
  }
  return { pendapatanIklan, kuotaTarik, estimasi, fraudFlags, ST, TRANSITIONS, LEDGER_KEY, koinKeRp, rpKeKoin, dayKey, normPhone, normAcc, normName, findMethod, usedToday, newReqId, validate, createLedger, submit, recover, applyRefunds };
});
