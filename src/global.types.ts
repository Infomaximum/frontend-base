/// <reference types="@emotion/react/types/css-prop" />

import type { theme } from "./styles/theme";

declare global {
  type TDictionary<T = any> = Record<string, T>;

  type valueof<T> = T[keyof T];

  type TNullable<T> = T | null | undefined;

  // eslint-disable-next-line im/naming-interfaces-and-types
  interface Window {
    activeRequests: number;
    isRejectionRequired: boolean;
  }

  type TTheme = typeof theme;
}

export {};
