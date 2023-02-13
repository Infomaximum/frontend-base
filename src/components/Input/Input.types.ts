// eslint-disable-next-line im/ban-import-entity
import type { Input } from "antd";
import type { InputProps, TextAreaProps } from "antd/lib/input";

export interface IInputProps extends InputProps {}
export interface ITextAreaProps extends TextAreaProps {}

export interface IInputStaticComponents {
  Group: typeof Input.Group;
  Password: typeof Input.Password;
  Search: typeof Input.Search;
  TextArea: typeof Input.TextArea;
}
