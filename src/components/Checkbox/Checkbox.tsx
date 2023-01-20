import { Checkbox as AntCheckbox } from "antd";
import type { FC } from "react";
import type { ICheckboxProps, ICheckboxStaticComponent } from "./Checkbox.types";

const Checkbox: FC<ICheckboxProps> & ICheckboxStaticComponent = (props) => {
  const { "test-id": testId } = props;

  return (
    <span test-id={testId}>
      <AntCheckbox {...props} />
    </span>
  );
};

Checkbox.Group = AntCheckbox.Group;

export default Checkbox;
