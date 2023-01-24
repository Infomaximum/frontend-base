import { ThemeContext } from "@emotion/react";
import { useContext } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@im/utils";

export type TThemeValue = Record<string, unknown>;

export interface IWithThemeProps<T extends TThemeValue> {
  theme: T;
}

const withTheme: TPropInjector<IWithThemeProps<any>> = (Component: any) => {
  const WithTheme = (props: any) => (
    <Component {...props} theme={useContext(ThemeContext)} />
  );

  return hoistNonReactStatics(WithTheme, Component);
};

export default withTheme;
