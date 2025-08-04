import type React from "react";
import type { NCore } from "../../libs/core";

export interface IRouterProviderProps {
  routesConfig: NCore.IRoute[];
  unInitializeRoutes: NCore.IRoute[];
  unAuthorizedRoutes: NCore.IRoute[];
  isSystemInitialized: boolean;
  isAuthorizedUser: boolean;
  layout: React.ElementType<{ children: React.ReactNode }>;
}
