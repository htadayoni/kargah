import { useEffect, useState } from 'react';
import type { Project } from '@/lib/state';
import { formatClock, formatDate } from '@/lib/time';
import { useI18n } from '@/lib/useI18n';
import { WidgetClock } from './sdk';

export default function ClockWidget({ project }: { project: Project }) {
  const { locale } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const { calendar, hour12 } = project.clockSettings ?? { calendar: 'gregorian', hour12: false };
  const clock = formatClock(locale, hour12, now);
  return <WidgetClock time={clock.time} period={clock.period} date={formatDate(locale, calendar, now)} />;
}
