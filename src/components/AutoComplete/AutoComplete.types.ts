import type { AutoCompleteProps } from "antd";

export interface IAutoCompleteProps
  extends Omit<
    AutoCompleteProps,
    "listHeight" | "dropdownAlign" | "placement"
  > {
  loading?: boolean;
}
