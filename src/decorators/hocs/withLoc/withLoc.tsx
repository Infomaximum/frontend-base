import type { TPropInjector } from "@infomaximum/utility";
import { LocalizationContext } from "../../contexts/LocalizationContext";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { Localization } from "@infomaximum/localization";

export interface IWithLocProps {
  localization: Localization;
}

export const withLoc: TPropInjector<IWithLocProps> = (Component: any) => {
  const LocalizedComponent = (props: any) => (
    <LocalizationContext.Consumer>
      {(localization: Localization) => <Component {...props} localization={localization} />}
    </LocalizationContext.Consumer>
  );

  return hoistNonReactStatics(LocalizedComponent, Component);
};
