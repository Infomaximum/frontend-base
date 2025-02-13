import { Spin } from "antd";
import { wrapperSpinnerStyle } from "./Spinner.styles";
import { wrapperSpinnerTestId } from "../../utils/TestIds";
import type { ISpinnerProps } from "./Spinner.types";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { loaderDelay } from "../../utils/const";

const SpinnerComponent: React.FC<ISpinnerProps> = ({
  labelLoc,
  size = "default",
  wrapperStyle = wrapperSpinnerStyle,
  delay = loaderDelay,
  ...rest
}) => {
  const localization = useLocalization();

  return (
    <div key="wrapper-spinner" test-id={wrapperSpinnerTestId} css={wrapperStyle}>
      <Spin
        size={size}
        tip={labelLoc && localization.getLocalized(labelLoc)}
        delay={delay}
        {...rest}
      />
    </div>
  );
};

export const Spinner = SpinnerComponent;
