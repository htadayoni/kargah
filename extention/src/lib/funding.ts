import { storage } from './storage';

export type FundingType = 'accelerator' | 'grant' | 'investment';
export type FundingStage = 'idea' | 'mvp' | 'growth';
export interface FundingOpportunity {
  status: 'open' | 'closed' | 'unknown'; id: string; name: string; nameFa: string; type: FundingType; stage: FundingStage; region: 'global' | 'europe';
  amount: string; deadline: string | null; description: string; descriptionFa: string; source: string; verifiedAt: string | null;
}
export interface FundingCache { version: 1; fetchedAt: number; items: FundingOpportunity[] }
export interface FundingResult { cache: FundingCache; stale: boolean }
export const FUNDING_TTL = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'kargah:funding:mock:v2';

// Deliberately isolated from any future live endpoint or live cache.
export async function mockFundingSource(): Promise<FundingOpportunity[]> {
  const deadline = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
  return [
    { status: 'open', id: 'mock-accelerator', name: 'Nova Accelerator', nameFa: 'شتاب‌دهنده نووا', type: 'accelerator', stage: 'mvp', region: 'global', amount: '€50,000', deadline: deadline(12), description: 'A sample accelerator for early-stage digital products.', descriptionFa: 'برنامه آزمایشی برای محصولات دیجیتال در مراحل اولیه.', source: 'Sample source', verifiedAt: null },
    { status: 'open', id: 'mock-grant', name: 'Future Builders Grant', nameFa: 'گرنت سازندگان آینده', type: 'grant', stage: 'idea', region: 'europe', amount: '€25,000', deadline: deadline(25), description: 'A sample grant for new ideas in Europe.', descriptionFa: 'گرنت آزمایشی برای ایده‌های نو در اروپا.', source: 'Sample source', verifiedAt: null },
    { status: 'open', id: 'mock-investment', name: 'Horizon Seed Program', nameFa: 'برنامه سرمایه‌گذاری هورایزن', type: 'investment', stage: 'growth', region: 'global', amount: '€150,000', deadline: null, description: 'A sample investment program for growing teams.', descriptionFa: 'برنامه سرمایه‌گذاری آزمایشی برای تیم‌های در حال رشد.', source: 'Sample source', verifiedAt: null },
  ];
}
/** Returns cached data for 24h after a successful refresh. Failed refreshes retain stale data. */
export async function getMockFunding(source: () => Promise<FundingOpportunity[]> = mockFundingSource, now = Date.now()): Promise<FundingResult> {
  const load = async (): Promise<FundingResult> => {
    const saved = await storage.get<FundingCache>(CACHE_KEY);
    const valid = saved?.version === 1 && Array.isArray(saved.items) && Number.isFinite(saved.fetchedAt) ? saved : undefined;
    if (valid && now >= valid.fetchedAt && now - valid.fetchedAt < FUNDING_TTL) return { cache: valid, stale: false };
    try {
      const items = await source();
      if (!Array.isArray(items)) throw new Error('Invalid funding response');
      const cache: FundingCache = { version: 1, fetchedAt: now, items };
      await storage.set(CACHE_KEY, cache);
      return { cache, stale: false };
    } catch (error) {
      if (valid) return { cache: valid, stale: true };
      throw error;
    }
  };
  if (!navigator.locks) throw new Error('Web Locks unavailable');
  return navigator.locks.request('kargah:funding:mock', load);
}
