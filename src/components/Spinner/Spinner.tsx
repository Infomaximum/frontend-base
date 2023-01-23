import { Spin } from "antd";
import { wrapperSpinnerStyle } from "./Spinner.styles";
import { wrapperSpinnerTestId } from "src/utils/TestIds";
import type { ISpinnerProps } from "./Spinner.types";
import { useLocalization } from "src/decorators/hooks/useLocalization";
import { loaderDelay } from "src/utils/const";

const Spinner: React.FC<ISpinnerProps> = ({
  labelLoc,
  size,
  wrapperStyle,
  ...rest
}) => {
  const localization = useLocalization();

  return (
    <div
      key="wrapper-spinner"
      test-id={wrapperSpinnerTestId}
      css={wrapperStyle}
    >
      <Spin
        size={size}
        tip={labelLoc && localization.getLocalized(labelLoc)}
        {...rest}
      />
    </div>
  );
};

Spinner.defaultProps = {
  wrapperStyle: wrapperSpinnerStyle,
  size: "default",
  delay: loaderDelay,
};

export default Spinner;
