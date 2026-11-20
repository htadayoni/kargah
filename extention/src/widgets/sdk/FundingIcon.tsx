import type { FundingType } from '@/lib/funding';

export function FundingIcon({ type }: { type: FundingType }) {
  if (type === 'grant') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z"/><path d="m4 11 8 4.5 8-4.5M4 16l8 4.5 8-4.5"/></svg>;
  if (type === 'investment') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19h16M7 16v-4m5 4V9m5 7V5"/><path d="m14 5 3-2 3 2"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4c2-1 4-1 6-1 0 2 0 4-1 6l-7 7-4-4 6-8Z"/><path d="m8 12-3 1-2 3 5 1m4-1-1 5 3-2 1-3M7 17l-3 3"/><circle cx="15.5" cy="7.5" r="1.5"/></svg>;
}
