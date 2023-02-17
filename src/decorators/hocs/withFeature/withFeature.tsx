import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@im/utils";
import type { IWithFeatureProps } from "./withFeature.types";
import { useFeature } from "../../hooks/useFeature";

export const withFeature: TPropInjector<IWithFeatureProps> = (Component: any) => {
  const WithFeature = (props: any) => {
    const { isFeatureEnabled } = useFeature();

    return <Component {...props} isFeatureEnabled={isFeatureEnabled} />;
  };

  return hoistNonReactStatics(WithFeature, Component);
};
