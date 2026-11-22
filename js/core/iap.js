/* ADAPTER PEMBELIAN DALAM APLIKASI (IAP). Opsional, diatur di config.iap.
 *   App.iap.products() -> daftar produk   App.iap.buy(id) -> Promise<boolean>   App.iap.setAdapter(a)
 * PREVIEW: PlaceholderIAP (modal CONTOH, tidak ada uang ditagih).
 * ANDROID: ganti dengan adapter Google Play Billing, mis. cordova-plugin-purchase (CdvPurchase) atau RevenueCat
 *   (@revenuecat/purchases-capacitor). Setelah beli, kirim purchaseToken ke SERVER untuk diverifikasi lewat
 *   Google Play Developer API (purchases.products.get) SEBELUM efek diberikan; lalu acknowledge/consume.
 * ATURAN: pembelian TIDAK PERNAH memberi koin yang bisa ditarik dan TIDAK menambah kuota tarik (bukan deposit). */
(function () {
  const App = window.App, C = App.C;
  const PlaceholderIAP = {
    name: 'placeholder',
    buy(p) {
      return new Promise((res) => {
        App.fx.modal(`<h3>${p.nama}</h3><div class="adbox"><b>[ CONTOH / PLACEHOLDER ]</b><br>Nanti pembayaran lewat <b>Google Play</b> (${p.harga}).<br>Di preview ini <b>tidak ada uang ditagih</b>.</div><p>${p.ket}</p>`,
          [{ t: 'Batal', f: () => res(false) }, { t: `Beli ${p.harga} (contoh)`, p: 1, f: () => res(true) }]);
      });
    }
  };
  let adapter = PlaceholderIAP, busy = false;
  function applyEffect(p) {
    const S = App.state, e = p.efek || {};
    S.iap = S.iap || { hapusIklan: false, beli: [] };
    if (e.hapusIklan) S.iap.hapusIklan = true;
    if (e.energi) S.energi += e.energi;
    S.iap.beli.push({ id: p.id, t: Date.now() });
    App.server.report('iap', { id: p.id });   // PRODUKSI: server memverifikasi purchaseToken lalu memberi efek
    App.store.saveNow();
  }
  App.iap = {
    setAdapter(a) { adapter = a; },
    enabled: () => !!(C.iap && C.iap.aktif),
    products: () => ((C.iap && C.iap.aktif && C.iap.produk) || []),
    owned: (id) => { const S = App.state; return id === 'hapus_iklan' && !!(S.iap && S.iap.hapusIklan); },
    async buy(id) {
      const p = App.iap.products().find((x) => x.id === id); if (!p || busy || App.iap.owned(id)) return false;
      busy = true;
      try { const ok = await adapter.buy(p); if (ok) applyEffect(p); return ok; } finally { busy = false; }
    }
  };
})();
