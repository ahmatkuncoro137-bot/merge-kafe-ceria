/* Adapter iklan. Antarmuka adapter:
 *   rewarded({ placement, judul, hadiah, info }) -> Promise<boolean>   (true = iklan selesai ditonton)
 *   interstitial({ placement }) -> Promise<void>
 * Sekarang: PlaceholderAds (kotak "CONTOH"). Nanti: AdMobAds (lihat js/core/ads-admob.example.js). */
(function (App) {
  'use strict';
  function PlaceholderAds() {
    const show = (o, inter) => new Promise((resolve) => {
      const fx = App.fx, $ = App.util.$;
      let ready = false;
      const finish = (ok) => { if (ok && !ready) return; fx.closeModal(); resolve(ok); };
      fx.modal(`<h3>${o.judul || (inter ? 'Iklan' : 'Tonton iklan')}</h3><div class="adbox"><b>[ CONTOH / PLACEHOLDER ]</b><br>Di sini nanti muncul iklan ${inter ? 'interstitial' : 'video berhadiah'} asli dari <b>Google AdMob</b> (versi Android).<div class="bar"><i id="adBar"></i></div></div>${o.hadiah ? `<p>Hadiah: <b>${o.hadiah}</b></p>` : ''}${o.info ? `<p class="odds">${o.info}</p>` : ''}`,
        inter ? [{ t: 'Tutup', p: 1, id: 'adClaim', keep: true, f: () => finish(true) }]
          : [{ t: 'Batal', f: () => resolve(false) }, { t: 'Klaim', p: 1, id: 'adClaim', keep: true, f: () => finish(true) }]);
      const btn = $('#adClaim'); btn.disabled = true; btn.textContent = 'Tunggu…';
      const bar = $('#adBar'); requestAnimationFrame(() => { bar.style.transitionDuration = '1.5s'; bar.style.width = '100%'; });
      setTimeout(() => { ready = true; btn.disabled = false; btn.textContent = inter ? 'Tutup iklan' : 'Klaim'; }, 1500);
    });
    return { name: 'placeholder', rewarded: (o) => show(o || {}, false), interstitial: (o) => show(o || {}, true).then(() => undefined) };
  }
  let adapter = PlaceholderAds(), busy = false;
  // Hitung per jenis: dipakai untuk kuota tarik & estimasi pendapatan. PRODUKSI: hitungan resmi dari AdMob SSV di server.
  const count = (jenis) => { const S = App.state; S.iklanTotal = (S.iklanTotal || 0) + 1; if (jenis === 'rewarded') S.iklanRewarded = (S.iklanRewarded || 0) + 1; else S.iklanInter = (S.iklanInter || 0) + 1; App.server && App.server.report('iklan', { jenis }); App.store.saveNow(); };
  App.ads = {
    setAdapter(a) { adapter = a; },
    get adapter() { return adapter; },
    async rewarded(o) { if (busy) return false; busy = true; try { const ok = await adapter.rewarded(o || {}); if (ok) count('rewarded'); return ok; } finally { busy = false; } },
    async interstitial(o) { if (App.state.iap && App.state.iap.hapusIklan) return; if (busy) return; busy = true; try { await adapter.interstitial(o || {}); count('interstitial'); } finally { busy = false; } }
  };
})(window.App);
