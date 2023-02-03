import type React from "react";
import type { Interpolation } from "@emotion/react";
import type { NCore } from "@im/core";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";
import type { IWithSystemTitleProps } from "../../decorators/hocs/withSystemTitle/withSystemTitle.types";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { TLocalizationDescription } from "@im/localization";

export interface IUnAuthorizedLayoutProps
  extends IWithThemeProps<TTheme>,
    IWithSystemTitleProps,
    IWithLocProps {
  children: React.ReactNode;
  isAnimation?: boolean;
  error?: any;
  backUrl?: string;
  title?: string;
  topPanel?: React.ReactNode;
  bodyStyle?: Interpolation<TTheme>;
  wrapperStyle?: Interpolation<TTheme>;

  route: NCore.IRoutes;

  productNameLoc?: TLocalizationDescription;
}

export interface IUnAuthorizedLayoutState {
  /**
   * отображать ли анимацию
   */
  showAnimate: boolean;
  error?: any;
}

export interface IUnAuthorizedLayoutDefaultProps {
  bodyStyle?: Interpolation<TTheme>;
}
