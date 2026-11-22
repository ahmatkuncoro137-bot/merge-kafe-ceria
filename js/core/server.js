/* Titik sambung ke server (SEKARANG: mode lokal/preview).
 * Di produksi SEMUA saldo, kurs, dan hadiah diputuskan server. Klien hanya mengirim EVENT
 * (misal "pesanan selesai", "level ubin menang", "iklan selesai + token SSV") dan server:
 *   - memvalidasi batas wajar (rate limit, kecepatan main, batas harian),
 *   - menghitung koin & menulis saldo (klien tidak bisa menulis saldo),
 *   - menandai akun mencurigakan untuk ditinjau admin.
 * Ganti App.server dengan adapter Firebase/Supabase yang mengimplementasikan report() & sync(). */
(function (App) {
  'use strict';
  const S = App.state, C = App.C;
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'd-' + Date.now().toString(36) + Math.random().toString(36).slice(2));
  if (!S.deviceId) { S.deviceId = uuid(); App.store.saveNow(); }
  S.stats = Object.assign({ koinDidapat: 0, detikMain: 0, event: 0 }, S.stats || {});
  const queue = [];   // antrean event untuk server (preview: hanya disimpan di memori)
  const local = {
    mode: 'lokal',
    /* kirim event ke server. Preview: dicatat lokal saja. */
    report(type, payload) { queue.push({ t: Date.now(), type, payload, device: S.deviceId }); if (queue.length > 200) queue.shift(); S.stats.event++; },
    pending: () => queue.slice()
  };
  /* Dompet: SATU-SATUNYA jalan menambah koin di klien (supaya mudah dipindah ke server). */
  const wallet = {
    credit(n, sumber) { n = Math.max(0, Math.floor(n)); if (!n) return 0; S.koin += n; S.stats.koinDidapat += n; App.server.report('koin', { n, sumber }); return n; }
  };
  // waktu main (untuk cek kewajaran "koin per jam main")
  setInterval(() => { if (!document.hidden) S.stats.detikMain += 5; }, 5000);
  App.server = local;
  App.wallet = wallet;
  App.uuid = uuid;
  void C;
})(window.App);
