import { useEffect, useState } from 'react';
import { getMockFunding, type FundingResult } from '@/lib/funding';
import { useMockFeatures } from '@/lib/featureFlags';
export function useFunding() {
  const [enabled] = useMockFeatures();
  const [result, setResult] = useState<FundingResult | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; if (!enabled) { setResult(null); return; } setError(false); getMockFunding().then(value => { if (active) setResult(value); }).catch(() => { if (active) setError(true); }); return () => { active = false; }; }, [enabled]);
  return { enabled, result, error };
}
