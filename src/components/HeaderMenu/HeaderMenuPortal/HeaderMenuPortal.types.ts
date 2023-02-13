import type { Interpolation } from "@emotion/react";
import type React from "react";

export interface IHeaderMenuPortalProps {
  children: React.ReactNode;
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
