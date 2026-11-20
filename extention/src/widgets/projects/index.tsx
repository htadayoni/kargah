import ProjectsWidget from '../ProjectsWidget';
import { Cube } from '@/components/Icons';
import { defineLegacyWidget } from '../types';
import { WidgetPreview } from '../sdk/preview';

export default defineLegacyWidget({
  id: 'projects', titleKey: 'widget.projects', category: 'project', Icon: Cube, untitled: true, panel: true,
  description: { en: "Switch between your projects.", fa: "بین پروژه‌هایت جابه‌جا شو.", fr: "Passez d’un projet à l’autre.", de: "Zwischen Projekten wechseln.", tr: "Projelerin arasında geçiş yap.", ar: "تنقل بين مشاريعك.", hi: "अपने प्रोजेक्ट बदलें।", zh: "切换项目。", ja: "プロジェクトを切り替えます。", ko: "프로젝트를 전환하세요." },
  render: project => <ProjectsWidget />,
  preview: () => <WidgetPreview kind="projects" />,
});
