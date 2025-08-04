import { Checkbox as AntCheckbox } from "antd";
import type { FC } from "react";
import type { ICheckboxProps, ICheckboxStaticComponent } from "./Checkbox.types";
import { checkboxInputStyle } from "./Checkbox.styles";

const CheckboxComponent: FC<ICheckboxProps> & ICheckboxStaticComponent = (props) => {
  const { "test-id": testId } = props;

  return (
    <span test-id={testId}>
      <AntCheckbox css={checkboxInputStyle} {...props} />
    </span>
  );
};

CheckboxComponent.Group = AntCheckbox.Group;

export const Checkbox = CheckboxComponent;
