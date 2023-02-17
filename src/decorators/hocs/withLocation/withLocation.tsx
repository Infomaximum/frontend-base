import type { TPropInjector } from "@im/utils";
import hoistNonReactStatics from "hoist-non-react-statics";
import { useContext } from "react";
import { UNSAFE_NavigationContext, useLocation } from "react-router";
import type { IWithLocationProps } from "./withLocation.types";
import type { History } from "history";

export const withLocation: TPropInjector<IWithLocationProps> = (Component: any) => {
  const WithLocation = (props: any) => {
    const location = useLocation();
    const { navigator } = useContext(UNSAFE_NavigationContext);

    return (
      <Component
        {...props}
        location={location}
        listenLocationChange={(navigator as History).listen}
      />
    );
  };

  return hoistNonReactStatics(WithLocation, Component);
};
