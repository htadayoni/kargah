import { actions, useAppState } from '@/lib/state';
import { dateKey } from './mood-copy';
import { WidgetMoodCard } from './sdk/mood-ui';
export { colors, dateKey, levels, moodText } from './mood-copy';
export { MoodChoices, MoodIcon } from './sdk/mood-ui';

export default function MoodWidget() {
  const today = dateKey();
  const entry = useAppState().moodEntries?.[today];
  return <WidgetMoodCard value={entry?.mood} onChange={level => actions.setMood(today, level)} onAddNote={note => actions.setMoodNote(today, note)} />;
}
