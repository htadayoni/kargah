import { siFigma, siGithub, siGmail, siNotion } from 'simple-icons';

const BRANDS: { match: RegExp; icon: { path: string; hex: string }; color?: string }[] = [
  { match: /(^|\.)github\.com$/, icon: siGithub, color: '#f4f4f4' },
  { match: /(^|\.)figma\.com$/, icon: siFigma },
  { match: /(^|\.)notion\.(so|site)$/, icon: siNotion, color: '#f4f4f4' },
  { match: /^mail\.google\.com$/, icon: siGmail },
];

export default function BrandIcon({ url, title, size = 28 }: { url: string; title: string; size?: number }) {
  let host = '';
  try {
    host = new URL(url).hostname;
  } catch {
    /* ignore */
  }
  const b = BRANDS.find((x) => x.match.test(host));
  if (b) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
        <path d={b.icon.path} fill={b.color ?? `#${b.icon.hex}`} />
      </svg>
    );
  }
  return (
    <span className="grid place-items-center rounded-lg bg-white/15 font-bold" style={{ width: size, height: size, fontSize: size * 0.55 }}>
      {title.trim().charAt(0).toUpperCase() || '•'}
    </span>
  );
}
