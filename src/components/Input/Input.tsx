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
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  getDefaultInputStyle,
  getDisabledInputStyle,
  disabledTextAreaStyle,
  disabledPasswordInputStyle,
  defaultPasswordInputStyle,
  secondInputStyle,
} from "./Input.styles";
import type { IInputProps, IInputStaticComponents, ITextAreaProps } from "./Input.types";
import type { AutoSizeType } from "rc-textarea";
import type { InputRef, PasswordProps } from "antd/lib/input";
import { useTheme } from "../../decorators/hooks/useTheme";
import { isString } from "lodash";
import { getTextWidth } from "../../utils/textWidth";
import { AlignedTooltip } from "../AlignedTooltip";

const InputComponent: FC<IInputProps & RefAttributes<InputRef>> = forwardRef(
  (props, ref: Ref<InputRef>) => {
    const theme = useTheme();
    const {
      clearIcon,
      isSecond,
      value,
      allowClear: allowClearProp,
      wrapperStyle,
      hideTooltip,
      ...rest
    } = props;
    const allowClear = clearIcon && allowClearProp ? { clearIcon } : allowClearProp;
    const [isOverflow, setIsOverflow] = useState(false);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    const tooltipTitle = useMemo(
      () => (rest.type !== "password" && !hideTooltip && isOverflow && String(value)) || null,
      [hideTooltip, isOverflow, rest.type, value]
    );

    const [isTooltipHidden, setIsTooltipHidden] = useState(true);
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

    useEffect(() => {
      if (inputWrapperRef.current) {
        const textWidth = isString(value) ? getTextWidth(value, { size: theme.h4FontSize }) : 0;
        setIsOverflow(textWidth > inputWrapperRef.current.clientWidth);
      }
    }, [theme, value]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (!isTooltipHidden && !!tooltipTitle) {
          setIsTooltipVisible(true);
        }
      }, 1500);

      if (!tooltipTitle) {
        setIsTooltipVisible(false);
      }

      return () => {
        clearTimeout(timeoutId);
      };
    }, [isTooltipHidden, tooltipTitle]);

    const handleInputContainerMouseLeave = useCallback(() => {
      setIsTooltipVisible(false);
      setIsTooltipHidden(true);
    }, []);

    const handleInputContainerMouseOver = useCallback(
      (event: React.MouseEvent) => {
        const target = event.target as HTMLElement | null;
        const relatedTarget = event.relatedTarget as HTMLElement | null;

        if (target?.classList.contains("ant-input")) {
          if (!!tooltipTitle) {
            setIsTooltipHidden(false);
          }
        }

        if (relatedTarget?.classList.contains("ant-input")) {
          setIsTooltipHidden(true);
          setIsTooltipVisible(false);
        }
      },
      [tooltipTitle]
    );

    return (
      <div
        onMouseLeave={handleInputContainerMouseLeave}
        onMouseOver={handleInputContainerMouseOver}
        ref={inputWrapperRef}
        css={wrapperStyle}
      >
        <AlignedTooltip
          offsetY={-1}
          visible={isTooltipVisible}
          title={tooltipTitle}
          removeMouseEnterDelay={true}
        >
          <AntInput
            {...rest}
            ref={ref}
            css={[
              props.disabled
                ? getDisabledInputStyle(theme, props.bordered)
                : isSecond
                  ? secondInputStyle
                  : getDefaultInputStyle(theme, props.bordered),
            ]}
            value={value}
            allowClear={allowClear}
          />
        </AlignedTooltip>
      </div>
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
    const { minRows } = props;

    const autoSize = useMemo<AutoSizeType>(
      () => ({
        minRows: minRows || 3,
        maxRows: 5,
      }),
      [minRows]
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
