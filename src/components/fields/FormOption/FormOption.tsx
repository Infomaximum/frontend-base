import { type FC, useContext, useMemo } from "react";
import type { IFormOptionProps } from "./FormOption.types";
import {
  formOptionLabelStyle,
  formOptionComponentWrapperStyle,
  formOptionTooltipContainerDefaultStyle,
  formOptionRightTooltipContainerStyle,
  labelWrapperStyle,
  getSpaceFormOptionStyle,
  fieldDescriptionStyle,
  labelContainerStyle,
} from "./FormOption.styles";
import { Form } from "antd";
import type { ColProps } from "antd/lib/col";
import type { Interpolation } from "@emotion/react";
import type { FormLabelAlign } from "antd/lib/form/interface";
import { FieldTooltip } from "../../FieldTooltip/FieldTooltip";
import { SpaceSizeContext } from "../../../decorators/contexts/SpaceSizeContext";
import { DebugModeContext } from "../../../decorators";
import { isBoolean } from "lodash";

const getPopupContainer = (element: HTMLElement) => element.closest("form") ?? element;

const FormItem = Form.Item;

/**
 * * В новой навигации иконка подсказки указывается около label.
 * * Отображается, если передать promptText.
 * @example
 * <FormOption promptText={ReactNode}>{children}</FormOption>
 *
 * * Чтобы отобразить иконку справа от элемента, необходимо передать rightLabel.
 * @example
 * 1) <FormOption rightLabel={ReactNode}>{children}</FormOption> - только текст
 * 2) <FormOption rightLabel={ReactNode} promptText={ReactNode}>
 *      {children}
 *    </FormOption> - текст + иконка с popover
 * 3) <FormOption rightLabel={true} promptText={ReactNode}>
 *      {children}
 *    </FormOption> - только иконка с popover
 *
 */

const FormOptionComponent: FC<IFormOptionProps> = (props) => {
  const {
    label,
    labelContent,
    labelAlign,
    layout,
    colon,
    formItemStyle: formItemStyleProps,
    testId,
    highlightFieldWithError,
    promptText,
    promptWrapperStyle,
    getPromptPopupContainer,
    rightLabel,
    promptTestId,
    wrapperComponentStyle,
    error: errorProp,
    submitError,
    touched,
    invalid,
    description,
    additionalHint,
    readOnly,
  } = props;
  const spaceSize = useContext(SpaceSizeContext);
  const isDebugMode = useContext(DebugModeContext);
  const error = errorProp || submitError;

  const fieldOwnProps = useMemo(() => {
    // fieldOwnProps нужен для того, что бы не перебивать свойства передаваемые из формы
    const fieldProps: {
      wrapperCol?: ColProps;
      labelCol?: ColProps;
      labelAlign?: FormLabelAlign;
      colon?: boolean;
    } = {};

    if (labelAlign) {
      fieldProps.labelAlign = labelAlign;
    }

    if (colon !== undefined) {
      fieldProps.colon = colon;
    }

    return fieldProps;
  }, [colon, labelAlign]);

  const formItemStyle = useMemo(
    () => [getSpaceFormOptionStyle(spaceSize), formItemStyleProps, labelWrapperStyle],
    [formItemStyleProps, spaceSize]
  );

  const formOptionError = useMemo(
    () =>
      error && (
        <span test-id={error.code?.toLowerCase()}>
          {error.message} {isDebugMode && error.traceId && `[${error.traceId}]`}
        </span>
      ),
    [error, isDebugMode]
  );

  const formOptionLabel = useMemo(() => {
    if (!label && (!promptText || rightLabel)) {
      return "";
    }

    let resultStyle: Interpolation<TTheme>;

    if (props.labelStyle) {
      resultStyle = [formOptionLabelStyle, props.labelStyle];
    } else {
      resultStyle = formOptionLabelStyle;
    }

    return (
      <div css={labelContainerStyle}>
        <label css={resultStyle}>{labelContent || label}</label>
        {promptText ? (
          <div css={[formOptionTooltipContainerDefaultStyle, promptWrapperStyle]}>
            <FieldTooltip
              promptText={promptText}
              promptTestId={promptTestId}
              getPopupContainer={getPromptPopupContainer ?? getPopupContainer}
            />
          </div>
        ) : null}
      </div>
    );
  }, [
    getPromptPopupContainer,
    label,
    promptTestId,
    promptText,
    promptWrapperStyle,
    props.labelStyle,
    rightLabel,
    labelContent,
  ]);

  return (
    <FormItem
      label={formOptionLabel}
      layout={layout}
      validateStatus={
        (touched && invalid) || (readOnly && invalid) || highlightFieldWithError
          ? "error"
          : "success"
      }
      help={
        ((touched || readOnly) &&
          invalid &&
          error &&
          error.message &&
          error.code &&
          formOptionError) ||
        (highlightFieldWithError ? "" : null)
      }
      css={formItemStyle}
      test-id={testId}
      {...fieldOwnProps}
    >
      <div
        style={promptText || rightLabel ? formOptionComponentWrapperStyle : undefined}
        key="component-wrapper"
        css={wrapperComponentStyle}
      >
        {props.children}
      </div>

      {rightLabel ? (
        <div css={[formOptionRightTooltipContainerStyle, promptWrapperStyle]}>
          <FieldTooltip
            promptText={promptText}
            caption={isBoolean(rightLabel) ? null : rightLabel}
            promptTestId={promptTestId}
            getPopupContainer={getPromptPopupContainer ?? getPopupContainer}
          />
        </div>
      ) : null}

      {additionalHint}
      {description && <div css={fieldDescriptionStyle}>{description}</div>}
    </FormItem>
  );
};

export const FormOption = FormOptionComponent;
