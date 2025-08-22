import type { Interpolation } from "@emotion/react";
import type { TagProps, Tag } from "@infomaximum/ui-kit";

export interface ITagProps extends TagProps {
  isWithoutTooltipWrapper?: boolean;
  customTooltipWrapperStyle?: Interpolation<TTheme>;
}

export interface ICheckable {
  Checkable: typeof Tag.Checkable;
}
