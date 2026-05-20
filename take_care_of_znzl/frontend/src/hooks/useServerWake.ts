import { useState, useCallback } from 'react';
import { wakeServer } from '@/api/health';

export function useServerWake() {
  const [isWaking, setIsWaking] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const wake = useCallback(async () => {
    setIsWaking(true);
    const ok = await wakeServer();
    setIsWaking(false);
    setIsReady(ok);
    return ok;
  }, []);

  return { isWaking, isReady, wake };
}
