import { useEffect } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@im/utils";

import type {
  IWithModalAdditionalProps,
  IWithModalErrorProps,
} from "./withModalError.types";
import { observer } from "mobx-react";
import { useModalError } from "src/decorators/hooks/useModalError";

const withModalError: TPropInjector<
  IWithModalErrorProps,
  IWithModalAdditionalProps
> = (Component: any) => {
  const WithModalError = observer((props: IWithModalAdditionalProps) => {
    const { showModalError } = useModalError();

    useEffect(() => {
      if (props.error) {
        showModalError(props.error);
      }
    }, [props.error, showModalError]);

    return <Component {...props} showModalError={showModalError} />;
  });

  return hoistNonReactStatics(WithModalError, Component) as any;
};

export default withModalError;
