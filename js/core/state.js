/* Membuat penyimpanan + state game + ledger penarikan. Ganti adapter di sini untuk Firebase/Supabase. */
(function (App) {
  'use strict';
  App.kv = App.storage.createLocal(window.localStorage, 'mkc_');
  // pengaturan pemilik (dari halaman admin) menimpa config
  App.settings.apply(App.C, App.settings.load(App.kv).values);
  const legacy = () => { try { return JSON.parse(localStorage.getItem('mkc_state_v1')); } catch (e) { return null; } };
  App.store = App.saveData.createStore(App.kv, App.C, App.data.merge, legacy);
  App.state = App.store.state;
  App.ledger = App.economy.createLedger(App.kv);
  // impor data penarikan dari preview versi awal (sekali)
  try { const old = JSON.parse(localStorage.getItem('mkc_withdrawals_v1')); if (old && App.ledger.importLegacy(old) >= 0) localStorage.removeItem('mkc_withdrawals_v1'); } catch (e) { /* abaikan */ }
  if (App.store.info.migrated || App.store.info.from === 1) localStorage.removeItem('mkc_state_v1');
})(window.App);
