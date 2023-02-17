import { Checkbox as AntCheckbox } from "antd";
import type { FC } from "react";
import type { ICheckboxProps, ICheckboxStaticComponent } from "./Checkbox.types";

const CheckboxComponent: FC<ICheckboxProps> & ICheckboxStaticComponent = (props) => {
  const { "test-id": testId } = props;

  return (
    <span test-id={testId}>
      <AntCheckbox {...props} />
    </span>
  );
};

CheckboxComponent.Group = AntCheckbox.Group;

export const Checkbox = CheckboxComponent;
