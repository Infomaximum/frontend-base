import type { FC } from "react";
import React, { memo, useCallback, useState } from "react";
import type { SelectProps } from "rc-select";
import type {
  ISelectFieldProps,
  ISelectFormFieldProps,
  ISelectComponentProps,
} from "./SelectField.types";
import { defaultWrapperComponentStyle, defaultSelectFieldStyle } from "./SelectField.styles";
import type { ICommonTableCellProps } from "../TableCellField/TableCellField.types";
import { isNil, isNull } from "lodash";
import { Select } from "../../Select/Select";
import { Input } from "../../Input/Input";
import { NOT_SELECTED } from "../../../utils/Localization/Localization";
import { Field } from "../FormField/Field/Field";
import { DropdownPlaceholder } from "../../Select/DropdownPlaceholder/DropdownPlaceholder";
import { FormField } from "../FormField/FormField";
import { TableCellField } from "../TableCellField/TableCellField";
import { withLoc } from "../../../decorators/hocs/withLoc/withLoc";

const { Option, OptGroup } = Select;

const SelectComponent: FC<ISelectComponentProps> = memo((props) => {
  const {
    readOnly,
    disabled,
    showArrow,
    input: { onBlur, value, ...restInput },
    localization,
    onChangeCallback,
    onSearch,
    ...rest
  } = props;

  const isDisabled = readOnly || disabled;

  const handleChange = useCallback<NonNullable<SelectProps["onChange"]>>(
    (value, option) => {
      const {
        input: { onChange },
        onChangeCallback,
      } = props;

      if (onChange) {
        onChange(value);
      }
      if (onChangeCallback) {
        onChangeCallback(value, option);
      }
    },
    [props]
  );

  if (localization && readOnly && isNil(value)) {
    return <Input value={localization.getLocalized(NOT_SELECTED)} disabled={true} />;
  }

  return (
    <Select
      key="ant-select"
      {...rest}
      {...restInput}
      // Т.к. из final-form приходит "" при передаче undefined или null
      value={value === "" ? null : value}
      onChange={handleChange}
      onSearch={onSearch}
      disabled={isDisabled}
      showArrow={readOnly ? false : showArrow}
      css={defaultSelectFieldStyle}
    />
  );
});

export const SelectFieldComponent: React.FC<ISelectFieldProps> = (props) => {
  const {
    searchValue: searchValueProps,
    onSearch,
    showSearch = false,
    notFoundContent,
    ...rest
  } = props;

  const [searchValueState, setSearchValueState] = useState("");

  const searchValue = searchValueProps ?? searchValueState;

  const handleSearch = useCallback(
    (value: string) => {
      onSearch?.(value);
      setSearchValueState(value);
    },
    [onSearch]
  );

  return (
    <Field
      component={SelectComponent}
      {...rest}
      searchValue={searchValue}
      onSearch={showSearch ? handleSearch : undefined}
      showSearch={showSearch}
      notFoundContent={
        isNull(notFoundContent) ? null : <DropdownPlaceholder searchText={searchValue} />
      }
    />
  );
};

export class SelectFormFieldComponent extends React.PureComponent<ISelectFormFieldProps> {
  public static defaultProps = {
    wrapperComponentStyle: defaultWrapperComponentStyle,
  };

  public static Option = Option;
  public static OptGroup = OptGroup;

  public override render() {
    return (
      <FormField
        component={SelectFieldComponent}
        wrapperComponentStyle={this.props.wrapperComponentStyle}
        {...this.props}
      />
    );
  }
}

export const SelectTableCellField: React.FC<ISelectFieldProps & ICommonTableCellProps> = (
  props
) => {
  return <TableCellField component={SelectFieldComponent} {...props} />;
};

export const SelectFormField = withLoc(SelectFormFieldComponent);
