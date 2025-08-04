import type { Interpolation } from "@emotion/react";
import type { CollapseProps } from "antd";

export interface ICollapseProps extends CollapseProps {
  collapseStyle?: Interpolation<TTheme>;
}
