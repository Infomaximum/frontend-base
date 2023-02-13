import type { NCore } from "@im/core";
import type React from "react";

export interface IRouterProviderProps {
  routesConfig: NCore.IRoutes[];
  unInitializeRoutes: NCore.IRoutes[];
  unAuthorizedRoutes: NCore.IRoutes[];
  isSystemInitialized: boolean;
  isAuthorizedUser: boolean;
  layout: React.ElementType<{ children: React.ReactNode }>;
}
