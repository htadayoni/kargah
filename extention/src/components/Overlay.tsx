import type { ReactNode } from 'react';

/** Click-outside layer for modals and popovers (lives inside the scaled stage). */
export default function Overlay({ onClose, dim = true, children, darkness = .35, fullBleed = false }: { onClose: () => void; dim?: boolean; darkness?: number; fullBleed?: boolean; children: ReactNode }) {
  return (
    <div className={`k-overlay absolute inset-0 z-40 ${fullBleed ? 'k-overlay-full' : ''}`} style={{ background: dim ? `rgb(5 10 25 / ${darkness})` : 'transparent', boxShadow: fullBleed && dim ? `0 0 0 calc(100vmax / var(--s, 1)) rgb(5 10 25 / ${darkness})` : undefined }} onMouseDown={onClose}>
      <div onMouseDown={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
