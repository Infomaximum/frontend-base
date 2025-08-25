import type { TPropInjector } from "@infomaximum/utility";
import hoistNonReactStatics from "hoist-non-react-statics";
import { useFiltersConfig } from "@infomaximum/base/src/decorators/hooks/useFiltersConfig";
import type { IFiltersContext } from "@infomaximum/base/src/decorators/contexts/FiltersContext";

export interface IWithFiltersConfig extends IFiltersContext {}

export const withFiltersConfig: TPropInjector<IWithFiltersConfig> = (Component: any) => {
  const WithFiltersConfig = (props: any) => {
    const filtersConfig = useFiltersConfig();

    return <Component {...props} {...filtersConfig} />;
  };

  return hoistNonReactStatics(WithFiltersConfig, Component);
};
