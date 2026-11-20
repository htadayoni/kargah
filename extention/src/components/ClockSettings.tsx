import { actions, type Project } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { WidgetSettingsChoice, WidgetSettingsPanel, WidgetSettingsSelect } from '@/widgets/sdk';

export default function ClockSettings({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t } = useI18n();
  const value = project.clockSettings ?? { calendar: 'gregorian', hour12: false };
  return <WidgetSettingsPanel title={`${t('widget.clock')} · ${t('widget.settings')}`} label={t('widget.settings')} closeLabel={t('common.close')} onClose={onClose}>
    <WidgetSettingsSelect id="clock-calendar" label={t('settings.calendar')} value={value.calendar} onChange={calendar => actions.setClockCalendar(project.id, calendar as 'jalali' | 'gregorian')} options={[{ value: 'jalali', label: t('settings.cal.jalali') }, { value: 'gregorian', label: t('settings.cal.gregorian') }]} />
    <WidgetSettingsChoice label={t('settings.timeFormat')} value={value.hour12 ? '12' : '24'} onChange={hour => actions.setClockHour12(project.id, hour === '12')} options={[{ value: '24', label: t('settings.h24') }, { value: '12', label: t('settings.h12') }]} />
  </WidgetSettingsPanel>;
}
