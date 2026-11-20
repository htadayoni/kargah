import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
});

export const Lantern = (p: P) => (
  <svg viewBox="0 0 34 48" fill="none" {...p}>
    <g stroke="#f4e9d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V6a5 5 0 0 1 10 0v2" />
      <path d="M8 15c0-4 3-7 9-7s9 3 9 7" />
      <path d="M5 15h24M5 39h24" />
      <path d="M7 15l-2 24M27 15l2 24" />
      <path d="M7 39l1 5h18l1-5" />
    </g>
    <g className="k-flame">
      <path d="M17 22c3.4 3.6 5.5 6.4 5.5 9.6a5.5 5.5 0 0 1-11 0C11.5 28.4 13.6 25.6 17 22z" fill="#ffb21d" />
      <path d="M17 28c1.5 1.6 2.4 2.9 2.4 4.300a2.4 2.4 0 0 1-4.8 0c0-1.4.9-2.7 2.4-4.300z" fill="#fff0c2" />
    </g>
  </svg>
);
export const Search = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
);
export const Sliders = (p: P) => (
  <svg {...base(p)}><path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4" /></svg>
);
export const Globe = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18" /></svg>
);
export const Gear = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.800l.1.1a2 2 0 1 1-2.8 2.800l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.500V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.800l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.800l-.1-.1a2 2 0 1 1 2.8-2.800l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.500V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.800l-.1.1a1.7 1.7 0 0 0-.3 1.800V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);
export const Plus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
/** Points right (›). Flip with rtl:/ltr: rotate classes where direction matters. */
export const ChevronR = (p: P) => (
  <svg {...base(p)}><path d="M9 5l7 7-7 7" /></svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>
);
export const Close = (p: P) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}><path d="M5 12.500l4.5 4.500L19 7" /></svg>
);
export const Grid = (p: P) => (
  <svg {...base(p)}><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></svg>
);
export const NoteIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7M9 8h3" /></svg>
);
export const Bulb = (p: P) => (
  <svg {...base(p)}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.900c.6.5 1 1.2 1 2.100h5c0-.9.4-1.6 1-2.100A6 6 0 0 0 12 3z" /></svg>
);
export const Target = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></svg>
);
export const Clock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Chat = (p: P) => (
  <svg {...base(p)}><path d="M4 5h16v11H9l-5 4z" /></svg>
);
export const Cube = (p: P) => (
  <svg {...base(p)}><path d="M12 3l8 4.500v9L12 21l-8-4.500v-9zM4 7.500l8 4.5 8-4.500M12 12v9" /></svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
);
export const Rocket = (p: P) => (
  <svg {...base(p)}><path d="M14 4c3 .2 5.8 2.8 6 6-2 3.5-5 6-8 7l-5-5c1-3 3.5-6 7-8zM9 15l-4 1 1-4M9.5 18.500L8 22l-.5-3.5" /><circle cx="14.5" cy="9.5" r="1.3" /></svg>
);
export const Chart = (p: P) => (
  <svg {...base(p)}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
export const Grip = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <circle cx="9" cy="7" r="1.7" /><circle cx="15" cy="7" r="1.7" /><circle cx="9" cy="12" r="1.7" /><circle cx="15" cy="12" r="1.7" /><circle cx="9" cy="17" r="1.7" /><circle cx="15" cy="17" r="1.7" />
  </svg>
);
export const Upload = (p: P) => (
  <svg {...base(p)}><path d="M12 16V4M7 9l5-5 5 5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
);

export const PROJECT_ICONS = [Cube, Mail, Rocket, Chart, Bulb, NoteIcon];
export const Pin = (p: P) => (
  <svg {...base(p)}><path d="M15 4l5 5-3 1-3 3 .5 4-1.5 1.500L9 14l-5 6M13 6l-1 3-4 1 6 6 1-4 3-1" /></svg>
);
