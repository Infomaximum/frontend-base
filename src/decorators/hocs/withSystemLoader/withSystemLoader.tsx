import type { TPropInjector } from "@infomaximum/utility";
import { useCallback, useState } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import { useSystemLoaderControl } from "@infomaximum/base/src/decorators/hooks/useSystemLoaderControl";

export interface IWithSystemLoaderProps {
  hideSystemLoader: () => void;
  isVisibleSystemLoader: boolean;
}

export const withSystemLoader: TPropInjector<IWithSystemLoaderProps> = (Component: any) => {
  const WithLoaderComponent = (props: any) => {
    const [isLoadingContainer, setLoadingContainer] = useState(true);

    useSystemLoaderControl(isLoadingContainer);

    const hideSystemLoader = useCallback(() => {
      setLoadingContainer(false);
    }, []);

    return (
      <Component
        {...props}
        hideSystemLoader={hideSystemLoader}
        isVisibleSystemLoader={isLoadingContainer}
      />
    );
  };

  return hoistNonReactStatics(WithLoaderComponent, Component);
};
