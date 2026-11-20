import { useEffect, useState } from 'react';
import { actions, useAppState } from '@/lib/state';
import { formatCountdown } from '@/lib/time';
import { useI18n } from '@/lib/useI18n';
import { Clock } from '@/components/Icons';
import { WidgetAction, WidgetFrame, WidgetIcon, WidgetRow, WidgetText } from './sdk';

/** Shared by the card and the "Focus" quick panel. */
export function useFocus() {
  const { focus } = useAppState();
  const [now, setNow] = useState(Date.now());
  const running = focus.endsAt !== null && focus.endsAt > now;
  const finished = focus.endsAt !== null && focus.endsAt <= now;
  useEffect(() => {
    if (focus.endsAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [focus.endsAt]);
  const remaining = focus.endsAt ? focus.endsAt - now : (focus.remainingMs ?? focus.minutes * 60_000);
  return { focus, running, finished, remaining };
}

export default function FocusWidget() {
  const { t, locale } = useI18n();
  const { focus, running, finished, remaining } = useFocus();
  return <WidgetFrame>
    <WidgetRow><WidgetIcon icon={Clock} /><WidgetText size="display">{running || focus.remainingMs != null ? formatCountdown(locale, remaining) : finished ? t('focus.finished') : t('focus.minutes', { n: focus.minutes })}</WidgetText></WidgetRow>
    <WidgetAction onClick={() => (running ? actions.stopFocus() : actions.startFocus())}>{running ? t('focus.pause') : finished ? t('focus.again') : t('focus.start')}</WidgetAction>
  </WidgetFrame>;
}
