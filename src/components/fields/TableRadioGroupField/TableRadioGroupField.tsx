import React from "react";
import type {
  ITableRadioGroupFieldProps,
  ITableRadioGroupFieldContainerProps,
  ITableRadioGroupFormFieldProps,
} from "./TableRadioGroupField.types";
import { tableRadioGroupStyle, radioStyle, labelStyle } from "./TableRadioGroupField.styles";
import type { RadioChangeEvent } from "antd/lib/radio";
import { createSelector } from "reselect";
import type { IBaseColumnConfig } from "../../Table/Table.types";
import { Radio } from "../../Radio/Radio";
import { Table } from "../../Table";
import { Field, FormField } from "../FormField";

/** Пример использования в AccessToSystemFilterDrawer */

class TableRadioGroupContainer<T extends Record<string, any>> extends React.PureComponent<
  ITableRadioGroupFieldContainerProps<T>
> {
  private getColumnConfig = createSelector(
    (columns: IBaseColumnConfig<T>[] | undefined) => columns,
    (columns) => {
      return (
        columns || [
          {
            dataIndex: "caption",
            key: "caption",
            render: (text: React.ReactNode, record: any) => (
              <Radio value={record?.value} style={radioStyle} test-id={record?.["test-id"]}>
                <span style={labelStyle}>{text}</span>
              </Radio>
            ),
          },
        ]
      );
    }
  );

  private handleChange = (e: RadioChangeEvent) => {
    this.props.input.onChange(e.target.value);
  };

  public override render() {
    const {
      readOnly,
      input,
      tableProps,
      columns,
      dataSource,
      disabled,
      localization,
      ...radioGroupProps
    } = this.props;

    return (
      <Radio.Group
        onChange={this.handleChange}
        value={input.value}
        {...radioGroupProps}
        css={tableRadioGroupStyle}
        disabled={readOnly || disabled}
      >
        <Table<T>
          columns={this.getColumnConfig(columns)}
          dataSource={dataSource}
          localization={localization}
          size="middle"
          showHeader={false}
          {...tableProps}
        />
      </Radio.Group>
    );
  }
}

const TableRadioGroupField: React.FC<ITableRadioGroupFieldProps> = <T extends Record<string, any>>(
  props: ITableRadioGroupFieldProps<T>
) => <Field component={TableRadioGroupContainer} {...props} />;

const TableRadioGroupFormField: React.FC<ITableRadioGroupFormFieldProps> = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: ITableRadioGroupFormFieldProps<T>
) => <FormField component={TableRadioGroupField} {...props} />;

export { TableRadioGroupFormField, TableRadioGroupField };
