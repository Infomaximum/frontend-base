// eslint-disable-next-line im/ban-import-entity
import { Input as AntInput } from "antd";
import type { TextAreaRef } from "antd/lib/input/TextArea";
import {
  type FC,
  type ForwardRefExoticComponent,
  type Ref,
  type RefAttributes,
  useMemo,
  forwardRef,
} from "react";
import {
  defaultInputStyle,
  disabledInputStyle,
  disabledTextAreaStyle,
  disabledPasswordInputStyle,
  defaultPasswordInputStyle,
} from "./Input.styles";
import type { IInputProps, IInputStaticComponents, ITextAreaProps } from "./Input.types";
import type { AutoSizeType } from "rc-textarea";
import type { InputRef, PasswordProps } from "antd/lib/input";
import { useTheme } from "../../decorators/hooks/useTheme";

const InputComponent: FC<IInputProps & RefAttributes<InputRef>> = forwardRef(
  (props, ref: Ref<InputRef>) => {
    const theme = useTheme();

    return (
      <AntInput
        {...props}
        ref={ref}
        css={props.disabled ? disabledInputStyle : defaultInputStyle(theme)}
      />
    );
  }
);

const InputPassword: ForwardRefExoticComponent<PasswordProps & RefAttributes<any>> = forwardRef(
  (props, ref: Ref<InputRef>) => {
    const theme = useTheme();
    return (
      <AntInput.Password
        {...props}
        ref={ref}
        css={props.disabled ? disabledPasswordInputStyle : defaultPasswordInputStyle(theme)}
      />
    );
  }
);

const TextArea: ForwardRefExoticComponent<ITextAreaProps & RefAttributes<TextAreaRef>> = forwardRef(
  (props, ref: Ref<TextAreaRef>) => {
    const theme = useTheme();

    const autoSize = useMemo<AutoSizeType>(
      () => ({
        minRows: 3,
        maxRows: 5,
      }),
      []
    );

    return (
      <AntInput.TextArea
        autoSize={autoSize} // системное поведение по умолчанию
        {...props}
        ref={ref}
        css={props.disabled ? disabledTextAreaStyle(theme) : undefined}
      />
    );
  }
);
type TInput = typeof InputComponent & IInputStaticComponents;

(InputComponent as TInput).Group = AntInput.Group;
(InputComponent as TInput).Password = InputPassword;
(InputComponent as TInput).Search = AntInput.Search;
(InputComponent as TInput).TextArea = TextArea;

export const Input = InputComponent as TInput;
