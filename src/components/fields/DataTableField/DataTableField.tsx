import { PureComponent } from "react";
import type {
  IDataTableComponentProps,
  IDataTableFieldProps,
  TDataTableFieldValue,
  IDataTableFormFieldProps,
} from "./DataTableField.types";
import { wrapperFieldStyle } from "./DataTableField.styles";
import type { TBaseRow } from "../../../managers/Tree";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";
import { DataTable } from "../../DataTable/DataTable";

class DataTableComponent<T extends TBaseRow> extends PureComponent<IDataTableComponentProps<T>> {
  public handleCheckChange = (selectedModels: TDataTableFieldValue): void => {
    if (this.props.input.onChange) {
      this.props.input.onChange(selectedModels);
    }
  };

  public override render() {
    const { input, meta, ...rest } = this.props;

    return <DataTable {...input} {...rest} onCheckChange={this.handleCheckChange} />;
  }
}

function DataTableField<T extends TBaseRow = TBaseRow>(props: IDataTableFieldProps<T>) {
  return <Field {...props} component={DataTableComponent} />;
}

function DataTableFormField<T extends TBaseRow = TBaseRow>(props: IDataTableFormFieldProps<T>) {
  return (
    <FormField {...props} wrapperComponentStyle={wrapperFieldStyle} component={DataTableField} />
  );
}

export { DataTableFormField };
