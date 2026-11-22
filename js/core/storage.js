/* Storage adapter. Antarmuka: get(key) -> objek|null, set(key, obj), remove(key), subscribe(key, cb).
 * Sekarang: localStorage (offline, satu perangkat). Nanti: ganti dengan adapter Firebase/Supabase
 * yang tetap menyimpan salinan lokal (local-first) lalu sinkron ke server. Lihat README. */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else { root.App = root.App || {}; root.App.storage = mod; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function createLocal(backend, prefix) {
    const P = prefix || '';
    return {
      kind: 'local',
      get(key) { try { const v = backend.getItem(P + key); return v == null ? null : JSON.parse(v); } catch (e) { return null; } },
      set(key, val) { backend.setItem(P + key, JSON.stringify(val)); },
      remove(key) { backend.removeItem(P + key); },
      subscribe(key, cb) {
        if (typeof window === 'undefined') return () => {};
        const h = (e) => { if (e.key === P + key) cb(); };
        window.addEventListener('storage', h); return () => window.removeEventListener('storage', h);
      }
    };
  }
  function createMemory() {
    const m = new Map(), subs = new Map();
    return {
      kind: 'memory',
      get(key) { return m.has(key) ? JSON.parse(m.get(key)) : null; },
      set(key, val) { m.set(key, JSON.stringify(val)); (subs.get(key) || []).forEach((f) => f()); },
      remove(key) { m.delete(key); },
      subscribe(key, cb) { const a = subs.get(key) || []; a.push(cb); subs.set(key, a); return () => {}; }
    };
  }
  return { createLocal, createMemory };
});
