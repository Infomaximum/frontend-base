import { Spin } from "antd";
import { wrapperSpinnerStyle } from "./Spinner.styles";
import { wrapperSpinnerTestId } from "../../utils/TestIds";
import type { ISpinnerProps } from "./Spinner.types";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { loaderDelay } from "../../utils/const";

const SpinnerComponent: React.FC<ISpinnerProps> = ({ labelLoc, size, wrapperStyle, ...rest }) => {
  const localization = useLocalization();

  return (
    <div key="wrapper-spinner" test-id={wrapperSpinnerTestId} css={wrapperStyle}>
      <Spin size={size} tip={labelLoc && localization.getLocalized(labelLoc)} {...rest} />
    </div>
  );
};

SpinnerComponent.defaultProps = {
  wrapperStyle: wrapperSpinnerStyle,
  size: "default",
  delay: loaderDelay,
};

export const Spinner = SpinnerComponent;
