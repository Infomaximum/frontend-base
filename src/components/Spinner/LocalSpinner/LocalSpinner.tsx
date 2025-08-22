import type { FC } from "react";
import type { ILocalSpinnerProps } from "./LocalSpinner.types";
import { Spin } from "antd";
import {
  fullContainerStyle,
  localSpinnerWrapperStyle,
  spinnerIndicatorDefaultStyle,
} from "./LocalSpinner.styles";
import { loaderDelay, wrapperLocalSpinnerTestId } from "@infomaximum/base/src/utils";
import { ArcOutlined } from "@infomaximum/base/src/components/Icons";

export const LocalSpinner: FC<ILocalSpinnerProps> = ({
  wrapperStyle = localSpinnerWrapperStyle,
  delay = loaderDelay,
  size = "default",
  fullContainerSize,
  spinIndicatorStyle = spinnerIndicatorDefaultStyle,
}) => {
  return (
    <div
      key="local-spinner"
      test-id={wrapperLocalSpinnerTestId}
      css={[wrapperStyle, fullContainerSize && fullContainerStyle]}
    >
      <Spin
        delay={delay}
        size={size}
        indicator={<ArcOutlined spin={true} css={spinIndicatorStyle} />}
      />
    </div>
  );
};
