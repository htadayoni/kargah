import { actions, type Project } from '@/lib/state';
import { useI18n } from '@/lib/useI18n';
import NoteList from '@/components/NoteList';

export function NotesList({ project, maxHeight }: { project: Project; maxHeight?: number }) {
  const { t } = useI18n();
  return (
    <NoteList
      items={project.notes}
      placeholder={t('notes.placeholder')}
      empty={t('notes.empty')}
      onAdd={(x) => actions.addNote(project.id, x)}
      onRemove={(id) => actions.removeNote(project.id, id)}
      maxHeight={maxHeight}
    />
  );
}
export function IdeasList({ project, maxHeight }: { project: Project; maxHeight?: number }) {
  const { t } = useI18n();
  return (
    <NoteList
      items={project.ideas}
      placeholder={t('ideas.placeholder')}
      empty={t('ideas.empty')}
      onAdd={(x) => actions.addIdea(project.id, x)}
      onRemove={(id) => actions.removeIdea(project.id, id)}
      maxHeight={maxHeight}
    />
  );
}
export function FeedbackList({ project, maxHeight }: { project: Project; maxHeight?: number }) {
  const { t } = useI18n();
  return (
    <NoteList
      items={project.feedback}
      placeholder={t('feedback.add')}
      empty={t('feedback.empty')}
      onAdd={(x) => actions.addFeedback(project.id, x)}
      onRemove={(id) => actions.removeFeedback(project.id, id)}
      maxHeight={maxHeight}
    />
  );
}
