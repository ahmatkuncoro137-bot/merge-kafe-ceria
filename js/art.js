/* Semua gambar dibuat dari kode (SVG orisinal). Tidak ada aset dari game lain. */
(function () {
  const SH = '<ellipse cx="50" cy="89" rx="30" ry="5.5" fill="rgba(80,40,20,.16)"/>';
  const lg = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const rg = (id, a, b) => `<radialGradient id="${id}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
  const svg = (defs, body, vb = '0 0 100 100', shadow = true) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><defs>${defs}</defs>${shadow ? SH : ''}${body}</svg>`;
  const plate = '<ellipse cx="50" cy="84" rx="38" ry="7" fill="#eef3fa" stroke="#a9b8cc" stroke-width="2.5"/>';
  const hl = (x, y, w, h, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" opacity=".45"/>`;

  const A = {};
  /* ---------- RANTAI TEPUNG ---------- */
  A.tepung1 = svg(lg('a', '#fffaf0', '#e6cc9c'),
    `<path d="M27 36 Q24 82 32 85 L68 85 Q76 82 73 36 Z" fill="url(#a)" stroke="#a7834f" stroke-width="3"/>
     <path d="M29 36 Q50 26 71 36 L65 20 Q50 28 35 20 Z" fill="#fff6e3" stroke="#a7834f" stroke-width="3" stroke-linejoin="round"/>
     <rect x="31" y="31" width="38" height="7" rx="3.5" fill="#e74c5b"/>
     <circle cx="50" cy="60" r="13" fill="#fff" stroke="#e9d3a8" stroke-width="2"/>
     <path d="M50 70 V51 M50 55 l-5 -4 M50 55 l5 -4 M50 61 l-5 -4 M50 61 l5 -4 M50 67 l-5 -4 M50 67 l5 -4" stroke="#e0a526" stroke-width="2.6" stroke-linecap="round" fill="none"/>
     ${hl(33, 42, 5, 34)}`);
  A.tepung2 = svg(lg('a', '#fff8ea', '#f0d6a8') + lg('b', '#7cc7f2', '#3d8fd1'),
    `<ellipse cx="50" cy="55" rx="27" ry="17" fill="url(#a)" stroke="#d1ad76" stroke-width="3"/>
     <ellipse cx="41" cy="48" rx="9" ry="4.5" fill="#fff" opacity=".8"/>
     <path d="M18 58 H82 Q80 87 50 87 Q20 87 18 58 Z" fill="url(#b)" stroke="#2a6fa8" stroke-width="3" stroke-linejoin="round"/>
     <path d="M24 66 H76" stroke="#fff" stroke-width="3" opacity=".6"/>
     <circle cx="34" cy="74" r="2.5" fill="#fff" opacity=".8"/><circle cx="50" cy="77" r="2.5" fill="#fff" opacity=".8"/><circle cx="66" cy="74" r="2.5" fill="#fff" opacity=".8"/>`);
  A.tepung3 = svg(lg('a', '#f9c27a', '#c9752c'),
    `<path d="M16 64 Q14 36 50 33 Q86 36 84 64 L81 81 Q50 88 19 81 Z" fill="url(#a)" stroke="#8f4f17" stroke-width="3" stroke-linejoin="round"/>
     <path d="M31 44 l8 11 M46 41 l8 11 M61 44 l8 11" stroke="#ffe6b8" stroke-width="5" stroke-linecap="round"/>
     <path d="M22 70 Q50 76 78 70" stroke="#8f4f17" stroke-width="2" fill="none" opacity=".35"/>`);
  A.tepung4 = svg(lg('a', '#ff9fbe', '#e65a86', 1, 0),
    `<path d="M27 58 H73 L66 87 H34 Z" fill="url(#a)" stroke="#b83260" stroke-width="3" stroke-linejoin="round"/>
     <path d="M37 59 L40 86 M50 59 V86 M63 59 L60 86" stroke="#fff" stroke-width="2.5" opacity=".55"/>
     <path d="M23 61 Q20 47 33 45 Q35 30 50 30 Q65 30 67 45 Q80 47 77 61 Z" fill="#fff5fa" stroke="#eea0bc" stroke-width="3" stroke-linejoin="round"/>
     <path d="M30 50 Q50 58 70 50" stroke="#f6c6d7" stroke-width="2.5" fill="none"/>
     <rect x="35" y="40" width="6" height="2.6" rx="1.3" fill="#4fc3f7" transform="rotate(30 38 41)"/><rect x="58" y="38" width="6" height="2.6" rx="1.3" fill="#ffd54f" transform="rotate(-25 61 39)"/><rect x="44" y="49" width="6" height="2.6" rx="1.3" fill="#81c784"/><rect x="62" y="50" width="6" height="2.6" rx="1.3" fill="#ba68c8" transform="rotate(40 65 51)"/>
     <path d="M50 22 q3 -9 11 -10" stroke="#3b7a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
     <circle cx="50" cy="26" r="7" fill="#e53950" stroke="#a51d33" stroke-width="2"/><circle cx="47.5" cy="23.5" r="2" fill="#fff" opacity=".8"/>`);
  A.tepung5 = svg(lg('a', '#ffc9dc', '#f2879f') + lg('b', '#ffffff', '#ffe3ee'),
    `${plate}
     <rect x="17" y="54" width="66" height="28" rx="7" fill="url(#a)" stroke="#c2577a" stroke-width="3"/>
     <path d="M17 61 Q17 54 24 54 H76 Q83 54 83 61 Q79 70 75 62 Q71 72 65 62 Q59 70 55 62 Q49 72 45 62 Q39 70 35 62 Q29 72 25 62 Q20 68 17 61 Z" fill="#fff"/>
     <rect x="30" y="33" width="40" height="22" rx="6" fill="url(#b)" stroke="#c2577a" stroke-width="3"/>
     <path d="M30 46 H70" stroke="#f48fb1" stroke-width="3"/>
     <circle cx="25" cy="72" r="3" fill="#fff"/><circle cx="50" cy="74" r="3" fill="#fff"/><circle cx="75" cy="72" r="3" fill="#fff"/>
     <circle cx="38" cy="32" r="4.5" fill="#e53950"/><circle cx="62" cy="32" r="4.5" fill="#e53950"/>
     <rect x="47" y="15" width="6" height="18" rx="2" fill="#7fc8f8" stroke="#3c8dc5" stroke-width="1.5"/>
     <path d="M50 4 Q56 11 50 15 Q44 11 50 4 Z" fill="#ffb300" stroke="#ff7a00" stroke-width="1.5"/>`);

  /* ---------- RANTAI TELUR ---------- */
  A.telur1 = svg(lg('a', '#fffdf7', '#efdcbb'),
    `<ellipse cx="50" cy="56" rx="22" ry="29" fill="url(#a)" stroke="#c9ad80" stroke-width="3"/>
     <ellipse cx="42" cy="44" rx="5" ry="9" fill="#fff" opacity=".9" transform="rotate(20 42 44)"/>
     <circle cx="58" cy="66" r="1.8" fill="#d8bf95"/><circle cx="54" cy="72" r="1.3" fill="#d8bf95"/>`);
  A.telur2 = svg('',
    `<path d="M66 10 L55 48" stroke="#8c8c8c" stroke-width="4.5" stroke-linecap="round"/>
     <ellipse cx="53" cy="50" rx="7" ry="13" fill="none" stroke="#b5b5b5" stroke-width="2.5" transform="rotate(17 53 50)"/>
     <ellipse cx="50" cy="58" rx="29" ry="9" fill="#ffd54a" stroke="#e0a800" stroke-width="2"/>
     <path d="M36 57 q6 -4 12 0 q6 4 12 0" stroke="#fff3b0" stroke-width="2.5" fill="none"/>
     <path d="M19 58 H81 Q79 88 50 88 Q21 88 19 58 Z" fill="#fff" stroke="#9fb0c8" stroke-width="3" stroke-linejoin="round"/>
     <path d="M22 67 H78" stroke="#f48fb1" stroke-width="4"/>`);
  A.telur3 = svg(lg('a', '#ffe98f', '#f4bd3e'),
    `${plate}
     <path d="M27 82 L33 46 Q50 39 67 46 L73 82 Q50 89 27 82 Z" fill="url(#a)" stroke="#c98d1f" stroke-width="3" stroke-linejoin="round"/>
     <path d="M33 46 Q50 38 67 46 Q67 57 61 52 Q57 61 51 53 Q45 61 41 53 Q35 59 33 46 Z" fill="#8e4513"/>
     ${hl(35, 58, 4, 20)}
     <circle cx="50" cy="38" r="5" fill="#e53950"/>`);
  A.telur4 = svg('',
    `${plate}
     <ellipse cx="50" cy="74" rx="32" ry="9" fill="#d98e45" stroke="#a15f22" stroke-width="3"/>
     <ellipse cx="50" cy="63" rx="32" ry="9" fill="#e9a55b" stroke="#a15f22" stroke-width="3"/>
     <ellipse cx="50" cy="52" rx="32" ry="9" fill="#f1b56c" stroke="#a15f22" stroke-width="3"/>
     <path d="M25 50 Q50 40 75 50 Q73 60 67 53 Q61 64 55 53 Q46 62 39 53 Q31 60 25 50 Z" fill="#9c3f14" opacity=".92"/>
     <rect x="42" y="38" width="16" height="10" rx="2.5" fill="#ffe680" stroke="#e5bf3b" stroke-width="1.5"/>`);
  A.telur5 = svg('',
    `${plate}
     <path d="M20 42 L34 33 H82 L68 42 Z" fill="#7a3e1a" stroke="#4e2610" stroke-width="2.5" stroke-linejoin="round"/>
     <path d="M68 42 L82 33 V73 L68 82 Z" fill="#8a4a22" stroke="#4e2610" stroke-width="2.5" stroke-linejoin="round"/>
     <rect x="20" y="42" width="48" height="40" fill="#f6d27a" stroke="#4e2610" stroke-width="2.5"/>
     <path d="M20 49 H68 M20 56 H68 M20 63 H68 M20 70 H68 M20 77 H68" stroke="#8a4a22" stroke-width="3"/>
     <path d="M68 49 L82 40 M68 56 L82 47 M68 63 L82 54 M68 70 L82 61 M68 77 L82 68" stroke="#f6d27a" stroke-width="1.6" opacity=".7"/>`);

  /* ---------- RANTAI BUAH ---------- */
  A.buah1 = svg(lg('a', '#ff7a8f', '#d81b3c'),
    `<path d="M50 88 Q20 66 25 44 Q29 31 50 36 Q71 31 75 44 Q80 66 50 88 Z" fill="url(#a)" stroke="#a3162f" stroke-width="3" stroke-linejoin="round"/>
     ${[[38, 50], [50, 47], [62, 50], [43, 62], [57, 62], [50, 74], [34, 60], [66, 60]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="2.6" fill="#ffe082"/>`).join('')}
     <path d="M32 38 L41 25 L50 34 L59 23 L68 38 Q50 45 32 38 Z" fill="#5cb85c" stroke="#2e7d32" stroke-width="2.5" stroke-linejoin="round"/>
     <ellipse cx="37" cy="47" rx="3.5" ry="6" fill="#fff" opacity=".5"/>`);
  A.buah2 = svg(lg('a', '#e6b075', '#b4773a'),
    `<path d="M26 56 Q50 8 74 56" fill="none" stroke="#8d5524" stroke-width="5" stroke-linecap="round"/>
     <circle cx="38" cy="50" r="12" fill="#e53950" stroke="#a3162f" stroke-width="2"/>
     <circle cx="61" cy="49" r="12" fill="#ffa726" stroke="#e07b00" stroke-width="2"/>
     <circle cx="50" cy="42" r="10" fill="#9ccc65" stroke="#558b2f" stroke-width="2"/>
     <path d="M50 32 l2 -6" stroke="#6d4c41" stroke-width="2.5"/>
     <path d="M17 55 H83 L75 87 H25 Z" fill="url(#a)" stroke="#8d5524" stroke-width="3" stroke-linejoin="round"/>
     <path d="M21 66 H79 M23 76 H77" stroke="#8d5524" stroke-width="2" opacity=".5"/>
     <path d="M35 56 L33 86 M50 56 V86 M65 56 L67 86" stroke="#8d5524" stroke-width="2" opacity=".5"/>`);
  A.buah3 = svg(lg('a', '#f4678b', '#b3123a', 1, 0),
    `<rect x="27" y="36" width="46" height="49" rx="11" fill="url(#a)" stroke="#8c0f2d" stroke-width="3"/>
     <rect x="29" y="21" width="42" height="17" rx="5" fill="#fff" stroke="#e57373" stroke-width="3"/>
     <path d="M36 21 V38 M43 21 V38 M50 21 V38 M57 21 V38 M64 21 V38" stroke="#ef9a9a" stroke-width="3"/>
     <rect x="33" y="52" width="34" height="19" rx="5" fill="#fff8e1" stroke="#f0c36d" stroke-width="2"/>
     <path d="M50 67 Q43 61 44 57 Q46 54 50 56 Q54 54 56 57 Q57 61 50 67 Z" fill="#e53950"/>
     ${hl(31, 40, 5, 30)}`);
  A.buah4 = svg('',
    `<ellipse cx="50" cy="66" rx="39" ry="20" fill="#c9792e" stroke="#8a4a13" stroke-width="3"/>
     <ellipse cx="50" cy="61" rx="34" ry="16" fill="#d81b60" stroke="#8a4a13" stroke-width="2.5"/>
     <path d="M26 55 L60 75 M36 48 L72 69 M50 46 L80 63 M20 63 L44 77" stroke="#f3c27e" stroke-width="5" stroke-linecap="round"/>
     <path d="M74 52 L40 76 M64 47 L28 70 M50 46 L22 62 M80 61 L58 77" stroke="#f3c27e" stroke-width="5" stroke-linecap="round"/>
     <ellipse cx="50" cy="61" rx="34" ry="16" fill="none" stroke="#f0b866" stroke-width="5"/>`);
  A.buah5 = svg(lg('a', '#fffaf3', '#ffe4d2'),
    `${plate}
     <rect x="19" y="45" width="62" height="36" rx="9" fill="url(#a)" stroke="#e39aae" stroke-width="3"/>
     <rect x="19" y="61" width="62" height="6" fill="#e53950"/>
     <ellipse cx="50" cy="45" rx="31" ry="9" fill="#fff" stroke="#e39aae" stroke-width="3"/>
     ${[[30, 42], [44, 39], [58, 39], [71, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="#f1c4d0" stroke-width="1.5"/>`).join('')}
     ${[[36, 36], [50, 33], [64, 36]].map(([x, y]) => `<path d="M${x} ${y + 10} Q${x - 7} ${y + 3} ${x - 5} ${y - 2} Q${x} ${y - 4} ${x + 5} ${y - 2} Q${x + 7} ${y + 3} ${x} ${y + 10} Z" fill="#e53950" stroke="#a3162f" stroke-width="1.5"/><path d="M${x - 4} ${y - 2} L${x} ${y - 6} L${x + 4} ${y - 2}" fill="#5cb85c"/>`).join('')}`);

  /* ---------- RANTAI KOPI ---------- */
  const bean = (cx, cy, rot) => `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="15" ry="21" fill="url(#a)" stroke="#3b1f0e" stroke-width="3"/><path d="M${cx} ${cy - 18} Q${cx - 7} ${cy} ${cx} ${cy + 18}" stroke="#3b1f0e" stroke-width="3" fill="none"/><ellipse cx="${cx - 6}" cy="${cy - 8}" rx="3" ry="6" fill="#fff" opacity=".3"/></g>`;
  A.kopi1 = svg(rg('a', '#a86b45', '#5a3420'), bean(39, 57, -25) + bean(62, 57, 22));
  A.kopi2 = svg('',
    `<path d="M40 30 q-6 -8 0 -14 q6 -6 0 -12 M54 30 q-6 -8 0 -14 q6 -6 0 -12" stroke="#c9b8a8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
     <ellipse cx="50" cy="81" rx="34" ry="7" fill="#fff" stroke="#9fb0c8" stroke-width="2.5"/>
     <path d="M72 50 q14 0 12 12 q-2 10 -15 8" stroke="#9fb0c8" stroke-width="5" fill="none"/>
     <path d="M24 44 H76 L69 77 Q50 84 31 77 Z" fill="#fff" stroke="#9fb0c8" stroke-width="3" stroke-linejoin="round"/>
     <ellipse cx="50" cy="44" rx="26" ry="6" fill="#6d3b1f" stroke="#9fb0c8" stroke-width="2.5"/>
     <path d="M28 56 H72" stroke="#ff8a80" stroke-width="4"/>`);
  A.kopi3 = svg('',
    `<path d="M29 24 H71 L65 85 H35 Z" fill="#eaf6ff" stroke="#87aac2" stroke-width="3" stroke-linejoin="round"/>
     <path d="M32.5 56 H67.5 L65 85 H35 Z" fill="#6d3b1f"/>
     <path d="M31.4 40 H68.6 L67.5 56 H32.5 Z" fill="#e8c39e"/>
     <path d="M32.5 56 Q42 52 50 56 Q58 60 67.5 56" stroke="#b98257" stroke-width="3" fill="none"/>
     <rect x="54" y="8" width="5" height="40" rx="2" fill="#ff7aa2" transform="rotate(12 56 28)"/>
     ${hl(33, 28, 4, 50)}`);
  A.kopi4 = svg(lg('a', '#ffffff', '#dfeaf3'),
    `<path d="M57 4 L52 34" stroke="#2eb872" stroke-width="5" stroke-linecap="round"/>
     <path d="M26 30 Q50 14 74 30 Z" fill="#fff" stroke="#87aac2" stroke-width="3" stroke-linejoin="round"/>
     <rect x="24" y="29" width="52" height="6" rx="3" fill="#fff" stroke="#87aac2" stroke-width="2.5"/>
     <path d="M27 35 H73 L66 87 H34 Z" fill="url(#a)" stroke="#87aac2" stroke-width="3" stroke-linejoin="round"/>
     <path d="M29.5 50 H70.5 L66 87 H34 Z" fill="#8b5a36"/>
     <rect x="35" y="53" width="11" height="11" rx="2" fill="#e3f4ff" opacity=".85" transform="rotate(12 40 58)"/><rect x="52" y="60" width="11" height="11" rx="2" fill="#e3f4ff" opacity=".8" transform="rotate(-10 57 65)"/>
     <circle cx="50" cy="74" r="8" fill="#2eb872"/><path d="M46 74 h8 M50 70 v8" stroke="#fff" stroke-width="2"/>`);
  A.kopi5 = svg('',
    `<path d="M30 44 Q28 30 40 30 Q42 18 52 20 Q62 18 63 30 Q74 30 70 44 Z" fill="#fff" stroke="#e0d3c8" stroke-width="2.5"/>
     <path d="M36 32 q6 6 12 0 q6 6 12 0" stroke="#8e4513" stroke-width="2.5" fill="none"/>
     <circle cx="52" cy="17" r="6" fill="#e53950" stroke="#a3162f" stroke-width="1.5"/><path d="M52 11 q3 -6 8 -6" stroke="#3b7a2a" stroke-width="2" fill="none"/>
     <path d="M30 44 H70 L63 82 H37 Z" fill="#c89a72" stroke="#87aac2" stroke-width="3" stroke-linejoin="round"/>
     <path d="M31 52 Q40 58 50 52 Q60 46 69 52" stroke="#8e4513" stroke-width="3" fill="none"/>
     <rect x="44" y="82" width="12" height="5" fill="#87aac2"/><ellipse cx="50" cy="88" rx="16" ry="3.5" fill="#cfe3f0" stroke="#87aac2" stroke-width="2"/>
     <rect x="62" y="8" width="5" height="44" rx="2" fill="#ffb74d" transform="rotate(18 64 30)"/>
     ${hl(35, 48, 4, 26)}`);

  /* ---------- GENERATOR ---------- */
  A.gen_tepung = svg(lg('a', '#c98b52', '#94592a'),
    `<path d="M30 30 Q28 52 32 54 L52 54 Q56 52 54 30 Z" fill="#fff4dd" stroke="#a7834f" stroke-width="2.5"/>
     <path d="M48 26 Q46 52 50 54 L70 54 Q74 52 72 26 Z" fill="#f7e6c4" stroke="#a7834f" stroke-width="2.5"/>
     <rect x="31" y="27" width="22" height="5" rx="2.5" fill="#e74c5b"/><rect x="49" y="23" width="22" height="5" rx="2.5" fill="#42a5f5"/>
     <rect x="16" y="50" width="68" height="36" rx="5" fill="url(#a)" stroke="#5d3412" stroke-width="3"/>
     <path d="M16 62 H84 M16 74 H84" stroke="#5d3412" stroke-width="2.5"/>
     <path d="M20 54 L80 84 M80 54 L20 84" stroke="#b97a43" stroke-width="2" opacity=".6"/>`);
  A.gen_telur = svg(rg('a', '#ffffff', '#ece5da'),
    `<ellipse cx="50" cy="80" rx="34" ry="8" fill="#e2b45a" stroke="#a87a26" stroke-width="2.5"/>
     <path d="M18 78 q8 -6 14 0 q8 -6 14 0 q8 -6 14 0 q8 -6 14 0 q8 -6 10 0" stroke="#c99a3c" stroke-width="2.5" fill="none"/>
     <ellipse cx="48" cy="58" rx="27" ry="21" fill="url(#a)" stroke="#b9a68a" stroke-width="3"/>
     <path d="M22 54 Q14 44 22 40 Q26 50 30 50" fill="#fff" stroke="#b9a68a" stroke-width="2.5"/>
     <circle cx="64" cy="36" r="14" fill="url(#a)" stroke="#b9a68a" stroke-width="3"/>
     <path d="M58 23 q2 -8 6 -2 q3 -8 7 0 q4 -5 4 3 Z" fill="#e53935" stroke="#b71c1c" stroke-width="1.5"/>
     <path d="M77 37 L86 40 L77 43 Z" fill="#ffb300" stroke="#e08a00" stroke-width="1.5"/>
     <path d="M74 46 q3 6 -1 9 q-4 -2 -2 -8" fill="#e53935"/>
     <circle cx="68" cy="34" r="2.8" fill="#3b2a20"/><circle cx="69" cy="33" r="1" fill="#fff"/>
     <circle cx="66" cy="41" r="3" fill="#ffab91" opacity=".7"/>
     <path d="M36 58 q10 10 22 0" stroke="#d6c7b1" stroke-width="3" fill="none"/>`);
  A.gen_buah = svg(lg('a', '#e07b50', '#b5532c'),
    `<path d="M50 60 Q40 40 26 34 M50 60 Q52 36 50 20 M50 60 Q62 42 76 34" stroke="#3e8e41" stroke-width="3.5" fill="none" stroke-linecap="round"/>
     <ellipse cx="30" cy="33" rx="11" ry="7" fill="#66bb6a" stroke="#2e7d32" stroke-width="2" transform="rotate(-25 30 33)"/>
     <ellipse cx="70" cy="31" rx="11" ry="7" fill="#66bb6a" stroke="#2e7d32" stroke-width="2" transform="rotate(25 70 31)"/>
     <ellipse cx="50" cy="20" rx="7" ry="11" fill="#66bb6a" stroke="#2e7d32" stroke-width="2"/>
     ${[[34, 48], [64, 46], [50, 40]].map(([x, y]) => `<path d="M${x} ${y + 9} Q${x - 7} ${y + 2} ${x - 5} ${y - 3} Q${x} ${y - 5} ${x + 5} ${y - 3} Q${x + 7} ${y + 2} ${x} ${y + 9} Z" fill="#e53950" stroke="#a3162f" stroke-width="1.5"/>`).join('')}
     <path d="M24 58 H76 L70 87 H30 Z" fill="url(#a)" stroke="#7d3517" stroke-width="3" stroke-linejoin="round"/>
     <rect x="21" y="55" width="58" height="9" rx="3" fill="#e8885c" stroke="#7d3517" stroke-width="2.5"/>`);
  A.gen_kopi = svg(lg('a', '#ff8fab', '#d94d77') + lg('b', '#e8eef5', '#b9c6d4'),
    `<rect x="18" y="14" width="64" height="16" rx="6" fill="url(#a)" stroke="#9c2a52" stroke-width="3"/>
     <rect x="22" y="28" width="56" height="54" rx="6" fill="url(#a)" stroke="#9c2a52" stroke-width="3"/>
     <rect x="30" y="34" width="40" height="12" rx="4" fill="url(#b)" stroke="#7a8796" stroke-width="2"/>
     <circle cx="38" cy="40" r="3" fill="#4caf50"/><circle cx="48" cy="40" r="3" fill="#ffca28"/>
     <rect x="44" y="46" width="12" height="8" rx="2" fill="#555"/>
     <rect x="38" y="62" width="24" height="16" rx="3" fill="#fff" stroke="#9fb0c8" stroke-width="2"/>
     <rect x="18" y="80" width="64" height="7" rx="3" fill="url(#b)" stroke="#7a8796" stroke-width="2"/>
     <path d="M50 55 V61" stroke="#6d3b1f" stroke-width="3"/>`);

  /* ---------- IKON UI ---------- */
  A.koin = svg(rg('a', '#fff3a6', '#f1a90b'),
    `<circle cx="50" cy="50" r="40" fill="url(#a)" stroke="#b9770e" stroke-width="5"/><circle cx="50" cy="50" r="30" fill="none" stroke="#e8a00e" stroke-width="3"/>
     <text x="50" y="64" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="40" fill="#b9770e">K</text>`, '0 0 100 100', false);
  A.bintang = svg(lg('a', '#fff27a', '#ffb300'),
    `<path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="url(#a)" stroke="#d98200" stroke-width="5" stroke-linejoin="round"/>
     <path d="M40 34 L50 14" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`, '0 0 100 100', false);
  A.energi = svg(lg('a', '#8ff0ff', '#1fa3ff'),
    `<path d="M58 4 L18 56 H46 L38 96 L82 40 H54 Z" fill="url(#a)" stroke="#0a6fc2" stroke-width="5" stroke-linejoin="round"/>`, '0 0 100 100', false);

  /* ---------- KARAKTER BARISTA (orisinal) ---------- */
  /* ---------- KOKI (2 karakter, baju koki lengkap: topi toque, jaket double-breasted, apron, scarf leher) ---------- */
  function koki(o) {
    const cw = o.cewek, skin = '#ffe0c7', skinD = '#ffd2b0', hair = cw ? '#6b3a22' : '#2f2219', hair2 = cw ? '#4e2a17' : '#1c140f';
    const scarf = cw ? '#ff5d8f' : '#2f8fe0', scarfD = cw ? '#d63d6f' : '#1d6bb0', apron = cw ? '#ff9ebd' : '#3d4a6b', apronD = cw ? '#e2648d' : '#27304a';
    const delay = cw ? '0s' : '1.3s';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200">
  <style>
    .arm{transform-origin:90px 120px;animation:w 2.6s ease-in-out ${delay} infinite}
    @keyframes w{0%,55%,100%{transform:rotate(0)}65%{transform:rotate(-16deg)}75%{transform:rotate(6deg)}85%{transform:rotate(-12deg)}}
    .eye{transform-origin:center;transform-box:fill-box;animation:b 4.2s ${delay} infinite}
    @keyframes b{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
    .hat{transform-origin:60px 52px;animation:h 2.6s ease-in-out ${delay} infinite}
    @keyframes h{0%,100%{transform:rotate(0)}50%{transform:rotate(${cw ? '-2' : '2'}deg)}}
  </style>
  <defs><linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hair}"/><stop offset="1" stop-color="${hair2}"/></linearGradient>
  <linearGradient id="jk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9eef5"/></linearGradient>
  <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${apron}"/><stop offset="1" stop-color="${apronD}"/></linearGradient>
  <linearGradient id="tq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6ebf2"/></linearGradient></defs>
  ${cw ? `<path d="M30 70 Q26 100 36 116 L50 110 Q40 92 42 72 Z M90 70 Q94 100 84 116 L70 110 Q80 92 78 72 Z" fill="url(#hr)"/>` : ''}
  <!-- badan: jaket koki double-breasted -->
  <path d="M30 122 Q34 108 60 106 Q86 108 90 122 L94 200 H26 Z" fill="url(#jk)" stroke="#cfd8e3" stroke-width="2"/>
  <path d="M60 108 L74 124 L70 200" stroke="#cfd8e3" stroke-width="2" fill="none"/>
  ${[128, 142, 156].map((y) => `<circle cx="52" cy="${y}" r="2.6" fill="#9aa8b8"/><circle cx="76" cy="${y}" r="2.6" fill="#9aa8b8"/>`).join('')}
  <!-- apron -->
  <path d="M38 160 H82 L86 200 H34 Z" fill="url(#ap)" stroke="${apronD}" stroke-width="2"/>
  <path d="M38 162 Q30 160 26 166 M82 162 Q90 160 94 166" stroke="${apronD}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="50" y="172" width="20" height="13" rx="4" fill="#ffffff" opacity=".35"/>
  ${cw ? '<path d="M60 183 l-5 -5 a3 3 0 0 1 5 -4 a3 3 0 0 1 5 4 z" fill="#fff"/>' : '<path d="M53 176 h14" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 2" opacity=".8"/>'}
  <!-- lengan kiri (diam) -->
  <path d="M32 124 Q22 144 28 164" stroke="#f3f6fa" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M32 124 Q22 144 28 164" stroke="#cfd8e3" stroke-width="1" fill="none"/>
  <circle cx="29" cy="168" r="6.5" fill="${skin}"/>
  <!-- lengan kanan (melambai) -->
  <g class="arm"><path d="M88 124 Q104 112 104 88" stroke="#f3f6fa" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M88 124 Q104 112 104 88" stroke="#cfd8e3" stroke-width="1" fill="none"/>
  <circle cx="104" cy="80" r="7" fill="${skin}"/></g>
  <!-- leher + scarf koki -->
  <rect x="53" y="94" width="14" height="14" rx="5" fill="${skinD}"/>
  <path d="M44 106 Q60 116 76 106 L72 114 Q60 122 48 114 Z" fill="${scarf}"/>
  <path d="M56 114 L60 128 L64 114 Z" fill="${scarfD}"/>
  <circle cx="60" cy="114" r="3.6" fill="${scarfD}"/>
  <!-- kepala -->
  <ellipse cx="60" cy="72" rx="27" ry="28" fill="${skin}"/>
  ${cw ? `<path d="M34 66 Q36 52 60 50 Q84 52 86 66 Q76 58 66 62 Q60 54 52 62 Q42 58 34 66 Z" fill="url(#hr)"/>`
       : `<path d="M34 66 Q36 52 60 50 Q84 52 86 66 Q80 60 72 61 Q66 57 58 61 Q46 58 34 66 Z" fill="url(#hr)"/><path d="M34 64 Q33 74 36 80 L39 66 Z M86 64 Q87 74 84 80 L81 66 Z" fill="url(#hr)"/>`}
  <ellipse class="eye" cx="49" cy="75" rx="${cw ? 4.2 : 3.8}" ry="${cw ? 5.5 : 5}" fill="#3a2318"/><ellipse class="eye" cx="71" cy="75" rx="${cw ? 4.2 : 3.8}" ry="${cw ? 5.5 : 5}" fill="#3a2318"/>
  <circle cx="50.5" cy="73" r="1.6" fill="#fff"/><circle cx="72.5" cy="73" r="1.6" fill="#fff"/>
  ${cw ? '<path d="M43 66 q5 -3 10 0 M67 66 q5 -3 10 0" stroke="#5a3320" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M44 71 l-3 -2 M76 71 l3 -2" stroke="#3a2318" stroke-width="1.6" stroke-linecap="round"/>'
       : '<path d="M42 66 q6 -4 12 -1 M66 65 q6 -3 12 1" stroke="#2a1a10" stroke-width="3" fill="none" stroke-linecap="round"/>'}
  <ellipse cx="42" cy="84" rx="${cw ? 6 : 5}" ry="3.5" fill="#ff9fb4" opacity="${cw ? .7 : .45}"/><ellipse cx="78" cy="84" rx="${cw ? 6 : 5}" ry="3.5" fill="#ff9fb4" opacity="${cw ? .7 : .45}"/>
  ${cw ? '<path d="M52 86 Q60 94 68 86 Q60 90 52 86 Z" fill="#d9475f" stroke="#a8324a" stroke-width="1.5"/>'
       : '<path d="M51 85 Q60 95 69 85 Z" fill="#b8384f" stroke="#8a2638" stroke-width="1.5" stroke-linejoin="round"/><path d="M54 86 h12" stroke="#fff" stroke-width="2.5"/>'}
  <!-- topi koki (toque) -->
  <g class="hat">
    <circle cx="40" cy="30" r="15" fill="url(#tq)" stroke="#d5dde8" stroke-width="2"/>
    <circle cx="80" cy="30" r="15" fill="url(#tq)" stroke="#d5dde8" stroke-width="2"/>
    <circle cx="60" cy="20" r="18" fill="url(#tq)" stroke="#d5dde8" stroke-width="2"/>
    <path d="M30 34 Q60 44 90 34 L88 52 H32 Z" fill="url(#tq)"/>
    <rect x="31" y="42" width="58" height="14" rx="4" fill="#ffffff" stroke="#d5dde8" stroke-width="2"/>
    <path d="M46 44 V54 M60 44 V54 M74 44 V54" stroke="#e3e9f1" stroke-width="2"/>
    ${cw ? `<circle cx="84" cy="49" r="4.5" fill="${scarf}"/><circle cx="84" cy="49" r="1.8" fill="#fff"/>` : ''}
  </g>
  </svg>`;
  }
  A.karakter = koki({ cewek: true });    // Mbak koki (pemilik kafe)
  A.karakter2 = koki({ cewek: false });  // Mas koki (asisten)

  /* ---------- LATAR KAFE ---------- */
  A.latar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice">
  <defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1df"/><stop offset="1" stop-color="#ffd9c4"/></linearGradient>
  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient>
  <pattern id="st" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="24" fill="#ffc9b3" opacity=".35"/><circle cx="18" cy="12" r="2" fill="#fff" opacity=".7"/></pattern>
  <pattern id="fl" width="40" height="20" patternUnits="userSpaceOnUse"><rect width="40" height="20" fill="#f1d0a8"/><rect width="20" height="10" fill="#e6bb8c"/><rect x="20" y="10" width="20" height="10" fill="#e6bb8c"/></pattern></defs>
  <rect width="400" height="240" fill="url(#w)"/><rect width="400" height="160" fill="url(#st)"/>
  <rect y="150" width="400" height="40" fill="#f5a98f"/><path d="M0 150 H400" stroke="#fff" stroke-width="5"/>
  <path d="M20 156 V184 M60 156 V184 M100 156 V184 M140 156 V184 M180 156 V184 M220 156 V184 M260 156 V184 M300 156 V184 M340 156 V184 M380 156 V184" stroke="#e48f75" stroke-width="3"/>
  <rect y="190" width="400" height="50" fill="url(#fl)"/>
  <rect x="148" y="26" width="104" height="78" rx="8" fill="#fff" stroke="#d9a88c" stroke-width="4"/>
  <rect x="156" y="34" width="88" height="62" rx="4" fill="url(#s)"/>
  <ellipse cx="180" cy="54" rx="14" ry="7" fill="#fff"/><ellipse cx="192" cy="50" rx="10" ry="7" fill="#fff"/><ellipse cx="226" cy="72" rx="12" ry="5" fill="#fff" opacity=".9"/>
  <circle cx="230" cy="46" r="8" fill="#ffe066"/>
  <path d="M200 34 V96 M156 65 H244" stroke="#fff" stroke-width="4"/>
  <path d="M140 20 Q160 60 146 110 L132 110 Q138 60 132 20 Z" fill="#ff8fab"/><path d="M260 20 Q240 60 254 110 L268 110 Q262 60 268 20 Z" fill="#ff8fab"/>
  <rect x="128" y="16" width="144" height="8" rx="4" fill="#c97b5a"/>
  <path d="M0 4 Q50 22 100 4 Q150 22 200 4 Q250 22 300 4 Q350 22 400 4" stroke="#b07a5b" stroke-width="2" fill="none"/>
  ${[12, 36, 62, 88, 112, 138, 162, 188, 212, 238, 262, 288, 312, 338, 362, 388].map((x, i) => `<path d="M${x - 8} ${8 + Math.abs(Math.sin(x / 31.8)) * 8} l8 14 l8 -14 Z" fill="${['#ff7aa2', '#ffd54f', '#4fc3f7', '#81c784'][i % 4]}"/>`).join('')}
  </svg>`;
  A.meja = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" preserveAspectRatio="none">
  <defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb3c8"/><stop offset="1" stop-color="#f27ea2"/></linearGradient></defs>
  <rect x="10" y="12" width="380" height="48" fill="url(#m)" stroke="#c75a7e" stroke-width="3"/>
  <rect x="0" y="2" width="400" height="13" rx="5" fill="#fff8f0" stroke="#d9b49a" stroke-width="3"/>
  <path d="M60 22 V56 M140 22 V56 M220 22 V56 M300 22 V56" stroke="#fff" stroke-width="3" opacity=".5"/>
  </svg>`;

  /* ---------- DEKOR ---------- */
  A.d_lampu = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90"><path d="M40 0 V34" stroke="#6b4a3a" stroke-width="3"/>
  <circle cx="40" cy="66" r="18" fill="#fff6b0" opacity=".55"/><path d="M14 58 Q16 32 40 32 Q64 32 66 58 Z" fill="#26c6b0" stroke="#11806f" stroke-width="3"/>
  <circle cx="40" cy="62" r="8" fill="#fff3a0" stroke="#e0b400" stroke-width="2"/><path d="M24 46 Q30 38 38 37" stroke="#fff" stroke-width="3" opacity=".6" fill="none"/></svg>`;
  A.d_rak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">
  <rect x="6" y="6" width="108" height="90" rx="4" fill="#c88a5a" stroke="#7a4a26" stroke-width="3"/><rect x="12" y="12" width="96" height="78" fill="#a86a3e"/>
  <rect x="8" y="46" width="104" height="6" fill="#d9a070" stroke="#7a4a26" stroke-width="2"/><rect x="8" y="86" width="104" height="6" fill="#d9a070" stroke="#7a4a26" stroke-width="2"/>
  ${[20, 48, 76].map((x) => `<path d="M${x} 46 Q${x} 26 ${x + 12} 25 Q${x + 24} 26 ${x + 24} 46 Z" fill="#f2b06a" stroke="#8f4f17" stroke-width="2"/><path d="M${x + 6} 32 l4 5 M${x + 13} 30 l4 5" stroke="#ffe3b5" stroke-width="2.5"/>`).join('')}
  ${[16, 44, 72].map((x) => `<path d="M${x} 86 Q${x + 14} 64 ${x + 30} 86 Q${x + 15} 80 ${x} 86 Z" fill="#e7a24f" stroke="#8f4f17" stroke-width="2"/>`).join('')}</svg>`;
  A.d_tanaman = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110">
  <path d="M40 70 Q20 50 8 30 Q30 34 40 60 M40 70 Q38 30 44 6 Q54 34 42 66 M40 70 Q60 44 76 36 Q66 60 42 70" fill="#5cb85c" stroke="#2e7d32" stroke-width="2.5"/>
  <path d="M18 68 H62 L56 106 H24 Z" fill="#e0855a" stroke="#8a3f1f" stroke-width="3" stroke-linejoin="round"/><rect x="14" y="64" width="52" height="10" rx="3" fill="#f09a6e" stroke="#8a3f1f" stroke-width="2.5"/></svg>`;
  A.d_papan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">
  <rect x="4" y="4" width="92" height="82" rx="6" fill="#3d4a43" stroke="#a0693d" stroke-width="7"/>
  <text x="50" y="28" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="15" fill="#ffe082">MENU</text>
  <path d="M16 42 H60 M16 54 H54 M16 66 H62" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>
  <circle cx="76" cy="46" r="3" fill="#ff8fab"/><circle cx="76" cy="58" r="3" fill="#81d4fa"/><circle cx="76" cy="70" r="3" fill="#c5e1a5"/></svg>`;
  A.d_etalase = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
  <path d="M8 74 V30 Q8 8 30 8 H90 Q112 8 112 30 V74 Z" fill="#dff4ff" opacity=".8" stroke="#7fb3d0" stroke-width="3"/>
  <rect x="4" y="70" width="112" height="9" rx="3" fill="#fff" stroke="#c9a68f" stroke-width="2.5"/>
  <path d="M14 46 H106" stroke="#7fb3d0" stroke-width="2"/>
  <rect x="22" y="28" width="24" height="16" rx="3" fill="#ffb3c8" stroke="#c2577a" stroke-width="2"/><circle cx="34" cy="26" r="3" fill="#e53950"/>
  <rect x="64" y="30" width="26" height="14" rx="3" fill="#ffe08a" stroke="#c98d1f" stroke-width="2"/>
  <path d="M22 68 Q34 54 46 68 Z" fill="#f2b06a" stroke="#8f4f17" stroke-width="2"/><rect x="62" y="56" width="28" height="12" rx="3" fill="#7a3e1a"/><path d="M62 60 H90 M62 64 H90" stroke="#f6d27a" stroke-width="1.5"/>
  <path d="M20 18 L28 40" stroke="#fff" stroke-width="4" opacity=".7"/></svg>`;


  /* ---------- KOTAK MISTERI ---------- */
  A.kotak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b98cff"/><stop offset="1" stop-color="#7b3fe4"/></linearGradient></defs>
  <ellipse cx="50" cy="92" rx="36" ry="5" fill="rgba(0,0,0,.18)"/>
  <rect x="16" y="44" width="68" height="46" rx="7" fill="url(#a)" stroke="#4b1fa0" stroke-width="3"/>
  <rect x="44" y="44" width="12" height="46" fill="#ffd54f" stroke="#c98d00" stroke-width="2"/>
  <text x="30" y="76" font-family="Arial Black,Arial" font-weight="900" font-size="20" fill="#fff" opacity=".85">?</text><text x="62" y="76" font-family="Arial Black,Arial" font-weight="900" font-size="20" fill="#fff" opacity=".85">?</text>
  <rect x="20" y="48" width="5" height="34" rx="2" fill="#fff" opacity=".3"/></svg>`;
  A.kotak_tutup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a5ff"/><stop offset="1" stop-color="#8b52ee"/></linearGradient></defs>
  <path d="M50 30 Q30 2 22 14 Q18 26 50 30 Q82 26 78 14 Q70 2 50 30 Z" fill="#ffd54f" stroke="#c98d00" stroke-width="3"/>
  <rect x="10" y="28" width="80" height="22" rx="6" fill="url(#a)" stroke="#4b1fa0" stroke-width="3"/>
  <rect x="44" y="28" width="12" height="22" fill="#ffd54f" stroke="#c98d00" stroke-width="2"/><circle cx="50" cy="30" r="6" fill="#ffb300" stroke="#c98d00" stroke-width="2"/></svg>`;
  A.kotak_full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${A.kotak.replace(/^<svg[^>]*>/, '').replace('</svg>', '')}<g transform="translate(0 16) scale(1 1)">${A.kotak_tutup.replace(/^<svg[^>]*>/, '').replace('</svg>', '').replace(/id="a"/, 'id="b"').replace(/url\(#a\)/, 'url(#b)')}</g></svg>`;
  A.d_eskrim = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100">
  <rect x="10" y="30" width="60" height="64" rx="8" fill="#8fd9ff" stroke="#1f7fb8" stroke-width="3"/><rect x="18" y="40" width="44" height="22" rx="4" fill="#fff" stroke="#1f7fb8" stroke-width="2"/>
  <circle cx="30" cy="51" r="7" fill="#ff9fbe"/><circle cx="50" cy="51" r="7" fill="#fff3a0"/><path d="M34 70 h12 l-6 14 z" fill="#e0a55b"/>
  <path d="M40 4 Q56 6 54 20 Q60 28 40 30 Q20 28 26 20 Q24 6 40 4Z" fill="#ffc2d6" stroke="#c2577a" stroke-width="2.5"/><circle cx="40" cy="4" r="4" fill="#e53950"/></svg>`;
  A.d_kucing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 80">
  <ellipse cx="45" cy="74" rx="34" ry="5" fill="rgba(0,0,0,.15)"/><path d="M70 62 Q88 56 82 40" stroke="#f0a050" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="48" cy="58" rx="26" ry="16" fill="#ffb866" stroke="#b86a1c" stroke-width="2.5"/>
  <path d="M14 28 L18 8 L30 22 Z M46 28 L44 8 L32 20 Z" fill="#ffb866" stroke="#b86a1c" stroke-width="2.5"/>
  <circle cx="30" cy="36" r="18" fill="#ffc47a" stroke="#b86a1c" stroke-width="2.5"/>
  <path d="M22 34 q3 -3 6 0 M32 34 q3 -3 6 0" stroke="#4a2a10" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M28 41 q2 2 4 0" stroke="#4a2a10" stroke-width="2" fill="none"/>
  <circle cx="21" cy="41" r="3" fill="#ff9fb4" opacity=".7"/><circle cx="39" cy="41" r="3" fill="#ff9fb4" opacity=".7"/></svg>`;


  A.ubin_ikon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g transform="rotate(-10 40 50)"><rect x="12" y="30" width="44" height="48" rx="8" fill="#f3e6cc" stroke="#b98a4e" stroke-width="3"/><rect x="12" y="26" width="44" height="46" rx="8" fill="#fffdf6" stroke="#b98a4e" stroke-width="3"/><circle cx="34" cy="49" r="11" fill="#e53950"/></g>
  <g transform="rotate(8 66 54)"><rect x="44" y="34" width="44" height="48" rx="8" fill="#f3e6cc" stroke="#b98a4e" stroke-width="3"/><rect x="44" y="30" width="44" height="46" rx="8" fill="#fffdf6" stroke="#b98a4e" stroke-width="3"/><path d="M66 40 l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1z" fill="#ffc107" stroke="#d98200" stroke-width="2"/></g></svg>`;
  /* ---------- WAJAH PELANGGAN ---------- */
  const faces = [['#3a2318', '#ffe0c7', '#4fc3f7'], ['#c0392b', '#f5cba7', '#ffd54f'], ['#2c2c2c', '#e8b48f', '#81c784'], ['#f4d03f', '#ffe0c7', '#ba68c8'], ['#6d4c41', '#d7a17a', '#ff8a65']];
  faces.forEach(([hair, skin, shirt], i) => {
    A['wajah' + i] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="29" fill="#fff4ea"/>
    <path d="M10 60 Q12 44 30 44 Q48 44 50 60 Z" fill="${shirt}"/><circle cx="30" cy="27" r="14" fill="${skin}"/>
    <path d="M15 27 Q14 10 30 10 Q46 10 45 27 Q40 18 30 19 Q22 18 15 27 Z" fill="${hair}"/>${i % 2 ? `<path d="M15 26 Q10 40 16 46 L18 30 Z M45 26 Q50 40 44 46 L42 30Z" fill="${hair}"/>` : ''}
    <circle cx="25" cy="28" r="2" fill="#2b1a10"/><circle cx="35" cy="28" r="2" fill="#2b1a10"/><path d="M25 34 Q30 38 35 34" stroke="#a8324a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="21" cy="32" r="2.5" fill="#ff9fb4" opacity=".6"/><circle cx="39" cy="32" r="2.5" fill="#ff9fb4" opacity=".6"/></svg>`;
  });

  const cache = {};
  window.ART = {
    raw: A,
    url(id) { return cache[id] || (cache[id] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(A[id])); }
  };
})();
