import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import { filter, isFunction } from "lodash";
import type { Location } from "react-router";
import type { NCore } from "@infomaximum/base/src/libs/core";

export const filterChildrenRouts = (
  parentRoute: NCore.IRoute | undefined,
  isFeatureEnabled: TFeatureEnabledChecker,
  location: Location
) => {
  const childRoutesFilter = parentRoute?.childRoutesFilter;

  return parentRoute?.routes && isFunction(childRoutesFilter)
    ? filter(parentRoute.routes, (innerRoute: NCore.IRoute) => {
        return childRoutesFilter(innerRoute, isFeatureEnabled, location);
      })
    : parentRoute?.routes;
};
