import { FC, useMemo } from "react";
import {
  getRoutes,
  resolveConstraintsInRoutes,
  routesMap,
  sortPriority,
} from "../../utils/Routes/routes";
import type { NCore } from "@im/core";
import type { IRouterProviderProps } from "./RouterProvider.types";
import { observer } from "mobx-react";
import { useRoutes } from "react-router";
import { RoutesContext } from "../../decorators/contexts/RoutesContext";
import { useFeature } from "../../decorators/hooks/useFeature";

const RouterProvider: FC<IRouterProviderProps> = ({
  layout: LayoutProps,
  isAuthorizedUser,
  isSystemInitialized,
  routesConfig,
  unAuthorizedRoutes,
  unInitializeRoutes,
}) => {
  const { isFeatureEnabled } = useFeature();

  const resolvedRoutes = useMemo(() => {
    return isFeatureEnabled
      ? getRoutes(
          sortPriority(
            resolveConstraintsInRoutes(routesConfig, isFeatureEnabled)
          )
        )
      : null;
  }, [routesConfig, isFeatureEnabled]);

  let routesForRender: NCore.IRoutes[] = [];

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
        <LayoutProps>{renderedRoutes}</LayoutProps>
      </RoutesContext.Provider>
    );
  }

  return renderedRoutes;
};

export default observer(RouterProvider);
