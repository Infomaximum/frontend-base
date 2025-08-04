import { type FC, useMemo } from "react";
import {
  getRoutes,
  resolveConstraintsInRoutes,
  routesMap,
  sortPriority,
} from "../../utils/Routes/routes";

import type { IRouterProviderProps } from "./RouterProvider.types";
import { observer } from "mobx-react";
import { useLocation, useRoutes } from "react-router";
import { RoutesContext } from "../../decorators/contexts/RoutesContext";
import { useFeature } from "../../decorators/hooks/useFeature";
import { SystemLoaderProvider } from "../SystemLoaderProvider";
import type { NCore } from "../../libs/core";

const RouterProviderComponent: FC<IRouterProviderProps> = ({
  layout: LayoutProps,
  isAuthorizedUser,
  isSystemInitialized,
  routesConfig,
  unAuthorizedRoutes,
  unInitializeRoutes,
}) => {
  const { isFeatureEnabled } = useFeature();
  const location = useLocation();

  const resolvedRoutes = useMemo(() => {
    return isFeatureEnabled
      ? getRoutes(
          sortPriority(resolveConstraintsInRoutes(routesConfig, isFeatureEnabled, location))
        )
      : null;
  }, [routesConfig, isFeatureEnabled, location]);

  let routesForRender: NCore.IRoute[] = [];

  if (!isSystemInitialized) {
    routesForRender = routesMap(sortPriority(unInitializeRoutes));
  } else if (!isAuthorizedUser) {
    routesForRender = routesMap(sortPriority(unAuthorizedRoutes));
  } else if (resolvedRoutes) {
    routesForRender = resolvedRoutes;
  }

  const renderedRoutes = useRoutes(routesForRender);

  if (isAuthorizedUser && resolvedRoutes) {
    return (
      <RoutesContext.Provider value={resolvedRoutes}>
        <LayoutProps>
          <SystemLoaderProvider>{renderedRoutes}</SystemLoaderProvider>
        </LayoutProps>
      </RoutesContext.Provider>
    );
  }

  return renderedRoutes;
};

export const RouterProvider = observer(RouterProviderComponent);
