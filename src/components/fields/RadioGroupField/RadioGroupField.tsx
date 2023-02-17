import React from "react";
import type {
  IRadioGroupFieldProps,
  IRadioGroupFieldContainerProps,
  IRadioGroupFormFieldProps,
} from "./RadioGroupField.types";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd/lib/radio";
import { radioGroupStyle } from "./RadioGroupField.style";
import { Field, FormField } from "../FormField";

const RadioGroupContainer: React.FC<IRadioGroupFieldContainerProps> = (props) => {
  const { children, readOnly, disabled, input, ...rest } = props;

  const onChange = React.useCallback(
    (e: RadioChangeEvent) => {
      input.onChange(e.target.value);
    },
    [input]
  );

  return (
    <Radio.Group
      css={radioGroupStyle}
      onChange={onChange}
      value={input.value}
      {...rest}
      disabled={readOnly || disabled}
    >
      {children}
    </Radio.Group>
  );
};

const RadioGroupField: React.FC<IRadioGroupFieldProps> = (props) => (
  <Field component={RadioGroupContainer} {...props} />
);

const RadioGroupFormField: React.FC<IRadioGroupFormFieldProps> = (props) => (
  <FormField component={RadioGroupField} {...props} />
);

export { RadioGroupFormField };
