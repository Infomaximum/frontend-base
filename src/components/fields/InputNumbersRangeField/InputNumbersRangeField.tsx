import { Space } from "antd";
import { first, isNil, last, map } from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import type { FieldMetaState } from "react-final-form";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";
import { InputNumber } from "../InputNumberField/InputNumberField";
import type { TInputNumberFieldValue } from "../InputNumberField/InputNumberField.types";
import { dashStyle } from "./InputNumbersRangeField.styles";
import type {
  IInputNumbersRangeFieldProps,
  IInputNumbersRangeFormFieldProps,
  IInputNumbersRangeProps,
  TInputNumbersRangeFieldValue,
} from "./InputNumbersRangeField.types";
import { normalizeRange } from "./InputNumbersRangeField.utils";

const InputNumbersRange: React.FC<IInputNumbersRangeProps> = ({ input, ...restProps }) => {
  const defaultValue = restProps.min ?? 0;
  const defaultRange = useMemo<TInputNumbersRangeFieldValue>(
    () => [defaultValue, defaultValue],
    [defaultValue]
  );
  const { value: inputsRange = defaultRange, onChange } = input;
  const valuesRef = useRef<TInputNumbersRangeFieldValue>(inputsRange);

  const setValues = useCallback(
    (nextValues: TInputNumbersRangeFieldValue) => {
      valuesRef.current = normalizeRange(
        map(nextValues, (x, i) => x ?? defaultRange[i]) as TInputNumbersRangeFieldValue
      );

      onChange(valuesRef.current);
    },
    [onChange, defaultRange]
  );

  const handleChangeBegin = useCallback(
    (begin: number) => {
      const end = last(valuesRef.current);

      if (!isNil(end)) {
        setValues([begin, end]);
      }
    },
    [setValues]
  );

  const handleChangeEnd = useCallback(
    (end: number) => {
      const begin = first(valuesRef.current);

      if (!isNil(begin)) {
        setValues([begin, end]);
      }
    },
    [setValues]
  );

  const [begin, end] = inputsRange;

  const inputBegin = useMemo(
    () => ({ ...input, value: begin, onChange: handleChangeBegin }),
    [handleChangeBegin, begin, input]
  );

  const inputEnd = useMemo(
    () => ({ ...input, value: end, onChange: handleChangeEnd }),
    [handleChangeEnd, end, input]
  );

  return (
    <Space size={3}>
      <InputNumber
        {...restProps}
        meta={null as unknown as FieldMetaState<TInputNumberFieldValue>}
        input={inputBegin}
      />
      <span css={dashStyle}>—</span>
      <InputNumber
        {...restProps}
        meta={null as unknown as FieldMetaState<TInputNumberFieldValue>}
        input={inputEnd}
      />
    </Space>
  );
};

const InputNumbersRangeField: React.FC<IInputNumbersRangeFieldProps> = (props) => {
  return <Field component={InputNumbersRange} {...props} />;
};

const InputNumbersRangeFormField: React.FC<IInputNumbersRangeFormFieldProps> = (props) => {
  return <FormField component={InputNumbersRangeField} {...props} />;
};

export { InputNumbersRangeFormField, InputNumbersRangeField };
