import { useEffect, useState } from 'react';
import { resolveBackground, type BackgroundConfig } from '@/lib/themes';

export default function Scene({ bg }: { bg: BackgroundConfig }) {
  const [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);
  const r = resolveBackground(bg, hour);
  return <div className="k-scene" style={r.kind === 'image' ? { backgroundImage: `url(${r.url})` } : { background: r.color }} />;
}
