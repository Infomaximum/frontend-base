import { useCallback, type FC } from "react";
import { DatePicker as AntDatePicker } from "antd";
import type {
  IDatePickerFieldProps,
  IDatePickerFormFieldProps,
  IDatePickerProps,
} from "./DatePickerField.types";
import { datePickerFieldStyle, datePickerOverlayStyle } from "./DatePickerField.styles";
import moment, { type Moment } from "moment";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { useClearElementFromAttribute } from "../../../decorators/hooks/useClearElementFromAttribute";
import { globalScrollBehavior } from "../../../utils/ScrollBehavior/ScrollBehavior";
import { Input } from "../../Input/Input";
import { NOT_SET } from "../../../utils/Localization/Localization";
import { Tooltip } from "../../Tooltip/Tooltip";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";

const DatePicker: FC<IDatePickerProps> = ({
  showTime,
  momentFormat = showTime ? "DD.MM.YYYY, HH:mm" : "DD.MM.YYYY",
  picker,
  input: { value, onChange },
  readOnly,
  onOpenChange,
  datePickerInputStyle = datePickerFieldStyle,
  ...rest
}) => {
  const localization = useLocalization();

  const { ref } = useClearElementFromAttribute<HTMLDivElement>({
    selector: "input",
    removableAttribute: "title",
  });

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

    if (moment.isMoment(value)) {
      displayValue = value.format(momentFormat as string);
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
    <div ref={ref} css={datePickerOverlayStyle}>
      <Tooltip title={value?.format?.(momentFormat as string) || null}>
        <AntDatePicker
          key="ant-date-picker"
          picker={picker}
          format={momentFormat}
          onChange={onChange}
          onOpenChange={handleOpenChange}
          value={value}
          disabled={readOnly}
          style={datePickerInputStyle}
          showTime={showTime}
          {...rest}
        />
      </Tooltip>
    </div>
  );
};

const DatePickerFieldComponent: React.FC<IDatePickerFieldProps> = (props) => {
  const isEqual = useCallback((date1: Moment, date2: Moment) => {
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
