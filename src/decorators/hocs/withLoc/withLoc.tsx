import type { TPropInjector } from "@infomaximum/utility";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { Localization } from "@infomaximum/localization";
import { useLocalization } from "../../hooks/useLocalization";

export interface IWithLocProps {
  localization: Localization;
}

export const withLoc: TPropInjector<IWithLocProps> = (Component: any) => {
  const LocalizedComponent = (props: any) => {
    const localization = useLocalization();

    return <Component {...props} localization={localization} />;
  };

  return hoistNonReactStatics(LocalizedComponent, Component);
};
