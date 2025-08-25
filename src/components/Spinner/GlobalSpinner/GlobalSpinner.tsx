import { useState, type FC } from "react";
import type { IGlobalSpinnerProps } from "./GlobalSpinner.types";
import { useMountEffect } from "@infomaximum/base/src/decorators/hooks/useMountEffect";
import { loaderDelay, wrapperGlobalSpinnerTestId } from "@infomaximum/base/src/utils";
import { SpinnerTemplateSVG } from "@infomaximum/base/src/resources";
import {
  getSpinnerStyle,
  spinnerContainerStyle,
  wrapperGlobalSpinnerStyle,
} from "./GlobalSpinner.styles";

export const GlobalSpinner: FC<IGlobalSpinnerProps> = ({
  wrapperStyle = wrapperGlobalSpinnerStyle,
  delay = loaderDelay,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useMountEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
      clearTimeout(timeout);
    }, delay);
  });

  return (
    <div key="global-spinner" test-id={wrapperGlobalSpinnerTestId} css={wrapperStyle}>
      <div css={spinnerContainerStyle}>
        <div css={getSpinnerStyle(isVisible)}>
          <SpinnerTemplateSVG />
        </div>
      </div>
    </div>
  );
};
