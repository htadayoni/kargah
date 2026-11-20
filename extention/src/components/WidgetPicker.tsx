import { useMemo, useState } from 'react';
import { actions, SLOT_ORDER, type Project, type SlotId, type WidgetType } from '@/lib/state';
import type { Locale } from '@/lib/i18n';
import { useMockFeatures } from '@/lib/featureFlags';
import { useI18n } from '@/lib/useI18n';
import { WIDGETS, WIDGET_TYPES } from '@/widgets/registry';
import WidgetErrorBoundary, { WidgetRender } from './WidgetErrorBoundary';
import { Check, Close, Search } from './Icons';

type Category = 'all' | 'project' | 'focus' | 'notes';
const copy: Record<Locale, { search: string; library: string; preview: string; add: string; added: string; noMatch: string; noSpace: string; category: Record<Category, string> }> = {
  en: { search: 'Search widgets', library: 'Widget library', preview: 'Preview', add: 'Add to desk', added: 'Already on this desk', noMatch: 'No widgets found.', noSpace: 'There is no empty slot on this desk.', category: { all: 'All', project: 'Project', focus: 'Focus', notes: 'Notes' } },
  fa: { search: 'جست‌وجوی ویجت‌ها', library: 'کتابخانه ویجت‌ها', preview: 'پیش‌نمایش', add: 'افزودن به میز', added: 'به این میز اضافه شده', noMatch: 'ویجتی پیدا نشد.', noSpace: 'جای خالی در این میز وجود ندارد.', category: { all: 'همه', project: 'پروژه', focus: 'تمرکز', notes: 'یادداشت' } },
  fr: { search: 'Rechercher des widgets', library: 'Bibliothèque de widgets', preview: 'Aperçu', add: 'Ajouter au bureau', added: 'Déjà ajouté', noMatch: 'Aucun widget trouvé.', noSpace: 'Aucun emplacement libre.', category: { all: 'Tous', project: 'Projet', focus: 'Concentration', notes: 'Notes' } },
  de: { search: 'Widgets suchen', library: 'Widget-Bibliothek', preview: 'Vorschau', add: 'Zum Schreibtisch hinzufügen', added: 'Bereits hinzugefügt', noMatch: 'Keine Widgets gefunden.', noSpace: 'Kein freier Platz vorhanden.', category: { all: 'Alle', project: 'Projekt', focus: 'Fokus', notes: 'Notizen' } },
  tr: { search: 'Bileşen ara', library: 'Bileşen kütüphanesi', preview: 'Önizleme', add: 'Masaya ekle', added: 'Zaten eklendi', noMatch: 'Bileşen bulunamadı.', noSpace: 'Boş yer yok.', category: { all: 'Tümü', project: 'Proje', focus: 'Odak', notes: 'Notlar' } },
  ar: { search: 'البحث عن الأدوات', library: 'مكتبة الأدوات', preview: 'معاينة', add: 'إضافة إلى المكتب', added: 'أضيفت مسبقاً', noMatch: 'لم يتم العثور على أدوات.', noSpace: 'لا يوجد مكان فارغ.', category: { all: 'الكل', project: 'المشروع', focus: 'التركيز', notes: 'ملاحظات' } },
  hi: { search: 'विजेट खोजें', library: 'विजेट लाइब्रेरी', preview: 'पूर्वावलोकन', add: 'डेस्क पर जोड़ें', added: 'पहले से जोड़ा गया', noMatch: 'कोई विजेट नहीं मिला।', noSpace: 'कोई खाली जगह नहीं है।', category: { all: 'सभी', project: 'प्रोजेक्ट', focus: 'फ़ोकस', notes: 'नोट्स' } },
  zh: { search: '搜索组件', library: '组件库', preview: '预览', add: '添加到桌面', added: '已添加', noMatch: '未找到组件。', noSpace: '桌面没有空位。', category: { all: '全部', project: '项目', focus: '专注', notes: '笔记' } },
  ja: { search: 'ウィジェットを検索', library: 'ウィジェット一覧', preview: 'プレビュー', add: 'デスクに追加', added: '追加済み', noMatch: '見つかりません。', noSpace: '空きがありません。', category: { all: 'すべて', project: 'プロジェクト', focus: '集中', notes: 'メモ' } },
  ko: { search: '위젯 검색', library: '위젯 라이브러리', preview: '미리보기', add: '데스크에 추가', added: '이미 추가됨', noMatch: '위젯을 찾을 수 없습니다.', noSpace: '빈 자리가 없습니다.', category: { all: '전체', project: '프로젝트', focus: '집중', notes: '메모' } },
};

export default function WidgetPicker({ project, slot, onClose }: { project: Project; slot: SlotId | null; onClose: () => void }) {
  const { t, locale, dir } = useI18n();
  const text = copy[locale];
  const [mockEnabled] = useMockFeatures();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [selected, setSelected] = useState<WidgetType>('next');
  const placed = new Set(Object.values(project.slots));
  const target = slot ?? SLOT_ORDER.find((s) => !project.slots[s]) ?? null;
  const filtered = useMemo(() => WIDGET_TYPES.filter((type) => (!WIDGETS[type].experimental || mockEnabled) && (category === 'all' || WIDGETS[type].category === category) && t(WIDGETS[type].titleKey).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [category, query, locale, mockEnabled]);
  const current = filtered.includes(selected) ? selected : filtered[0];
  const def = current ? WIDGETS[current] : undefined;
  const alreadyPlaced = current ? placed.has(current) : false;

  return (
    <section role="dialog" aria-modal="true" aria-labelledby="widget-picker-title" className="k-widget-picker k-solid k-pop">
      <header className="k-picker-header">
        <h2 id="widget-picker-title">{t('widget.pick')}</h2>
        <label className="k-picker-search"><Search aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} aria-label={text.search} /></label>
        <button type="button" onClick={onClose} aria-label={t('common.close')} className="k-picker-close"><Close /></button>
      </header>
      <div className="k-picker-content">
        <div className="k-picker-list" dir={dir}>
          <h3>{text.library}</h3>
          <div className="k-picker-categories" aria-label={text.library}>
            {(['all', 'project', 'focus', 'notes'] as Category[]).map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={category === item ? 'is-active' : ''}>{text.category[item]}</button>)}
          </div>
          <div className="k-picker-items">
            {filtered.map((type) => { const widget = WIDGETS[type]; const Icon = widget.Icon; return <button type="button" key={type} onClick={() => setSelected(type)} aria-pressed={current === type} className={`k-picker-item ${current === type ? 'is-selected' : ''}`}><Icon aria-hidden="true" /><span>{t(widget.titleKey)}</span><span className="k-picker-indicator">{current === type && <Check />}</span></button>; })}
            {!filtered.length && <p className="k-picker-empty">{text.noMatch}</p>}
          </div>
        </div>
        <div className="k-picker-preview" dir={dir}>
          <h3>{text.preview}</h3>
          {def && current && <>
            <div className="k-picker-sample" aria-hidden="true" inert>
              <div className="k-picker-sample-title"><def.Icon /><span>{t(def.titleKey)}</span></div>
              <div className="k-picker-sample-body"><WidgetErrorBoundary key={current} message={locale === 'fa' ? 'پیش‌نمایش در دسترس نیست.' : 'Preview unavailable.'}><WidgetRender render={def.preview} /></WidgetErrorBoundary></div>
            </div>
            <div className="k-picker-details"><h4>{t(def.titleKey)}</h4><p>{def.description[locale] ?? def.description.en}</p>
              <button type="button" className="k-picker-add" disabled={alreadyPlaced || !target} onClick={() => { if (target && !alreadyPlaced) { actions.placeWidget(project.id, target, current); onClose(); } }}>{alreadyPlaced ? text.added : !target ? text.noSpace : text.add}</button>
            </div>
          </>}
        </div>
      </div>
    </section>
  );
}
