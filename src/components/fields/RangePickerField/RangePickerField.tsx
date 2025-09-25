import React, { useCallback, useMemo } from "react";
import { DatePicker } from "@infomaximum/ui-kit";
import type {
  IRangePickerFieldProps,
  IRangePickerProps,
  IRangePickerFormFieldProps,
} from "./RangePickerField.types";
import { getPlaceholder } from "./RangePickerField.utils";
import { defaultRangePickerFieldTestId } from "@infomaximum/base/src/utils/TestIds";
import type { Dayjs } from "dayjs";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { Field, FormField } from "../FormField";
import type { ICommonTableCellProps } from "../TableCellField/TableCellField.types";
import { TableCellField } from "../TableCellField/TableCellField";

const { RangePicker: UiKitRangePicker } = DatePicker;

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

  const handleCalendarChange: IRangePickerProps["onCalendarChange"] = (dates) => {
    if (dates.every((item) => item !== null)) {
      onChange(dates);
    }
  };

  return (
    <div test-id={testId || defaultRangePickerFieldTestId}>
      <UiKitRangePicker
        defaultOpen={rest.autoFocus}
        onOpenChange={handleOpenChange}
        key="date-range-picker"
        format={format}
        picker={picker}
        onChange={onChange}
        value={value}
        placeholder={propsPlaceholder ?? placeholder}
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
