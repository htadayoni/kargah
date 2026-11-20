import { useState } from 'react';
import { actions, type Project } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import { Check, Clock } from '@/components/Icons';
import { WidgetAction, WidgetEditableText, WidgetFrame, WidgetIcon, WidgetInlineInput, WidgetRow } from './sdk';

export default function NextStepWidget({ project }: { project: Project }) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const text = project.nextStep ?? t('next.default');
  const startEdit = () => { setDraft(text); setEditing(true); };
  const save = () => { actions.setNextStep(project.id, draft.trim() || null); setEditing(false); };
  return <WidgetFrame>
    <WidgetRow><WidgetIcon icon={Clock} />{editing
      ? <WidgetInlineInput label={t('next.edit')} value={draft} onChange={setDraft} onSave={save} onCancel={() => setEditing(false)} />
      : <WidgetEditableText onEdit={startEdit} title={t('next.edit')} completed={project.nextDone}>{text}</WidgetEditableText>}
    </WidgetRow>
    <WidgetAction onClick={() => actions.toggleNextDone(project.id)}>{project.nextDone && <Check />}{project.nextDone ? t('next.done') : t('next.record')}</WidgetAction>
  </WidgetFrame>;
}
