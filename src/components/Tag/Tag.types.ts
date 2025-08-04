import type { Interpolation } from "@emotion/react";
import type { TagProps } from "antd/lib/tag";

export interface ITagProps extends TagProps {
  isWithoutTooltipWrapper?: boolean;
  customTooltipWrapperStyle?: Interpolation<TTheme>;
}
