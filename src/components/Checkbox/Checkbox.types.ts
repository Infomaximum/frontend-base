import type { Checkbox } from "antd";
import type { CheckboxProps } from "antd/lib/checkbox";

export interface ICheckboxProps extends CheckboxProps {
  "test-id"?: string;
}

export interface ICheckboxStaticComponent {
  Group: typeof Checkbox.Group;
}
