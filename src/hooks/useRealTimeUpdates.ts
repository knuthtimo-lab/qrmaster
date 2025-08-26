import { useState, useEffect, useCallback } from 'react';

interface UseRealTimeUpdatesOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useRealTimeUpdates<T>(
  fetchFunction: () => Promise<T>,
  options: UseRealTimeUpdatesOptions = {}
) {
  const { interval = 30000, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();

    if (!enabled) return;

    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, enabled]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Specific hooks for different data types
export function useQRCodeUpdates(enabled = true) {
  return useRealTimeUpdates(
    async () => {
      const response = await fetch('/api/qrs');
      if (!response.ok) throw new Error('Failed to fetch QR codes');
      return response.json();
    },
    { interval: 15000, enabled }
  );
}

export function useAnalyticsUpdates(enabled = true) {
  return useRealTimeUpdates(
    async () => {
      const response = await fetch('/api/analytics/summary');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    { interval: 30000, enabled }
  );
}
