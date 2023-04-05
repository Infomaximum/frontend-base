import type { Interpolation } from "@emotion/react";
import type React from "react";

export type THeaderMenuColumnConfig = {
  leftColWidth: number;
  rightColWidth: number;
  centerColWidth?: number;
  centerColPosition?: number;
};

export interface IHeaderMenuPortalProps {
  children: React.ReactNode;
  calculateColumnConfig?: (width: number) => THeaderMenuColumnConfig;
}

export interface IHeaderMenuPortalTitleProps {
  backUrl?: string;
  loading?: boolean;
  children?: React.ReactNode;
  customTitleStyle?: Interpolation<TTheme>;
}

export interface IHeaderMenuPortalBodyProps {
  align?: "left" | "right" | "center";
  children?: React.ReactNode;
}
