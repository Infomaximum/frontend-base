import React from "react";
import { DatePicker } from "antd";
import { isFunction } from "lodash";
import type moment from "moment";
import type {
  IWeekPickerFieldProps,
  IWeekPickerProps,
  IWeekPickerFormFieldProps,
} from "./WeekPickerField.types";
import { WEEK } from "../../../utils/Localization/Localization";
import { Field, FormField } from "../FormField";
import { useLocalization } from "../../../decorators";

const { WeekPicker: AntWeekPicker } = DatePicker;

class WeekPicker extends React.PureComponent<IWeekPickerProps> {
  private handleChange = (date: moment.Moment | null) => {
    const {
      input: { onChange },
    } = this.props;

    if (isFunction(onChange)) {
      onChange(date ? date.startOf("week") : undefined);
    }
  };

  public override render() {
    const {
      momentFormat,
      input,
      input: { value },
      meta,
      localization,
      ...rest
    } = this.props;

    return (
      <AntWeekPicker
        key="ant-date-week-picker"
        format={momentFormat || `w [${localization.getLocalized(WEEK).toLowerCase()}] GGGG`}
        onChange={this.handleChange}
        value={value}
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
