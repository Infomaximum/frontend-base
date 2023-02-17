import React from "react";
import type {
  ISelectInputComponentFieldProps,
  ISelectInputProps,
  IInputContainerProps,
  ISelectContainerProps,
  ISelectInputFormFieldProps,
  TSelectInputFieldValue,
} from "./SelectInputField.types";
import { selectFieldStyle, inputFieldStyle } from "./SelectInputField.styles";
import { Field as FinalField } from "react-final-form";
import type { FieldRenderProps } from "react-final-form";
import { Input } from "../../Input";
import { Select } from "../../Select";
import { SelectFormField } from "../SelectField";
import { Field, FormField } from "../FormField";

const InputContainer: React.FC<IInputContainerProps> = (props) => {
  const { input, meta, readOnly, disabled, ...rest } = props;
  return <Input {...input} {...rest} disabled={readOnly || disabled} />;
};

const SelectContainer: React.FC<ISelectContainerProps> = ({
  input: { onBlur, ...restInput },
  meta,
  readOnly,
  disabled,
  showArrow,
  ...rest
}) => {
  return (
    <Select
      {...restInput}
      {...rest}
      disabled={disabled || readOnly}
      showArrow={readOnly ? false : showArrow}
      defaultActiveFirstOption={true}
      style={selectFieldStyle}
    />
  );
};

class SelectInputFieldComponent extends React.PureComponent<ISelectInputComponentFieldProps> {
  public static Option = SelectFormField.Option;
  public static OptionGroup = SelectFormField.OptGroup;
  public static inputFieldName = "inputField" as const;
  public static selectFieldName = "selectField" as const;

  public override render() {
    const { children, placeholder } = this.props;
    const { input, readOnly, autoFocus } = this.props as ISelectInputComponentFieldProps &
      FieldRenderProps<TSelectInputFieldValue>;

    return (
      <FinalField
        name={`${input.name}.${SelectInputField.inputFieldName}`}
        test-id={SelectInputField.inputFieldName}
        key="input"
        component={InputContainer}
        style={inputFieldStyle}
        placeholder={placeholder}
        readOnly={readOnly}
        addonBefore={
          <div key="wrapper-select" test-id={SelectInputField.selectFieldName}>
            <FinalField
              name={`${input.name}.${SelectInputField.selectFieldName}`}
              key="select"
              component={SelectContainer}
              readOnly={readOnly}
            >
              {children}
            </FinalField>
          </div>
        }
        autoFocus={autoFocus}
      />
    );
  }
}

class SelectInputField extends React.PureComponent<ISelectInputProps> {
  public static Option = SelectInputFieldComponent.Option;
  public static OptionGroup = SelectInputFieldComponent.OptionGroup;
  public static inputFieldName = SelectInputFieldComponent.inputFieldName;
  public static selectFieldName = SelectInputFieldComponent.selectFieldName;

  public override render() {
    const { name, ...rest } = this.props;
    return <Field name={name} component={SelectInputFieldComponent} {...rest} />;
  }
}

class SelectInputFormField extends React.PureComponent<ISelectInputFormFieldProps> {
  public static Option = SelectInputField.Option;
  public static OptionGroup = SelectInputField.OptionGroup;
  public static inputFieldName = SelectInputField.inputFieldName;
  public static selectFieldName = SelectInputField.selectFieldName;

  public override render() {
    return (
      <FormField
        component={SelectInputField}
        wrapperComponentStyle={inputFieldStyle}
        {...this.props}
      />
    );
  }
}

export { SelectInputFormField };
