import { FC, useContext, useMemo } from "react";
import type { IFormOptionProps } from "./FormOption.types";
import {
  formOptionLabelStyle,
  formOptionComponentWrapperStyle,
  formOptionTooltipContainerStyle,
  labelWrapperStyle,
  spaceFormOptionStyle,
} from "./FormOption.styles";
import { Form } from "antd";
import type { ColProps } from "antd/lib/col";
import type { Interpolation } from "@emotion/react";
import type { FormLabelAlign } from "antd/lib/form/interface";
import { FieldTooltip } from "../../FieldTooltip/FieldTooltip";
import { SpaceSizeContext } from "../../../decorators/contexts/SpaceSizeContext";

const getPopupContainer = (element: HTMLElement) => element.closest("form") ?? element;

const FormItem = Form.Item;

const FormOptionComponent: FC<IFormOptionProps> = (props) => {
  const {
    label,
    wrapperCol,
    labelCol,
    labelAlign,
    colon,
    formItemStyle: formItemStyleProps,
    testId,
    highlightFieldWithError,
    promptText,
    promptWrapperStyle,
    rightLabel,
    promptTestId,
    wrapperComponentStyle,
    error: errorProp,
    submitError,
    touched,
    invalid,
  } = props;
  const spaceSize = useContext(SpaceSizeContext);
  const error = errorProp || submitError;

  const fieldOwnProps = useMemo(() => {
    // fieldOwnProps нужен для того, что бы не перебивать свойства передаваемые из формы
    const fieldProps: {
      wrapperCol?: ColProps;
      labelCol?: ColProps;
      labelAlign?: FormLabelAlign;
      colon?: boolean;
    } = {};

    if (wrapperCol) {
      fieldProps.wrapperCol = wrapperCol;
    }

    if (labelCol) {
      fieldProps.labelCol = labelCol;
    }

    if (labelAlign) {
      fieldProps.labelAlign = labelAlign;
    }

    if (colon !== undefined) {
      fieldProps.colon = colon;
    }

    return fieldProps;
  }, [colon, labelAlign, labelCol, wrapperCol]);

  const formItemStyle = useMemo(
    () => [spaceFormOptionStyle(spaceSize), formItemStyleProps, labelWrapperStyle],
    [formItemStyleProps, spaceSize]
  );

  const formOptionError = useMemo(
    () => <span test-id={error?.code?.toLowerCase()}>{error?.message}</span>,
    [error?.code, error?.message]
  );

  const formOptionLabel = useMemo(() => {
    if (!label) {
      return "";
    }

    let resultStyle: Interpolation<TTheme>;

    if (props.labelStyle) {
      resultStyle = [formOptionLabelStyle, props.labelStyle];
    } else {
      resultStyle = formOptionLabelStyle;
    }

    return <label css={resultStyle}>{label}</label>;
  }, [label, props.labelStyle]);

  return (
    <FormItem
      label={formOptionLabel}
      validateStatus={(touched && invalid) || highlightFieldWithError ? "error" : "success"}
      help={
        (touched && invalid && error && error.message && error.code && formOptionError) ||
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
      {promptText || rightLabel ? (
        <div css={[formOptionTooltipContainerStyle, promptWrapperStyle]}>
          <FieldTooltip
            promptText={promptText}
            caption={rightLabel}
            promptTestId={promptTestId}
            getPopupContainer={getPopupContainer}
          />
        </div>
      ) : null}
    </FormItem>
  );
};

export const FormOption = FormOptionComponent;
