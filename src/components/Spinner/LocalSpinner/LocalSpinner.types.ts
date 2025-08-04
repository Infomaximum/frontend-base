import type { Interpolation } from "@emotion/react";
import type { SpinProps } from "antd";

export interface ILocalSpinnerProps extends Pick<SpinProps, "size" | "delay"> {
  wrapperStyle?: Interpolation<TTheme>;
  fullContainerSize?: boolean;
  spinIndicatorStyle?: Interpolation<TTheme>;
}
