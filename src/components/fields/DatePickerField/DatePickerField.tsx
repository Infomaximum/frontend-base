import { useCallback, type FC } from "react";
import { DatePicker as UiKitDatePicker, type DatePickerProps } from "@infomaximum/ui-kit";
import type {
  IDatePickerFieldProps,
  IDatePickerFormFieldProps,
  IDatePickerProps,
} from "./DatePickerField.types";
import dayjs, { type Dayjs } from "dayjs";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { globalScrollBehavior } from "@infomaximum/base/src/utils/ScrollBehavior/ScrollBehavior";
import { Input } from "@infomaximum/base/src/components/Input/Input";
import { NOT_SET } from "@infomaximum/base/src/utils/Localization/Localization";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";
import { isNil, isString, reduce } from "lodash";

const modifyDateBasedOnDisplayFormatConfig = [
  {
    missingTokens: ["H", "HH", "h", "hh"],
    action: (date: Dayjs) => date.set("hours", 0),
  },
  {
    missingTokens: ["m", "mm"],
    action: (date: Dayjs) => date.set("minutes", 0),
  },
  {
    missingTokens: ["s", "ss"],
    action: (date: Dayjs) => date.set("seconds", 0),
  },
  {
    missingTokens: ["SSS"],
    action: (date: Dayjs) => date.set("milliseconds", 0),
  },
];

const modifyDateBasedOnDisplayFormat = (
  date: Dayjs | Dayjs[],
  displayFormat: IDatePickerProps["displayFormat"]
) => {
  if (!isString(displayFormat) || Array.isArray(date)) {
    return date;
  }

  return reduce(
    modifyDateBasedOnDisplayFormatConfig,
    (acc, item) => {
      if (item.missingTokens.some((token) => displayFormat.includes(token))) {
        return acc;
      }

      return item.action(acc);
    },
    date
  );
};

const DatePicker: FC<IDatePickerProps> = ({
  showTime,
  displayFormat = showTime ? "DD.MM.YYYY, HH:mm" : "DD.MM.YYYY",
  picker,
  input: { value, onChange, ...restInput },
  readOnly,
  onOpenChange,
  datePickerInputStyle,
  shouldModifyDateBasedOnDisplayFormat,
  onChangeCallback,
  ...rest
}) => {
  const localization = useLocalization();

  const handleChange = useCallback<NonNullable<DatePickerProps["onChange"]>>(
    (_date) => {
      if (isNil(_date)) {
        onChangeCallback?.(_date);

        return onChange(_date);
      }

      if (shouldModifyDateBasedOnDisplayFormat) {
        const date = modifyDateBasedOnDisplayFormat(_date, displayFormat);

        onChangeCallback?.(date);

        return onChange(date);
      }

      onChangeCallback?.(_date);

      return onChange(_date);
    },
    [displayFormat, onChange, onChangeCallback, shouldModifyDateBasedOnDisplayFormat]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        globalScrollBehavior.hideScroll();
      } else {
        globalScrollBehavior.showScroll();
      }

      if (typeof onOpenChange === "function") {
        onOpenChange(isOpen);
      }
    },
    [onOpenChange]
  );

  if (readOnly || rest.disabled) {
    let displayValue = "";

    if (dayjs.isDayjs(value)) {
      displayValue = value.format(displayFormat as string);
    } else {
      displayValue = localization.getLocalized(NOT_SET);
    }

    return (
      <span key="date-picker-read-only">
        <Input value={displayValue} disabled={true} />
      </span>
    );
  }

  return (
    <UiKitDatePicker
      key="date-picker"
      picker={picker}
      format={displayFormat}
      onChange={handleChange}
      onOpenChange={handleOpenChange}
      value={value}
      disabled={readOnly}
      style={datePickerInputStyle}
      showTime={showTime}
      {...rest}
      {...restInput}
    />
  );
};

const DatePickerFieldComponent: React.FC<IDatePickerFieldProps> = (props) => {
  const isEqual = useCallback((date1: Dayjs, date2: Dayjs) => {
    if (!date1 && !date2) {
      return true;
    }

    return date1?.isSame(date2);
  }, []);

  return <Field component={DatePicker} {...props} isEqual={isEqual} />;
};

const DatePickerFormField: React.FC<IDatePickerFormFieldProps> = (props) => {
  return <FormField component={DatePickerFieldComponent} {...props} />;
};

export { DatePickerFormField, DatePickerFieldComponent };
