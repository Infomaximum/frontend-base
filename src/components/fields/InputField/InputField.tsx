import type { FC } from "react";
import { PureComponent, useCallback } from "react";
import type {
  IInputFieldProps,
  IInputComponentProps,
  IInputState,
  IInputFormFieldProps,
  TInputFieldValue,
} from "./InputField.types";
import { trim, isString, isFunction } from "lodash";
import type { InputProps } from "antd/lib/input/Input";
import { EUserAgents, userAgent } from "@infomaximum/utility";
import { NOT_SET } from "../../../utils/Localization/Localization";
import { Input } from "../../Input/Input";
import { withLoc } from "../../../decorators";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";
import { TableCellField } from "../TableCellField/TableCellField";
import type { ICommonTableCellProps } from "../TableCellField/TableCellField.types";

class InputComponent extends PureComponent<IInputComponentProps, IInputState> {
  public static defaultProps = {
    inputComponent: Input,
    disableBrowserAutocomplete: false,
    autoComplete: "off",
  };

  constructor(props: IInputComponentProps) {
    super(props);

    this.state = {
      value: props.input?.value,
    } as IInputState;
  }

  public override componentDidUpdate() {
    if (isString(this.state.value) && isString(this.props.input?.value)) {
      if (trim(this.state.value) !== trim(this.props.input?.value)) {
        this.setState({ value: this.props.input?.value });
      }
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.input?.onChange) {
      this.props.input.onChange(event);
    }

    if (this.props.trimValue) {
      this.setState({ value: event.target.value });
    }
  };

  private handleDisableBrowserAutocomplete(event: React.FocusEvent<HTMLInputElement>) {
    event.target.removeAttribute("readonly");
  }

  // text-overflow: "ellipsis" не работает для инпутов в IE, если не установлен атрибут "readonly"
  // https://stackoverflow.com/questions/9771795/how-to-use-text-overflow-ellipsis-in-an-html-input-field
  private handleSetReadOnlyAttribute(event: React.FocusEvent<HTMLInputElement>) {
    (event.target as any).createTextRange()?.scrollIntoView(); // метод из IE - возврат каретки в начало строки

    event.target.setAttribute("readonly", "");
  }

  private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { disableBrowserAutocomplete } = this.props;

    const isIE = userAgent() === EUserAgents.MSIE;

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    if (this.props.input?.onFocus) {
      this.props.input.onFocus(event);
    }

    if (isIE || disableBrowserAutocomplete) {
      this.handleDisableBrowserAutocomplete(event);
    }
  };

  private handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const isIE = userAgent() === EUserAgents.MSIE;

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    if (this.props.input?.onBlur) {
      this.props.input.onBlur(event);
    }

    if (this.props.trimValue) {
      this.setState({ value: this.props.input?.value });
    }

    if (isIE) {
      this.handleSetReadOnlyAttribute(event);
    }
  };

  public override render() {
    const { readOnly, localization, disableBrowserAutocomplete, ...rest } = this.props;

    if (readOnly) {
      let value = this.props.input?.value;

      if (localization && (value === "" || value === undefined || value === null)) {
        value = localization.getLocalized(NOT_SET);
      }

      return (
        <div key="input-read-only">
          <Input value={value} suffix={rest.suffix} disabled={true} />
        </div>
      );
    }

    const { input, meta, inputComponent, trimValue, ...props } = rest;

    const isReadOnlyIE = userAgent() === EUserAgents.MSIE && !this.props.autoFocus;

    const _Input = inputComponent as React.ComponentType<InputProps>;

    return (
      <_Input
        key="ant-input"
        {...props}
        {...input}
        readOnly={isReadOnlyIE || disableBrowserAutocomplete}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        value={trimValue ? this.state.value : input?.value}
      />
    );
  }
}

const InputWithLoc = withLoc(InputComponent as any) as React.ComponentType<IInputComponentProps>;

const InputFieldComponent: FC<IInputFieldProps> = ({
  parse,
  autoFocus,
  trimValue = true,
  ...rest
}) => {
  const parseMethod = useCallback(
    (value: string) => {
      let parsedValue: TInputFieldValue = value;

      if (trimValue) {
        parsedValue = parsedValue.trim();
      }

      if (parse && isFunction(parse)) {
        parsedValue = parse(parsedValue, rest.name);
      }

      return parsedValue;
    },
    [parse, trimValue, rest.name]
  );

  return (
    <Field
      autoFocus={autoFocus}
      component={InputWithLoc}
      parse={parse || trimValue ? parseMethod : undefined}
      trimValue={trimValue}
      {...rest}
    />
  );
};

const InputFormField: React.FC<IInputFormFieldProps> = (props) => {
  return <FormField component={InputFieldComponent} {...props} />;
};

const InputTableCellField: React.FC<IInputFieldProps & ICommonTableCellProps> = (props) => {
  return <TableCellField component={InputFieldComponent} {...props} />;
};

export { InputFormField, InputTableCellField, InputFieldComponent };
