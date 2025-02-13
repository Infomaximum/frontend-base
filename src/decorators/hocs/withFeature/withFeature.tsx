import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@infomaximum/utility";
import type { IWithFeatureProps } from "./withFeature.types";
import { useFeature } from "../../hooks/useFeature";

export const withFeature: TPropInjector<IWithFeatureProps> = (Component: any) => {
  const WithFeature = (props: any) => {
    const { isFeatureEnabled, isLicenseFeatureEnabled } = useFeature();

    return (
      <Component
        {...props}
        isFeatureEnabled={isFeatureEnabled}
        isLicenseFeatureEnabled={isLicenseFeatureEnabled}
      />
    );
  };

  return hoistNonReactStatics(WithFeature, Component);
};
