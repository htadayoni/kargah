import type { MoodLevel } from '@/lib/state';

export const levels: MoodLevel[] = [1, 2, 3, 4, 5];
export const colors = ['#e99a9d', '#e8ae89', '#c5b4ec', '#9dcdb6', '#f2c37f'];
export function dateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export const moodText = (fa: boolean) => fa
  ? { question: 'امروز چطوری؟', labels: ['خیلی سخت', 'نه‌چندان خوب', 'معمولی', 'خوب', 'عالی'], trend: 'مشاهده روند', title: 'حال و انرژی من', energy: 'انرژی امروز', energyLabels: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'], week: '۷ روز', month: '۳۰ روز', history: 'روند حال من', empty: 'هنوز حال امروزت را ثبت نکردی.', noData: 'برای دیدن روند، حالت را ثبت کن.', missing: 'ثبت نشده', community: 'حال سازنده‌ها', soon: 'به‌زودی', communityText: 'در آینده می‌تونی به‌صورت اختیاری و ناشناس در آمار جامعه مشارکت کنی.', support: 'لازم نیست امروز همه‌چیز رو حل کنی.', private: 'اطلاعاتت در این مرورگر خصوصی می‌ماند.' }
  : { question: 'How are you today?', labels: ['Very hard', 'Not great', 'Okay', 'Good', 'Great'], trend: 'View trend', title: 'My mood and energy', energy: 'Today’s energy', energyLabels: ['Very low', 'Low', 'Medium', 'High', 'Very high'], week: '7 days', month: '30 days', history: 'My mood over time', empty: 'You haven’t checked in today.', noData: 'Check in to see your trend.', missing: 'Not recorded', community: 'Builders’ mood', soon: 'Coming soon', communityText: 'In the future, you can choose to contribute anonymously to community statistics.', support: 'You don’t have to solve everything today.', private: 'Your check-ins stay private in this browser.' };

