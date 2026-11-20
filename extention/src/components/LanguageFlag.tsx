import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';

/** Vector flags are bundled with the extension and clipped by the circular badge. */
export default function LanguageFlag({ language }: { language: Locale }) {
  let flag: ReactNode;
  switch (language) {
    case 'fa':
      // Plain Iranian tricolor, intentionally without the central emblem.
      flag = <><rect width="60" height="40" fill="#239f40" /><rect y="13.333" width="60" height="13.334" fill="#fff" /><rect y="26.667" width="60" height="13.333" fill="#da0000" /></>;
      break;
    case 'fr':
      flag = <><rect width="60" height="40" fill="#ed2939" /><rect width="40" height="40" fill="#fff" /><rect width="20" height="40" fill="#002395" /></>;
      break;
    case 'de':
      flag = <><rect width="60" height="40" fill="#ffce00" /><rect width="60" height="26.667" fill="#d00" /><rect width="60" height="13.333" fill="#000" /></>;
      break;
    case 'en':
      flag = <><rect width="60" height="40" fill="#fff" />{Array.from({ length: 7 }, (_, i) => <rect key={i} y={i * 80 / 13} width="60" height={40 / 13} fill="#b22234" />)}<rect width="25" height={280 / 13} fill="#3c3b6e" />{Array.from({ length: 9 }, (_, row) => Array.from({ length: row % 2 ? 5 : 6 }, (_, col) => <circle key={`${row}-${col}`} cx={(row % 2 ? 4.2 : 2.1) + col * 4.15} cy={1.2 + row * 2.4} r=".6" fill="#fff" />))}</>;
      break;
    case 'tr':
      flag = <><rect width="60" height="40" fill="#e30a17" /><circle cx="25" cy="20" r="10" fill="#fff" /><circle cx="28" cy="20" r="8" fill="#e30a17" /><polygon points={star(38, 20, 5.1, 2.1, -18)} fill="#fff" /></>;
      break;
    case 'ar':
      flag = <><rect width="60" height="40" fill="#006c35" /><text x="30" y="19" textAnchor="middle" direction="rtl" fill="#fff" fontSize="8.2" fontWeight="700" fontFamily="serif">لا إله إلا الله محمد رسول الله</text><path d="M14 25h31c0 2-2 3-4 3H18c-2 0-4-1-4-3Zm-3-1h4v5h-4z" fill="#fff" /></>;
      break;
    case 'hi':
      flag = <><rect width="60" height="40" fill="#ff9933" /><rect y="13.333" width="60" height="13.334" fill="#fff" /><rect y="26.667" width="60" height="13.333" fill="#138808" /><circle cx="30" cy="20" r="5.3" fill="none" stroke="#000080" strokeWidth=".65" /><circle cx="30" cy="20" r=".85" fill="#000080" />{Array.from({ length: 24 }, (_, i) => <path key={i} d="M30 15v10" stroke="#000080" strokeWidth=".34" transform={`rotate(${i * 15} 30 20)`} />)}</>;
      break;
    case 'zh':
      flag = <><rect width="60" height="40" fill="#de2910" /><polygon points={star(12, 10, 6, 2.4)} fill="#ffde00" />{[[21, 4, 20], [25, 8, 40], [25, 14, 15], [21, 18, 30]].map(([x, y, angle]) => <polygon key={`${x}-${y}`} points={star(x!, y!, 2, .8, angle)} fill="#ffde00" />)}</>;
      break;
    case 'ja':
      flag = <><rect width="60" height="40" fill="#fff" /><circle cx="30" cy="20" r="11.5" fill="#bc002d" /></>;
      break;
    case 'ko':
      flag = <><rect width="60" height="40" fill="#fff" /><g transform="rotate(33.69 30 20)"><circle cx="30" cy="20" r="10" fill="#cd2e3a" /><path d="M20 20a5 5 0 0 0 10 0 5 5 0 0 1 10 0 10 10 0 0 1-20 0" fill="#0047a0" /></g><g fill="#111"><g transform="translate(10 7) rotate(-34 6 4)"><rect width="12" height="2" /><rect y="3" width="12" height="2" /><rect y="6" width="12" height="2" /></g><g transform="translate(38 25) rotate(-34 6 4)">{[0, 3, 6].map(y => <g key={y}><rect y={y} width="5" height="2" /><rect x="7" y={y} width="5" height="2" /></g>)}</g><g transform="translate(38 7) rotate(34 6 4)"><rect width="12" height="2" /><rect y="3" width="5" height="2" /><rect x="7" y="3" width="5" height="2" /><rect y="6" width="12" height="2" /></g><g transform="translate(10 25) rotate(34 6 4)"><rect width="5" height="2" /><rect x="7" width="5" height="2" /><rect y="3" width="12" height="2" /><rect y="6" width="5" height="2" /><rect x="7" y="6" width="5" height="2" /></g></g></>;
      break;
  }
  return <span aria-hidden="true" className="k-language-flag"><svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" focusable="false">{flag}</svg></span>;
}

function star(x: number, y: number, outer: number, inner: number, rotation = 0) {
  return Array.from({ length: 10 }, (_, i) => {
    const angle = (i * 36 - 90 + rotation) * Math.PI / 180;
    const radius = i % 2 ? inner : outer;
    return `${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`;
  }).join(' ');
}
