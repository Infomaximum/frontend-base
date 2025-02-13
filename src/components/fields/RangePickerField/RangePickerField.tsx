import React, { useCallback, useMemo } from "react";
import { DatePicker } from "antd";
import type {
  IRangePickerFieldProps,
  IRangePickerProps,
  IRangePickerFormFieldProps,
  TRangeValueType,
} from "./RangePickerField.types";
import { getPlaceholder } from "./RangePickerField.utils";
import { defaultRangePickerFieldTestId } from "../../../utils/TestIds";
import { defaultRangePickerFieldStyle } from "./RangePickerField.styles";
import type { Dayjs } from "dayjs";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { Field, FormField } from "../FormField";
import type { ICommonTableCellProps } from "../TableCellField/TableCellField.types";
import { TableCellField } from "../TableCellField/TableCellField";

const { RangePicker: AntRangePicker } = DatePicker;

const RangePicker: React.FC<IRangePickerProps> = ({
  input: { value, onChange, onBlur },
  meta,
  readOnly,
  placeholder: propsPlaceholder,
  displayFormat,
  picker,
  disabled,
  testId,
  ...rest
}) => {
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        onBlur(undefined);
      }
    },
    [onBlur]
  );

  const localization = useLocalization();
  const placeholder = useMemo(() => getPlaceholder(localization), [localization]);

  const format = displayFormat || "DD.MM.YYYY";

  const handleCalendarChange = (dates: TRangeValueType<Dayjs>) => {
    if (dates.every((item: Dayjs) => item !== null)) {
      onChange(dates);
    }
  };

  return (
    <div test-id={testId || defaultRangePickerFieldTestId}>
      <AntRangePicker
        defaultOpen={rest.autoFocus}
        onOpenChange={handleOpenChange}
        key="ant-date-range-picker"
        format={format}
        picker={picker}
        onChange={onChange}
        value={value}
        placeholder={propsPlaceholder ?? placeholder}
        style={defaultRangePickerFieldStyle}
        onCalendarChange={handleCalendarChange}
        {...rest}
        disabled={readOnly || disabled}
      />
    </div>
  );
};

const RangePickerField: React.FC<IRangePickerFieldProps> = (props) => {
  const isEqual = useCallback((date1: [Dayjs, Dayjs], date2: [Dayjs, Dayjs]) => {
    if (!date1 && !date2) {
      return true;
    }

    return date1?.[0].isSame(date2?.[0]) && date1?.[1].isSame(date2?.[1]);
  }, []);

  return <Field component={RangePicker} {...props} isEqual={isEqual} />;
};

const RangePickerFormField: React.FC<IRangePickerFormFieldProps> = (props) => {
  return <FormField component={RangePickerField} {...props} />;
};

const RangePickerTableCellField: React.FC<IRangePickerFieldProps & ICommonTableCellProps> = (
  props
) => {
  return <TableCellField component={RangePickerField} {...props} />;
};

export { RangePickerFormField, RangePickerTableCellField };
