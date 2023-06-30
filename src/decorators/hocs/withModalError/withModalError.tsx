import { useEffect } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@infomaximum/utility";
import type { IWithModalAdditionalProps, IWithModalErrorProps } from "./withModalError.types";
import { observer } from "mobx-react";
import { useModalError } from "../../hooks/useModalError";

export const withModalError: TPropInjector<IWithModalErrorProps, IWithModalAdditionalProps> = (
  Component: any
) => {
  const WithModalError = observer((props: IWithModalAdditionalProps) => {
    const { showModalError } = useModalError();

    useEffect(() => {
      if (props.error) {
        showModalError(props.error);
      }
      return () => {
        showModalError(undefined);
      };
    }, [props.error, showModalError]);

    return <Component {...props} showModalError={showModalError} />;
  });

  return hoistNonReactStatics(WithModalError, Component) as any;
};
