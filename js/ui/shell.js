/* Kerangka aplikasi: HUD, hadiah, kotak misteri, menu & hadiah harian, iklan, suara, Tarik Tunai. */
(function (App) {
  'use strict';
  const C = App.C, S = App.state, E = App.economy;
  const { $, fmt, rp, koinKeRp, rpKeKoin, today, yesterday, mmss, centerOf, esc, rpOf, koinTxt, koinHTML } = App.util;
  const { sfx, burst, buzz, toast, bump, modal, closeModal, fly, confetti } = App.fx;
  const save = () => App.store.save(), saveNow = () => App.store.saveNow();

  function streakNow() { const l = S.daily.last; return (l === today() || l === yesterday()) ? S.daily.streak : 0; }
  function regen() {
    const per = C.energiRegenDetik * 1000;
    if (S.energi >= C.energiMaks) { S.eTime = Date.now(); return; }
    const k = Math.floor((Date.now() - S.eTime) / per);
    if (k > 0) { S.energi = Math.min(C.energiMaks, S.energi + k); S.eTime += k * per; save(); }
  }
  function hud() {
    regen();
    $('#vEnergi').textContent = S.energi;
    if (S.energi < C.energiMaks) { const s = Math.max(0, Math.ceil((S.eTime + C.energiRegenDetik * 1000 - Date.now()) / 1000)); $('#vEnergiT').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
    else $('#vEnergiT').textContent = 'penuh';
    $('#vKoin').textContent = fmt(S.koin); $('#vKoinRp').textContent = '≈ ' + rpOf(S.koin);
    $('#vBintang').textContent = S.bintang;
    const L = App.merge.level();
    $('#vLv').textContent = 'Lv ' + L;
    $('#lvFill').style.width = (S.merge.done % C.pesananPerLevel) / C.pesananPerLevel * 100 + '%';
    $('#vStreak').textContent = streakNow();
    const left = S.boxAt - Date.now(), kb = $('#btnKotak');
    kb.classList.toggle('ready', left <= 0); $('#kotakT').textContent = left <= 0 ? 'BUKA!' : mmss(left);
    const tp = tarikProgress();
    $('#tProgBar').style.width = tp.pct + '%'; $('#tProgTxt').textContent = tp.txt; $('#btnTarik').classList.toggle('ready', tp.ready);
    $('#areaTeaser').innerHTML = L >= C.areaBaru.level ? `<b>${C.areaBaru.nama}</b>segera hadir ✨` : `<b>🔒 ???</b>Area baru di Lv ${C.areaBaru.level}`;
    if (!$('#start').hidden) $('#sKotakT').textContent = left <= 0 ? 'Siap dibuka! 🎉' : 'Buka lagi ' + mmss(left);
  }

  /* ---------- HADIAH ---------- */
  function giveReward(r, from) {
    const to = { koin: centerOf($('#hudKoin img')), bintang: centerOf($('#hudBintang img')), energi: centerOf($('#hudEnergi img')) };
    from = from || { x: innerWidth / 2, y: innerHeight / 2 };
    ['koin', 'bintang', 'energi'].forEach((k) => {
      if (!r[k]) return;
      if (k === 'energi') S.energi = Math.min(C.energiMaks + 50, S.energi + r[k]); else if (k === 'koin') App.wallet.credit(r[k], 'hadiah'); else S[k] += r[k];   // dicatat langsung, animasi hanya tampilan
      saveNow();
      for (let i = 0; i < 4; i++) setTimeout(() => fly(k, from, to[k], () => { if (i === 3) { hud(); bump(k === 'koin' ? '#hudKoin' : k === 'bintang' ? '#hudBintang' : '#hudEnergi'); App.merge.renderDekor(); sfx.coin(); } }), i * 70);
    });
    if (r.kotak) { S.boxAt = 0; saveNow(); hud(); }
    if (r.item && !App.merge.placeRandomItem(r.item)) { App.wallet.credit(100, 'papan-penuh'); saveNow(); toast('Papan penuh, diganti +100 Koin'); }
  }
  function rewardHTML(r) {
    const a = [];
    if (r.koin) a.push(koinHTML(r.koin, true));
    if (r.bintang) a.push(`<span><img src="${ART.url('bintang')}">+${r.bintang}</span>`);
    if (r.energi) a.push(`<span><img src="${ART.url('energi')}">+${r.energi}</span>`);
    if (r.kotak) a.push(`<span><img src="${ART.url('kotak_full')}">Kotak</span>`);
    if (r.item) a.push(`<span>🎁 Barang Lv ${r.item}</span>`);
    return `<div class="rwds">${a.join('')}</div>`;
  }
  const rewardIcon = (r) => r.kotak ? 'kotak_full' : r.bintang && !r.koin ? 'bintang' : r.energi ? 'energi' : r.item ? 'tepung' + r.item : 'koin';
  const rewardLabel = (r) => r.koin ? '+' + r.koin + (r.bintang ? ' ⭐' + r.bintang : '') : r.energi ? '+' + r.energi : r.bintang ? '+' + r.bintang : r.kotak ? 'Kotak' : 'Lv' + r.item;

  /* ---------- KOTAK MISTERI ---------- */
  function oddsText() { return 'Peluang: ' + C.kotakMisteri.hadiah.map((h) => `${h.peluang}% ${h.koin ? koinTxt(h.koin) : h.energi ? h.energi + ' Energi' : h.bintang ? h.bintang + ' Bintang' : 'Barang Lv ' + h.item}`).join(' · '); }
  function openBox() {
    const left = S.boxAt - Date.now();
    if (left > 0) { modal(`<h3>Kotak Misteri</h3><div class="boxStage"><div class="bx"><img class="body" src="${ART.url('kotak')}"><img class="lid" src="${ART.url('kotak_tutup')}"></div></div><p>Kotak berikutnya siap dalam <b>${mmss(left)}</b> ⏳</p><p class="odds">Gratis tiap ${C.kotakMisteri.jedaJam} jam. ${oddsText()}</p>`); return; }
    modal(`<h3>Kotak Misteri!</h3><div class="boxStage" id="bxs"><div class="rays"></div><img class="prize" id="bxPrize"><div class="bx"><img class="body" src="${ART.url('kotak')}"><img class="lid" src="${ART.url('kotak_tutup')}"></div></div><div class="prizeTxt" id="bxTxt">Ketuk untuk buka!</div><p class="odds">${oddsText()}</p>`,
      [{ t: 'Buka!', p: 1, id: 'bxBtn', keep: true, f: () => {
        const btn = $('#bxBtn'); if (btn.dataset.st === 'open') { closeModal(); return; } if (btn.dataset.st) return; btn.dataset.st = 'shake'; btn.textContent = '...';
        const st = $('#bxs'); st.classList.add('shake'); sfx.spawn(); buzz([15, 40, 15, 40, 15]);
        let tot = C.kotakMisteri.hadiah.reduce((a, h) => a + h.peluang, 0), r = Math.random() * tot, pick = C.kotakMisteri.hadiah[0];
        for (const h of C.kotakMisteri.hadiah) { if ((r -= h.peluang) < 0) { pick = h; break; } }
        S.boxAt = Date.now() + C.kotakMisteri.jedaJam * 3600e3; saveNow(); hud();
        setTimeout(() => {
          st.classList.remove('shake'); st.classList.add('open');
          $('#bxPrize').src = ART.url(rewardIcon(pick));
          $('#bxTxt').textContent = pick.koin ? `+${koinTxt(pick.koin)}` : pick.energi ? `+${pick.energi} Energi!` : pick.bintang ? `+${pick.bintang} Bintang!` : `Barang Lv ${pick.item}!`;
          const c = centerOf(st); burst(c.x, c.y, 40, 1.4); sfx.yay(); buzz([30, 30, 60]);
          btn.dataset.st = 'open'; btn.textContent = 'Ambil';
          giveReward(pick, c);
        }, 1000);
      } }]);
  }
  $('#btnKotak').onclick = openBox;

  /* ---------- LAYAR MULAI + HADIAH HARIAN ---------- */
  function renderStart() {
    renderRef();
    const s = streakNow(), claimed = S.daily.last === today();
    const got = claimed ? ((s - 1) % 7) + 1 : s % 7, todayIdx = claimed ? -1 : s % 7;
    $('#sStreak').textContent = s;
    $('#cal').innerHTML = C.hadiahHarian.map((r, i) => `<div class="day${i < got ? ' got' : ''}${i === todayIdx ? ' today' : ''}${i === 6 ? ' big' : ''}">Hari ${i + 1}<img src="${ART.url(rewardIcon(r))}"><div class="amt">${rewardLabel(r)}</div></div>`).join('');
    const kb = $('#btnKlaim'); kb.disabled = claimed; const rr = C.hadiahHarian[Math.max(0, todayIdx)]; kb.textContent = claimed ? 'Sudah diklaim ✓ Besok balik lagi ya' : `Klaim Hari ${todayIdx + 1}` + (rr.koin ? ` · +${koinTxt(rr.koin)}` : rr.energi ? ` · +${rr.energi} Energi` : '');
    const left = S.boxAt - Date.now(); $('#sKotakT').textContent = left <= 0 ? 'Siap dibuka! 🎉' : 'Buka lagi ' + mmss(left);
    $('#sLariLv').textContent = `Level ${S.lari.level} · geser & kumpulkan kru`;
    $('#sUbinLv').textContent = `Level ${S.ubin.level} · Bonus ${fmt(C.bonusLevel.koin)} Koin di Lv ${C.bonusLevel.level}`;
    const nx = App.merge.nextTeaser(); $('#sNextT').textContent = nx ? nx.t : 'Semua terbuka!'; $('#sNextS').textContent = nx ? `terbuka di Lv ${nx.l} (kamu Lv ${App.merge.level()})` : '';
    const tp = tarikProgress(); $('#sTarikBar').style.width = tp.pct + '%'; $('#sTarikPct').textContent = Math.floor(tp.pct) + '%';
    $('#sTarikTxt').textContent = (C.tarikTunai && C.tarikTunai.aktif === false) ? `⏳ ${C.tarikTunai.pesanNonaktif}. Koin kamu: ${koinTxt(S.koin)}.` : `${tp.txt} Minimal tarik ${koinTxt(C.minTarikKoin)}. Koin kamu: ${koinTxt(S.koin)}.`;
  }
  $('#btnKlaim').onclick = () => {
    if (S.daily.last === today()) return;
    const ns = streakNow() + 1, r = C.hadiahHarian[(ns - 1) % 7];
    S.daily = { last: today(), streak: ns }; saveNow();
    const c = centerOf($('#cal .day.today') || $('#btnKlaim'));
    burst(c.x, c.y, 30, 1.1); sfx.yay(); buzz([20, 30, 40]);
    giveReward(r, c); renderStart(); hud();
  };
  $('#btnRank').onclick = () => App.ubin.openRank();
  function openToko() {
    const list = App.iap.products();
    modal(`<h3>🛍️ Toko</h3><p class="note">Opsional, hanya untuk kenyamanan. Pembelian <b>tidak</b> memberi koin dan tidak bisa ditarik.</p>` + list.map((p) => `<div class="tokoItem"><div><b>${esc(p.nama)}</b><small>${esc(p.ket)}</small></div><button type="button" class="primary" data-iap="${esc(p.id)}" ${App.iap.owned(p.id) ? 'disabled' : ''}>${App.iap.owned(p.id) ? 'Sudah dimiliki ✓' : esc(p.harga)}</button></div>`).join('') + '<p class="odds">[ CONTOH ] Pembayaran asli lewat Google Play di versi Android.</p>', [{ t: 'Tutup', p: 1 }]);
    document.querySelectorAll('[data-iap]').forEach((b) => b.onclick = async () => {
      const id = b.dataset.iap, ok = await App.iap.buy(id);
      if (ok) { hud(); sfx.yay(); toast(id === 'hapus_iklan' ? 'Iklan antar level dihapus ✓' : 'Energi bertambah ⚡'); }
    });
  }
  if (App.iap && App.iap.enabled() && App.iap.products().length) { $('#btnToko').hidden = false; $('#btnToko').onclick = openToko; }
  $('#btnUbin').onclick = () => { $('#start').hidden = true; App.fx.unlockAudio(); App.ubin.open(); };
  $('#btnLari').onclick = () => { $('#start').hidden = true; App.fx.unlockAudio(); App.lari.open(); };
  $('#btnHome').onclick = () => { renderStart(); $('#start').hidden = false; };
  $('#btnMain').onclick = () => { $('#start').hidden = true; App.fx.unlockAudio(); sfx.spawn(); App.merge.say('Halo! Bantu kami layani pelanggan ya 💕', 0); setTimeout(() => { if ($('#start').hidden) App.merge.say('Aku siap masak! Ayo gabung bahannya 👨‍🍳', 1); }, 2700); };
  $('#hudStreak').onclick = () => { renderStart(); $('#start').hidden = false; };
  $('#sKotak').onclick = () => { $('#start').hidden = true; openBox(); };


  /* ---------- IKLAN ---------- */
  function watchAd(o) { return App.ads.rewarded(o).then((ok) => { if (ok) { o.onDone && o.onDone(); } else { o.onCancel && o.onCancel(); } return ok; }); }
  $('#btnIklan').onclick = () => {
    if (S.iklan.day !== today()) S.iklan = { day: today(), n: 0 };
    const sisa = C.iklan.batasPerHari - S.iklan.n;
    if (sisa <= 0) { modal(`<h3>Iklan habis</h3><p>Batas ${C.iklan.batasPerHari} iklan berhadiah koin per hari sudah tercapai. Coba lagi besok ya.</p>`); return; }
    watchAd({ placement: 'koin', hadiah: `+${koinTxt(C.iklan.hadiahKoin)}`, info: `sisa hari ini ${sisa}×`, onDone: () => {
      S.iklan.n++; saveNow(); const from = centerOf($('#btnIklan')), to = centerOf($('#hudKoin img'));
      App.wallet.credit(C.iklan.hadiahKoin, 'iklan'); saveNow();
      for (let k = 0; k < 4; k++) setTimeout(() => fly('koin', from, to, () => { if (k === 3) { hud(); bump('#hudKoin'); sfx.coin(); } }), k * 80);
    } });
  };

  /* ---------- SUARA ---------- */
  function renderSuara() { $('#btnSuara').textContent = S.suara ? '🔊' : '🔇'; }
  $('#btnSuara').onclick = () => { S.suara = !S.suara; save(); renderSuara(); };


  /* ---------- TARIK TUNAI ---------- */
  const ledger = App.ledger, METODE = C.metodeTarik.filter((m) => m.aktif);
  let pilihRp = C.pilihanNominalRupiah[0], metode = METODE[0], reqId = null;
  const badge = (m, cls = 'badge') => `<span class="${cls}" style="background:${esc(m.warna)}">${esc(m.nama)}</span>`;
  const persist = () => saveNow();
  const fmtNo = (n) => String(n).replace(/(\d{4})(?=\d)/g, '$1 ');
  const mask = (n) => String(n).replace(/^(\d{3,4})\d+(\d{3})$/, '$1••••$2');
  function tarikProgress() {
    const need = C.minTarikKoin, pct = Math.min(100, S.koin / need * 100), kurangRp = koinKeRp(Math.max(0, need - S.koin));
    return { pct, ready: S.koin >= need, txt: S.koin >= need ? 'Sudah bisa ditarik! 🎉' : `Tinggal ${rp(kurangRp)} lagi!` };
  }
  function syncLedger() {
    E.recover({ state: S, persist, ledger });
    const back = E.applyRefunds({ state: S, persist, ledger });
    if (back > 0) { hud(); toast(`${fmt(back)} Koin dikembalikan dari penarikan yang ditolak.`); }
  }
  function setErr(errors) {
    document.querySelectorAll('#formTarik .ferr').forEach((el) => { el.textContent = errors[el.dataset.f] || ''; });
    $('#tErr').textContent = errors.umum || '';
  }
  function renderMetode() {
    const box = $('#tMetode'); box.innerHTML = '';
    METODE.forEach((m) => { const b = document.createElement('button'); b.type = 'button'; b.className = m === metode ? 'on' : ''; b.dataset.m = m.id; b.innerHTML = badge(m) + (m.jenis === 'bank' ? 'Rekening' : 'E-wallet'); b.onclick = () => { if (metode !== m) { metode = m; reqId = null; $('#tDana').value = ''; $('#tDana2').value = ''; setErr({}); } renderMetode(); }; box.appendChild(b); });
    const isBank = metode.jenis === 'bank';
    $('#tBankWrap').hidden = !isBank;
    if (isBank && !$('#tBank').options.length) $('#tBank').innerHTML = '<option value="">– pilih bank –</option>' + metode.bank.map((x) => `<option value="${esc(x.nama)}">${esc(x.nama)} (${x.digitMin === x.digitMax ? x.digitMin : x.digitMin + '–' + x.digitMax} digit)</option>`).join('');
    $('#lblNomor').textContent = isBank ? 'Nomor rekening' : 'Nomor HP ' + metode.nama;
    $('#lblNomor2').textContent = isBank ? 'Ketik ulang nomor rekening' : 'Ketik ulang nomor ' + metode.nama;
    $('#tDana').placeholder = isBank ? 'hanya angka' : '08xxxxxxxxxx'; $('#tDana2').placeholder = 'harus sama persis';
    $('#lblNama').textContent = isBank ? 'Nama pemilik rekening (penerima)' : `Nama pemilik akun ${metode.nama} (penerima)`;
  }
  function renderTarik() {
    syncLedger();
    const w = ledger.list(), sisaRp = Math.max(0, C.batasHarianRupiah - E.usedToday(w, today()));
    $('#tSaldo').textContent = fmt(S.koin); $('#tSaldoRp').textContent = rpOf(S.koin);
    $('#tKurs').textContent = `${fmt(C.kurs.koin)} Koin = ${rp(C.kurs.rupiah)}`;
    $('#tMin').textContent = koinTxt(C.minTarikKoin);
    $('#tCap').textContent = rp(C.batasHarianRupiah);
    $('#tSisa').textContent = rp(sisaRp); renderMetode(); renderBonus();
    const tutup = tarikTutup();
    $('#tSoon').hidden = !tutup; if (tutup) $('#tSoon').innerHTML = `<b>⏳ ${esc(C.tarikTunai.pesanNonaktif)}</b><small>Kumpulkan terus koinnya. Saat tarik tunai dibuka, saldo kamu bisa langsung dipakai.</small>`;
    $('#formTarik').classList.toggle('off', tutup);
    const kq = E.kuotaTarik(C, iklanKu(), w), P = C.pendapatan || {};
    $('#tKuota').closest('.row').hidden = !kq.aktif; $('#tKuotaNote').hidden = !kq.aktif;
    if (kq.aktif) { $('#tKuota').textContent = rp(kq.sisaRp); $('#tKuotaNote').textContent = `Supaya game ini bisa terus membayar, total penarikan dibatasi ${P.maksPayoutPersen}% dari nilai iklan yang kamu tonton (iklan berhadiah ≈ ${rp(P.rpPerRewarded)}, iklan antar level ≈ ${rp(P.rpPerInterstitial)}). Kuota naik setiap kamu menonton iklan.`; }
    const ch = $('#tNominal'); ch.innerHTML = '';
    C.pilihanNominalRupiah.forEach((r) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = r === pilihRp ? 'on' : ''; b.disabled = rpKeKoin(r) > S.koin;
      b.innerHTML = `${rp(r)}<small>${fmt(rpKeKoin(r))} Koin</small>`; b.onclick = () => { pilihRp = r; reqId = null; renderTarik(); }; ch.appendChild(b);
    });
    $('#tRiwayat').innerHTML = w.length ? w.slice().reverse().map((r) => `<div class="rq"><div class="m"><b>${rp(r.rupiah)}</b> ${badge({ warna: r.metodeWarna || '#118EEA', nama: r.metodeNama || 'DANA' }, 'mbadge')}${r.bank ? ' ' + esc(r.bank) : ''}
      <div>${esc(mask(r.nomor))} a.n. ${esc(r.nama)} · ${fmt(r.koin)} Koin</div>
      <div>${esc(r.id)} · diajukan ${new Date(r.waktu).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}${r.dibayarPada ? ' · dibayar ' + new Date(r.dibayarPada).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : ''}${r.refTransfer ? ' · ref ' + esc(r.refTransfer) : ''}${r.status === 'Ditolak' ? ' · koin dikembalikan' + (r.alasan ? ' (' + esc(r.alasan) + ')' : '') : ''}</div></div><span class="st ${r.status}">${r.status}</span></div>`).join('') : '<div class="empty">Belum ada penarikan.</div>';
    document.querySelectorAll('#formTarik input, #formTarik select, #formTarik button').forEach((x) => { if (tutup) x.disabled = true; });
    if (tutup) $('#tKirim').textContent = '⏳ Segera hadir';
  }
  const tarikTutup = () => !!(C.tarikTunai && C.tarikTunai.aktif === false);
  const iklanKu = () => ({ rewarded: S.iklanRewarded || 0, interstitial: S.iklanInter || 0 });
  function renderBonus() {
    const B = C.bonusLevel, el = $('#tBonus'), n = Math.min(S.iklanTotal || 0, B.minIklan);
    if (S.bonus.dicairkan) { el.innerHTML = `<h3>🏆 Bonus Level ${B.level}</h3><p class="note">${koinTxt(B.koin)} sudah masuk saldo ✓</p>`; return; }
    el.innerHTML = `<h3>🏆 Bonus Level ${B.level} Susun Ubin</h3><div class="bonusAmt">${koinHTML(B.koin, true)}</div>
      ${S.bonus.didapat ? '' : `<p class="note" style="margin:0 0 6px">Capai Level ${B.level} di Susun Ubin (kamu Lv ${S.ubin.level}) untuk dapat bonus ini.</p>`}
      <div class="sHead" style="font-size:13px"><span>📺 Iklan ditonton ${n}/${B.minIklan}</span><b>${S.bonus.didapat ? (n >= B.minIklan ? '🔓 Bisa dicairkan' : '🔒 Terkunci') : '🔒 Belum didapat'}</b></div>
      <i class="prog big"><i style="width:${B.minIklan ? n / B.minIklan * 100 : 100}%"></i></i>
      <p class="note" style="margin:4px 0 0">Bonus masuk saldo setelah total ${B.minIklan} iklan ditonton (iklan hadiah, power-up, lanjut, dan iklan antar level dihitung).</p>
      ${S.bonus.didapat && n >= B.minIklan ? '<button type="button" class="primary wide" id="btnCair">Masukkan ke saldo</button>' : ''}`;
    const b = $('#btnCair');
    if (b) b.onclick = () => { if (S.bonus.dicairkan) return; S.bonus.dicairkan = true; App.wallet.credit(B.koin, 'bonus-level'); saveNow(); hud(); sfx.yay(); confetti(); renderTarik(); };
  }
  function openTarik() { setErr({}); renderTarik(); $('#pgTarik').hidden = false; }
  $('#btnTarik').onclick = openTarik;
  document.querySelectorAll('[data-close]').forEach((b) => b.onclick = () => { $('#' + b.dataset.close).hidden = true; hud(); });
  const formInput = () => ({ reqId, metode: metode.id, bank: $('#tBank').value, nomor: $('#tDana').value, nomor2: $('#tDana2').value, nama: $('#tNama').value, rupiah: pilihRp, device: S.deviceId, snap: { koinDidapat: S.stats.koinDidapat, detikMain: S.stats.detikMain, pesanan: S.merge.done, ubinLv: S.ubin.level } });
  $('#formTarik').oninput = () => { reqId = null; };
  $('#formTarik').onsubmit = (e) => {
    e.preventDefault();
    if (tarikTutup()) { toast(C.tarikTunai.pesanNonaktif); return; }
    const v = E.validate(C, formInput(), { saldo: S.koin, list: ledger.list(), day: today(), iklan: iklanKu() });
    if (!v.ok) { setErr(v.errors); sfx.no(); const f = document.querySelector('#formTarik .ferr:not(:empty)'); if (f) f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    setErr({});
    const d = v.clean;
    if (!reqId) reqId = E.newReqId(Date.now());
    const myId = reqId;
    modal(`<h3>Cek lagi ya!</h3><p>Pastikan data di bawah <b>benar</b>. Uang yang sudah dikirim ke nomor yang salah tidak bisa ditarik kembali.</p>
      <div class="confirm">
        <div><span>Metode</span><b>${badge({ warna: d.metodeWarna, nama: d.metodeNama }, 'mbadge')}${d.bank ? ' ' + esc(d.bank) : ''}</b></div>
        <div><span>${d.jenis === 'bank' ? 'No. rekening' : 'No. HP'}</span><b class="big">${esc(fmtNo(d.nomor))}</b></div>
        <div><span>Nama penerima</span><b>${esc(d.nama)}</b></div>
        <div><span>Jumlah diterima</span><b class="big">${rp(d.rupiah)}</b></div>
        <div><span>Koin dipotong</span><b>${fmt(d.koin)} Koin</b></div>
        <div><span>Sisa koin</span><b>${fmt(S.koin - d.koin)} Koin</b></div>
      </div>
      <label class="chk"><input type="checkbox" id="cfOk"> Saya sudah cek, data di atas benar</label>`,
      [{ t: 'Ubah' }, { t: 'Ya, ajukan', p: 1, id: 'cfGo', keep: true, f: () => {
        if (!$('#cfOk').checked) { toast('Centang dulu "Saya sudah cek" ya.'); return; }
        const btn = $('#cfGo'); if (btn.disabled) return; btn.disabled = true;
        const res = E.submit({ C, state: S, persist, ledger, input: Object.assign(formInput(), { reqId: myId }) });
        closeModal();
        if (!res.ok) { setErr(res.errors); sfx.no(); return; }
        reqId = null; $('#tDana').value = ''; $('#tDana2').value = '';
        renderTarik(); hud(); if (!res.duplicate) { sfx.yay(); buzz([20, 40, 20]); }
        const r = res.request;
        modal(`<h3>Pengajuan terkirim</h3><p>${rp(r.rupiah)} ke ${esc(r.metodeNama)}${r.bank ? ' ' + esc(r.bank) : ''} <b>${esc(fmtNo(r.nomor))}</b> a.n. <b>${esc(r.nama)}</b>.</p><p>ID: ${esc(r.id)}<br>Status: <span class="st Menunggu">Menunggu</span><br>Admin akan memproses manual.</p>`);
      } }]);
  };
  App.kv.subscribe(E.LEDGER_KEY, () => { if (!$('#pgTarik').hidden) renderTarik(); else syncLedger(); });

  /* ---------- BONUS DAFTAR & UNDANG TEMAN ---------- */
  function renderRef() {
    const R = C.referral;
    $('#sRef').innerHTML = `<div class="sHead"><span>👥 Undang teman</span><small class="soon">${R.aktif ? '' : 'segera hadir'}</small></div>
      <p class="note" style="margin:4px 0 0">Kamu dapat ${koinTxt(R.koinPengundang)}, temanmu ${koinTxt(R.koinDiundang)}. Hanya 1× per perangkat &amp; nomor HP, dicek server sebelum aktif.</p>`;
  }
  function welcome() {
    if (S.bonusDaftarDiberi || !C.bonusDaftar.koin) return;
    S.bonusDaftarDiberi = true; saveNow();   // produksi: server memberi 1x per perangkat + nomor HP
    modal(`<h3>Selamat datang! 🎉</h3><p>Bonus pemain baru</p><div class="bonusBig">+${fmt(C.bonusDaftar.koin)} Koin</div><div class="bonusRp">≈ ${rpOf(C.bonusDaftar.koin)}</div><p class="odds">Kumpulkan koin dari main &amp; iklan, lalu tukar lewat Tarik Tunai (${fmt(C.kurs.koin)} Koin = ${rp(C.kurs.rupiah)}).</p>`,
      [{ t: 'Ambil bonus', p: 1, f: () => { giveReward({ koin: C.bonusDaftar.koin }, centerOf($('#btnKlaim'))); setTimeout(renderStart, 1200); } }]);
  }
  App.shell = { renderRef, welcome, hud, regen, giveReward, rewardHTML, rewardIcon, rewardLabel, openBox, renderStart, watchAd, openTarik, renderTarik, tarikProgress, syncLedger, streakNow };
})(window.App);
