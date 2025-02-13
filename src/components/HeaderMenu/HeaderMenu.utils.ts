import type { NCore } from "@infomaximum/module-expander";
import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import { filter, isFunction } from "lodash";
import type { Location } from "react-router";

export const filterChildrenRouts = (
  parentRoute: NCore.IRoutes | undefined,
  isFeatureEnabled: TFeatureEnabledChecker,
  location: Location
) => {
  const childRoutesFilter = parentRoute?.childRoutesFilter;

  return parentRoute?.routes && isFunction(childRoutesFilter)
    ? filter(parentRoute.routes, (innerRoute: NCore.IRoutes) => {
        return childRoutesFilter(innerRoute, isFeatureEnabled, location);
      })
    : parentRoute?.routes;
};
