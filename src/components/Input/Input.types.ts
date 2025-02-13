// eslint-disable-next-line im/ban-import-entity
import type { Input } from "antd";
import type { Interpolation } from "@emotion/react";
import type { InputProps, TextAreaProps } from "antd/lib/input";
import type { ReactNode } from "react";

export interface IInputProps extends InputProps {
  overlayOffset?: number;
  clearIcon?: ReactNode;
  isSecond?: boolean;
  wrapperStyle?: Interpolation<TTheme>;
  hideTooltip?: boolean;
}

export interface ITextAreaProps extends TextAreaProps {
  minRows?: number;
}

export interface IInputStaticComponents {
  Group: typeof Input.Group;
  Password: typeof Input.Password;
  Search: typeof Input.Search;
  TextArea: typeof Input.TextArea;
}
