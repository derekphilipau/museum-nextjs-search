'use client';

import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';

interface myCallbackType {
  (myArgument?: string): void;
}

export const useDebounce = (callback: myCallbackType) => {
  const ref = useRef<myCallbackType | undefined>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };
    return debounce(func, 600);
  }, []);

  return debouncedCallback;
};
