/// <reference types="@emotion/react/types/css-prop" />

import type { theme } from "./styles/theme";

declare global {
  // eslint-disable-next-line im/naming-interfaces-and-types
  interface Window {
    activeRequests: number;
    isRejectionRequired: boolean;
  }

  type TTheme = typeof theme;
}

export {};
