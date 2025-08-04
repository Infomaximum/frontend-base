import { useState, type FC } from "react";
import type { IGlobalSpinnerProps } from "./GlobalSpinner.types";
import { useMountEffect } from "../../../decorators";
import { loaderDelay, wrapperGlobalSpinnerTestId } from "../../../utils";
import { SpinnerTemplateSVG } from "../../../resources";
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
