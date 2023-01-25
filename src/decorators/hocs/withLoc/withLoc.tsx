import type { TPropInjector } from "@im/utils/";
import LocalizationContext from "../../contexts/LocalizationContext";
import type { Localization } from "@im/utils";
import hoistNonReactStatics from "hoist-non-react-statics";

export interface IWithLocProps {
  localization: Localization;
}

const withLoc: TPropInjector<IWithLocProps> = (Component: any) => {
  const LocalizedComponent = (props: any) => (
    <LocalizationContext.Consumer>
      {(localization: Localization) => (
        <Component {...props} localization={localization} />
      )}
    </LocalizationContext.Consumer>
  );

  return hoistNonReactStatics(LocalizedComponent, Component);
};

export default withLoc;
