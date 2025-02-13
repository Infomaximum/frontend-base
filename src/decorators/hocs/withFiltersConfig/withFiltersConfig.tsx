import type { TPropInjector } from "@infomaximum/utility";
import hoistNonReactStatics from "hoist-non-react-statics";
import { useFiltersConfig } from "../../hooks";
import type { IFiltersContext } from "../../contexts/FiltersContext";

export interface IWithFiltersConfig extends IFiltersContext {}

export const withFiltersConfig: TPropInjector<IWithFiltersConfig> = (Component: any) => {
  const WithFiltersConfig = (props: any) => {
    const filtersConfig = useFiltersConfig();

    return <Component {...props} {...filtersConfig} />;
  };

  return hoistNonReactStatics(WithFiltersConfig, Component);
};
