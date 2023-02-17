import React, { useMemo, useCallback } from "react";
import type {
  IInputNumberFieldProps,
  IInputNumberProps,
  IInputNumberFormFieldProps,
} from "./InputNumberField.types";
import { InputNumber as AntInputNumber } from "antd";
import { isNumber, isInteger, isNil, isNull } from "lodash";
import { antInputNumberStyle, defaultWrapperComponentStyle } from "./InputNumberField.styles";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { NOT_SET } from "../../../utils/Localization/Localization";
import { Input } from "../../Input/Input";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";

const isFloat = (value: string | number | undefined | null) =>
  isNumber(value) && Number(value) !== value;

const roundToPrecision = (value?: number | string | null, precision?: number): string => {
  if (!isNumber(value)) {
    return roundToPrecision(0, precision);
  }

  if (!precision) {
    return String(value);
  }

  if (isInteger(value)) {
    const tail: string = Array(precision).fill("0").join("");
    return `${value}.${tail}`;
  }

  return value.toFixed(precision);
};

const InputNumber: React.FC<IInputNumberProps> = (props) => {
  const localization = useLocalization();

  const { readOnly, input, ...rest } = props;

  const onChange = useCallback(
    (nextValue: string | number | undefined) => {
      const onChange = props.input?.onChange;

      if (isFloat(nextValue)) {
        onChange(nextValue);
        return;
      }

      if (isNull(nextValue)) {
        onChange(null);
        return;
      }

      onChange(roundToPrecision(nextValue, props.precision));
    },
    [props.input?.onChange, props.precision]
  );

  const parser = useMemo(
    () =>
      (value: string | undefined): string => {
        if (!isNaN(Number(value))) {
          return value as string;
        }

        if (value) {
          return value;
        }

        return roundToPrecision(0, rest.precision);
      },
    [rest.precision]
  );

  if (readOnly || props.disabled) {
    let displayValue = input.value;

    if (isNil(displayValue) || displayValue === "") {
      displayValue = localization.getLocalized(NOT_SET);
    }

    return (
      <span key="input-number-read-only">
        <Input value={displayValue} disabled={true} />
      </span>
    );
  }

  const inputValue = input.value
    ? input.value
    : isNull(input.value)
    ? null
    : roundToPrecision(0, rest.precision);

  return (
    <AntInputNumber
      key="ant-input-number"
      {...input}
      onChange={onChange}
      parser={parser}
      defaultValue={inputValue as number}
      style={antInputNumberStyle}
      {...rest}
    />
  );
};

const InputNumberField: React.FC<IInputNumberFieldProps> = (props) => {
  return <Field component={InputNumber} {...props} />;
};

const InputNumberFormField: React.FC<IInputNumberFormFieldProps> = (props) => {
  const { wrapperComponentStyle = defaultWrapperComponentStyle, ...rest } = props;

  return (
    <FormField
      component={InputNumberField}
      wrapperComponentStyle={wrapperComponentStyle}
      {...rest}
    />
  );
};

export { InputNumberFormField, InputNumberField, roundToPrecision, InputNumber };
