import { useAppState } from './state';
import { LOCALE_META, formatNumber, translate, type MessageKey } from './i18n';

export function useI18n() {
  const locale = useAppState().settings.locale;
  return {
    locale,
    dir: LOCALE_META[locale].dir,
    t: (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    n: (v: number) => formatNumber(locale, v),
  };
}
