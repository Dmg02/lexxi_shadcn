'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from 'lodash';

const cache = new Map();

export const useResource = <T,>(serviceFunction: (...args: any[]) => Promise<T>, ...params: any[]) => {
  const [state, setState] = useState<{ data: T | null; isLoading: boolean; error: Error | null }>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (params.some(param => param === undefined)) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const data = await serviceFunction(...params);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [serviceFunction, ...params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
};