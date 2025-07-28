import { useState, useCallback, useRef } from 'react';
import { ApiError } from '../services/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  retryCount?: number;
  retryDelay?: number;
  immediate?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
    immediate = false,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
    retryCountRef.current = 0;
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      success: true,
    }));
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Cancel previous request if it's still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const result = await apiFunction(...args);
        
        setState({
          data: result,
          loading: false,
          error: null,
          success: true,
        });

        onSuccess?.(result);
        retryCountRef.current = 0;
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        
        // Check if request was aborted
        if (apiError.message === 'AbortError' || apiError.code === 'ABORTED') {
          return null;
        }

        // Retry logic
        if (retryCountRef.current < retryCount && apiError.status >= 500) {
          retryCountRef.current++;
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          
          // Retry the request
          return execute(...args);
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: apiError,
          success: false,
        }));

        onError?.(apiError);
        retryCountRef.current = 0;
        throw apiError;
      }
    },
    [apiFunction, onSuccess, onError, retryCount, retryDelay]
  );

  // Execute immediately if requested
  if (immediate && !state.loading && !state.data && !state.error) {
    execute();
  }

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

// Specialized hooks for common API patterns
export function useGet<T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi(apiFunction, options);
}

export function usePost<T = any, D = any>(
  apiFunction: (data: D) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi(apiFunction, options);
}

export function usePut<T = any, D = any>(
  apiFunction: (data: D) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi(apiFunction, options);
}

export function useDelete<T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi(apiFunction, options);
}

// Hook for handling multiple API calls
export function useMultipleApi<T extends Record<string, any>>(
  apiFunctions: T
): {
  [K in keyof T]: UseApiReturn<Awaited<ReturnType<T[K]>>>;
} {
  const result: any = {};

  for (const [key, apiFunction] of Object.entries(apiFunctions)) {
    result[key] = useApi(apiFunction);
  }

  return result;
}

// Hook for optimistic updates
export function useOptimisticApi<T = any, D = any>(
  apiFunction: (data: D) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> & {
  optimisticUpdate: (data: D, optimisticData: T) => Promise<T | null>;
} {
  const api = useApi(apiFunction, options);

  const optimisticUpdate = useCallback(
    async (data: D, optimisticData: T): Promise<T | null> => {
      // Set optimistic data immediately
      api.setData(optimisticData);

      try {
        // Execute the actual API call
        const result = await api.execute(data);
        return result;
      } catch (error) {
        // Revert optimistic data on error
        api.reset();
        throw error;
      }
    },
    [api]
  );

  return {
    ...api,
    optimisticUpdate,
  };
} 