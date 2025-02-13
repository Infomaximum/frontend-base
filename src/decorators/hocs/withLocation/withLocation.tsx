import type { TPropInjector } from "@infomaximum/utility";
import hoistNonReactStatics from "hoist-non-react-statics";
import { useLocation } from "react-router";
import type { IWithLocationProps } from "./withLocation.types";
import { historyStore } from "../../../store";

export const withLocation: TPropInjector<IWithLocationProps> = (Component: any) => {
  const WithLocation = (props: any) => {
    const location = useLocation();

    return (
      <Component
        {...props}
        location={location}
        listenLocationChange={historyStore.listenLocationChange}
      />
    );
  };

  return hoistNonReactStatics(WithLocation, Component);
};
