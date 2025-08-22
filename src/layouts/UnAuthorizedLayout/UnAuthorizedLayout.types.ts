import type React from "react";
import type { Interpolation } from "@emotion/react";

import type { IWithThemeProps } from "@infomaximum/base/src/decorators/hocs/withTheme/withTheme";
import type { IWithSystemTitleProps } from "@infomaximum/base/src/decorators/hocs/withSystemTitle/withSystemTitle.types";
import type { IWithLocProps } from "@infomaximum/base/src/decorators/hocs/withLoc/withLoc";
import type { TLocalizationDescription } from "@infomaximum/localization";
import type { NCore } from "@infomaximum/base/src/libs/core";

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

  route: NCore.IRoute;

  productNameLoc?: TLocalizationDescription;
  /** Логотип который отображается над формой */
  companyLogo?: React.ReactNode;
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
