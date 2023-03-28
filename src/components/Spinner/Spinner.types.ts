import type { SpinProps } from "antd/lib/spin";
import type { TLocalizationDescription } from "@infomaximum/localization";
import type { Interpolation } from "@emotion/react";

export interface ISpinnerProps extends SpinProps {
  labelLoc?: TLocalizationDescription;
  wrapperStyle?: Interpolation<TTheme>;
}
