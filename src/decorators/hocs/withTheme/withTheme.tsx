import { type Context, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@im/utils";

export type TThemeValue = Record<string, unknown>;

export interface IWithThemeProps<T extends TThemeValue> {
  theme: T;
}

export const withTheme: TPropInjector<IWithThemeProps<any>> = (Component: any) => {
  const WithTheme = (props: any) => (
    <Component {...props} theme={useContext(ThemeContext as unknown as Context<TTheme>)} />
  );

  return hoistNonReactStatics(WithTheme, Component);
};
