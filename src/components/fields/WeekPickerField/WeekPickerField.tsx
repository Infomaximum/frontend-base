import React from "react";
import { DatePicker as UiKitDatePicker } from "@infomaximum/ui-kit";
import { isFunction } from "lodash";
import type { Dayjs } from "dayjs";
import type {
  IWeekPickerFieldProps,
  IWeekPickerProps,
  IWeekPickerFormFieldProps,
} from "./WeekPickerField.types";
import { WEEK } from "@infomaximum/base/src/utils/Localization/Localization";
import { Field, FormField } from "../FormField";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";

class WeekPicker extends React.PureComponent<IWeekPickerProps> {
  private handleChange = (date: Dayjs | Dayjs[] | null) => {
    const {
      input: { onChange },
    } = this.props;

    if (Array.isArray(date)) {
      return;
    }

    if (isFunction(onChange)) {
      onChange(date ? date.startOf("week") : undefined);
    }
  };

  public override render() {
    const {
      displayFormat,
      input,
      input: { value },
      meta,
      localization,
      ...rest
    } = this.props;

    return (
      <UiKitDatePicker
        key="date-week-picker"
        format={displayFormat || `w [${localization.getLocalized(WEEK).toLowerCase()}] GGGG`}
        onChange={this.handleChange}
        value={value}
        picker="week"
        {...rest}
      />
    );
  }
}

const WeekPickerField: React.FC<IWeekPickerFieldProps> = (props) => {
  return <Field component={WeekPicker} {...props} />;
};

const WeekPickerFormField: React.FC<IWeekPickerFormFieldProps> = (props) => {
  const localization = useLocalization();

  return <FormField component={WeekPickerField} {...props} localization={localization} />;
};

export { WeekPickerFormField };
