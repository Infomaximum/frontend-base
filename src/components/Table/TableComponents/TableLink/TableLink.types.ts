import type { Interpolation } from "@emotion/react";
import type { LinkProps } from "react-router-dom";

export interface ITableLinkProps extends LinkProps {
  customTooltipWrapperStyle?: Interpolation;
}
