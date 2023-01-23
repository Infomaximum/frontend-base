import type { Interpolation } from "@emotion/react";
import type { CollapseProps } from "antd";
import type { IPanelProps } from "src/components/Panel/Panel.types";

export interface ICollapseProps extends CollapseProps {
  collapseStyle?: Interpolation<TTheme>;
  expandIcon?: (panelProps: IPanelProps) => React.ReactNode;
}
