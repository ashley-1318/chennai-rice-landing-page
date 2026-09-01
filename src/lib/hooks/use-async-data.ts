"use client";

import { useEffect, useReducer, useCallback } from "react";

interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

type Action<T> =
  | { type: "start" }
  | { type: "success"; data: T }
  | { type: "error"; error: string };

function reducer<T>(
  state: { data: T | null; isLoading: boolean; error: string | null },
  action: Action<T>
) {
  switch (action.type) {
    case "start":
      return { data: state.data, isLoading: true, error: null };
    case "success":
      return { data: action.data, isLoading: false, error: null };
    case "error":
      return { data: null, isLoading: false, error: action.error };
  }
}

export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]): AsyncDataState<T> {
  const [state, dispatch] = useReducer(reducer<T>, { data: null, isLoading: true, error: null });
  const [reloadToken, bumpReloadToken] = useReducer((t: number) => t + 1, 0);

  useEffect(() => {
    let active = true;
    dispatch({ type: "start" });

    fetcher()
      .then((result) => {
        if (active) dispatch({ type: "success", data: result });
      })
      .catch((err) => {
        if (active) dispatch({ type: "error", error: err instanceof Error ? err.message : "Something went wrong." });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const reload = useCallback(() => bumpReloadToken(), []);

  return { ...state, reload };
}
