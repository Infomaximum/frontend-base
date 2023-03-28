import type { Interpolation } from "@emotion/react";
import type { TooltipPropsWithTitle } from "antd/lib/tooltip";

export interface IEllipsisTooltipProps extends Partial<TooltipPropsWithTitle> {
  customTextWrapperStyle?: Interpolation<TTheme>;
}
