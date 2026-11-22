/* Efek: suara (WebAudio), partikel/konfeti (canvas), getar, toast, modal, animasi terbang */
(function (App) {
  'use strict';
  const { $ } = App.util;
  const S = () => App.state;
  /* ---------- SOUND (WebAudio sederhana) ---------- */
  let AC = null;
  function tone(f, d = .12, type = 'sine', v = .12, delay = 0) {
    if (!S().suara) return;
    try {
      if (!AC && !(navigator.userActivation && navigator.userActivation.hasBeenActive)) return;
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + d);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
    } catch (e) { /* tanpa suara */ }
  }
  const sfx = {
    merge: (t) => { tone(440 * Math.pow(1.19, t), .14, 'triangle'); tone(660 * Math.pow(1.19, t), .18, 'sine', .1, .07); },
    spawn: () => tone(520, .08, 'sine', .08),
    coin: () => { tone(988, .08, 'square', .05); tone(1318, .14, 'square', .05, .08); },
    no: () => tone(180, .15, 'sawtooth', .06),
    yay: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .16, 'triangle', .09, i * .08))
  };

  /* ---------- PARTIKEL ---------- */
  const cv = $('#fx'), cx = cv.getContext('2d'); let P = [], running = false;
  function sizeFx() { const d = window.devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); }
  sizeFx(); window.addEventListener('resize', sizeFx);
  const COLORS = ['#ff7aa2', '#ffd54f', '#4fc3f7', '#81c784', '#ba68c8', '#fff'];
  function burst(x, y, n = 22, power = 1) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (2 + Math.random() * 4) * power;
      P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, life: 1, r: 3 + Math.random() * 5, c: COLORS[i % COLORS.length], star: i % 3 === 0, rot: Math.random() * 6 });
    }
    P.push({ ring: true, x, y, life: 1, r: 8 });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function starPath(x, y, r, rot) {
    cx.beginPath();
    for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, a = rot + i * Math.PI / 5; cx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    cx.closePath();
  }
  function tick() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    P = P.filter((p) => p.life > 0);
    for (const p of P) {
      if (p.ring) { p.r += 4; p.life -= .06; cx.strokeStyle = `rgba(255,213,79,${p.life})`; cx.lineWidth = 4; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.stroke(); continue; }
      if (p.conf) { p.x += p.vx + Math.sin(p.rot) * .8; p.y += p.vy; p.rot += .12; p.life -= .006; if (p.y > innerHeight + 20) p.life = 0; cx.globalAlpha = Math.min(1, p.life); cx.fillStyle = p.c; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore(); cx.globalAlpha = 1; continue; }
      p.x += p.vx; p.y += p.vy; p.vy += .22; p.vx *= .98; p.life -= .022; p.rot += .15;
      cx.globalAlpha = Math.max(0, p.life); cx.fillStyle = p.c;
      if (p.star) { starPath(p.x, p.y, p.r * 1.4, p.rot); cx.fill(); } else { cx.beginPath(); cx.arc(p.x, p.y, Math.max(0, p.r * p.life), 0, 7); cx.fill(); }
      cx.globalAlpha = 1;
    }
    if (P.length) requestAnimationFrame(tick); else { running = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }


  function confetti() {
    for (let i = 0; i < 120; i++) P.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .6, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, life: 1.6, r: 4 + Math.random() * 4, c: COLORS[i % 5], conf: true, rot: Math.random() * 6 });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  const buzz = (pat) => { try { if (S().suara && navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(pat); } catch (e) { /* tidak didukung */ } };
  function ftext(txt, x, y) { const d = document.createElement('div'); d.className = 'ftext'; d.textContent = txt; d.style.left = x + 'px'; d.style.top = y + 'px'; document.body.appendChild(d); setTimeout(() => d.remove(), 1000); }
  let toastT;
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }
  function bump(sel) { const e = $(sel); if (!e) return; e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
  function modal(html, btns) {
    $('#mBody').innerHTML = html; const bx = $('#mBtns'); bx.innerHTML = '';
    (btns || [{ t: 'OK', p: 1 }]).forEach((b) => { const el = document.createElement('button'); el.type = 'button'; el.textContent = b.t; if (b.p) el.className = 'primary'; if (b.id) el.id = b.id; el.onclick = () => { if (!b.keep) closeModal(); b.f && b.f(); }; bx.appendChild(el); });
    $('#modal').hidden = false;
  }
  const closeModal = () => { $('#modal').hidden = true; };
  function fly(art, from, to, cb) {
    const im = document.createElement('img'); im.src = ART.url(art); im.className = 'fly'; im.alt = ''; document.body.appendChild(im);
    const a = im.animate([{ transform: `translate(${from.x - 14}px,${from.y - 14}px) scale(1)` },
      { transform: `translate(${(from.x + to.x) / 2 - 14}px,${Math.min(from.y, to.y) - 60}px) scale(1.4)`, offset: .45 },
      { transform: `translate(${to.x - 14}px,${to.y - 14}px) scale(.7)` }], { duration: 700 + Math.random() * 200, easing: 'ease-in-out' });
    a.onfinish = () => { im.remove(); cb && cb(); };
  }
  const unlockAudio = () => { if (AC && AC.state === 'suspended') AC.resume(); };
  App.fx = { tone, sfx, burst, confetti, buzz, ftext, toast, bump, modal, closeModal, fly, unlockAudio };
})(window.App);
