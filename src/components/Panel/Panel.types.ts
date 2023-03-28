import type { Interpolation } from "@emotion/react";
import type { CollapsibleType } from "antd/lib/collapse/CollapsePanel";

export interface IPanelProps {
  panelStyle?: Interpolation<TTheme>;
  key: string | number;
  isActive?: boolean;
  header: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  disabled?: boolean;
  extra?: React.ReactNode;
  collapsible?: CollapsibleType;
  testId?: string;
  children: React.ReactNode;
}
