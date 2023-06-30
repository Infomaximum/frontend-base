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
  type ReactElement,
  type FocusEventHandler,
  useCallback,
} from "react";
import {
  defaultInputStyle,
  disabledInputStyle,
  disabledTextAreaStyle,
  disabledPasswordInputStyle,
  defaultPasswordInputStyle,
  inputWrapperStyle,
  inputOverlayStyle,
  passwordOverlayStyle,
  resetAutocompleteChromeStyle,
} from "./Input.styles";
import type { IInputProps, IInputStaticComponents, ITextAreaProps } from "./Input.types";
import type { AutoSizeType } from "rc-textarea";
import type { InputRef, PasswordProps } from "antd/lib/input";
import { useTheme } from "../../decorators/hooks/useTheme";
import { useFocus } from "../../decorators";
import { isArray } from "lodash";

const InputComponent: FC<IInputProps & RefAttributes<InputRef>> = forwardRef(
  (props, ref: Ref<InputRef>) => {
    const theme = useTheme();
    const { isFocus, onFocus, onBlur } = useFocus();

    const hasSuffix = !!props.allowClear || !!props.suffix;
    const suffix = props?.suffix as ReactElement;

    const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        props.onFocus?.(event);
        onFocus();
      },
      [onFocus, props]
    );

    const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        props.onBlur?.(event);
        onBlur();
      },
      [onBlur, props]
    );

    const isSuffixArray = useMemo(() => {
      if (isArray(suffix?.props?.children)) {
        const filteredSuffix = suffix.props.children.filter((item: ReactElement) => item !== null);

        return filteredSuffix.length > 1;
      }
    }, [suffix?.props.children]);

    const rightOverlayOffset = hasSuffix
      ? isSuffixArray
        ? "52px" // отступ забледнения если справа у поля две иконки
        : props.disabled
        ? "27px" // отступ забледнения если справа одна иконка и нет рамки у поля
        : "28px" // отступ забледнения если справа одна иконка и есть рамка у поля
      : "8px";

    return (
      <div css={inputWrapperStyle}>
        <AntInput
          {...props}
          ref={ref}
          css={[
            props.disabled ? disabledInputStyle(theme) : defaultInputStyle(theme),
            props.autoComplete === "on" && !props.disabled && resetAutocompleteChromeStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!isFocus && <div css={[inputOverlayStyle(theme, props?.disabled, rightOverlayOffset)]} />}
      </div>
    );
  }
);

const InputPassword: ForwardRefExoticComponent<PasswordProps & RefAttributes<any>> = forwardRef(
  (props, ref: Ref<InputRef>) => {
    const theme = useTheme();
    const { isFocus, onFocus, onBlur } = useFocus();

    const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        props.onFocus?.(event);
        onFocus();
      },
      [onFocus, props]
    );

    const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        props.onBlur?.(event);
        onBlur();
      },
      [onBlur, props]
    );

    return (
      <div css={inputWrapperStyle}>
        <AntInput.Password
          {...props}
          ref={ref}
          css={props.disabled ? disabledPasswordInputStyle : defaultPasswordInputStyle(theme)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!isFocus && (
          <div css={[inputOverlayStyle(theme, props?.disabled), passwordOverlayStyle]} />
        )}
      </div>
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
