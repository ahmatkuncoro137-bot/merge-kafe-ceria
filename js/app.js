/* Boot aplikasi */
(function (App) {
  'use strict';
  const { $ } = App.util;
  document.querySelectorAll('img[data-art]').forEach((im) => { im.src = ART.url(im.dataset.art); if (!im.hasAttribute('alt')) im.alt = ''; });
  App.shell.syncLedger();
  App.merge.init();
  App.shell.hud();
  App.shell.renderStart();
  App.shell.welcome();
  $('#btnSuara').textContent = App.state.suara ? '🔊' : '🔇';
  setInterval(App.shell.hud, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) App.store.saveNow(); });
  window.addEventListener('pagehide', () => App.store.saveNow());
  // PWA: service worker (tidak dipakai di dalam Capacitor)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !window.Capacitor && !/[?&]nosw=1/.test(location.search)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* offline tetap jalan tanpa SW */ }));
  }
  // Hook untuk tes otomatis (hanya ?debug=1)
  if (false) { // debug dimatikan di versi publik
    window.__MG = { get S() { return App.state; }, App, debugAddKoin: (n) => { App.state.koin += n; App.store.saveNow(); App.shell.hud(); } };
  }
})(window.App);
