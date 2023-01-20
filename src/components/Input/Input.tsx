// eslint-disable-next-line im/ban-import-entity
import { Input as AntInput } from "antd";
import type { TextAreaRef } from "antd/lib/input/TextArea";
import { FC, ForwardRefExoticComponent, Ref, RefAttributes, useMemo, forwardRef } from "react";
import { defaultInputStyle, disabledInputStyle, disabledTextAreaStyle } from "./Input.styles";
import type { IInputProps, IInputStaticComponents, ITextAreaProps } from "./Input.types";
import type { AutoSizeType } from "rc-textarea";
import type { InputRef, PasswordProps } from "antd/lib/input";

const Input: FC<IInputProps & RefAttributes<InputRef>> = forwardRef((props, ref: Ref<InputRef>) => {
  return (
    <AntInput {...props} ref={ref} css={props.disabled ? disabledInputStyle : defaultInputStyle} />
  );
});

const InputPassword: ForwardRefExoticComponent<PasswordProps & RefAttributes<any>> = forwardRef(
  (props, ref: Ref<InputRef>) => {
    return (
      <AntInput.Password
        {...props}
        ref={ref}
        css={props.disabled ? disabledInputStyle : defaultInputStyle}
      />
    );
  }
);

const TextArea: ForwardRefExoticComponent<ITextAreaProps & RefAttributes<TextAreaRef>> = forwardRef(
  (props, ref: Ref<TextAreaRef>) => {
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
        css={props.disabled ? disabledTextAreaStyle : undefined}
      />
    );
  }
);
type TInput = typeof Input & IInputStaticComponents;

(Input as TInput).Group = AntInput.Group;
(Input as TInput).Password = InputPassword;
(Input as TInput).Search = AntInput.Search;
(Input as TInput).TextArea = TextArea;

const ExportInput: TInput = Input as TInput;

export default ExportInput;
