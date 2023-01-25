import type { TableProps } from "antd";
import { isBoolean } from "lodash";
import type React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@im/utils";
import { useDelayedTrue } from "../../decorators/hooks/useDelayedTrue";

export interface IWithSpinPropsReplacer
  extends Pick<TableProps<unknown>, "loading"> {}

/**
 * Адаптирует компонент, принимающий индикатор загрузки типа Boolean под прием SpinProps.
 * На текущий момент поддерживаются свойства spinning и delay из SpinProps.
 */
export const withSpinPropsReplacer: TPropInjector<
  { loading: boolean },
  IWithSpinPropsReplacer
> = (Component) => {
  const SpinPropsReplacer = ({ loading, ...restProps }: any) => {
    const { spinning = Boolean(loading), delay = 0 } = isBoolean(loading)
      ? {}
      : loading;

    const delayedLoading = useDelayedTrue(spinning, delay);

    return <Component {...restProps} loading={delayedLoading} />;
  };

  return hoistNonReactStatics(SpinPropsReplacer, Component);
};
