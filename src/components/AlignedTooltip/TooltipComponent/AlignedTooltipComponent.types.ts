import type { TooltipPropsWithTitle } from "antd/lib/tooltip";

export interface IAlignedTooltipComponentProps {
  title?: TooltipPropsWithTitle["title"];
  offsetY?: number;
  visible?: boolean;
  removeMouseEnterDelay?: boolean;
  offsetX?: number;
  containerRef: React.RefObject<HTMLDivElement>;
}
