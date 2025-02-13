import type { Dayjs } from "dayjs";
import type { FieldRenderProps } from "react-final-form";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { DatePickerProps } from "antd";

type TDatePickerProps = DatePickerProps<Dayjs>;

type TDatePickerFieldValue = NonNullable<TDatePickerProps["value"]>;
type TOmitDatePickerProps = "onChange" | "onBlur" | "onFocus" | "format" | "value" | "name";

export interface IDatePickerProps
  extends IDatePickerOwnProps,
    TRemoveIndex<FieldRenderProps<TDatePickerFieldValue>> {
  datePickerInputStyle?: React.CSSProperties;
  /** Из-за особенностей кнопок Сейчас или Сегодня, устанавливаемая дата не учитывает displayFormat.
   * Из-за этого проблемы с isEqual
   */
  shouldModifyDateBasedOnDisplayFormat?: boolean;
}

export interface IDatePickerOwnProps extends Omit<TDatePickerProps, TOmitDatePickerProps> {
  // Почему-то DatePickerProps не содержит данный тип
  showTime?: DatePickerProps<Dayjs>["showTime"];
  displayFormat?: TDatePickerProps["format"];
  readOnly?: boolean;
}

export interface IDatePickerFieldProps
  extends Omit<IFieldProps<TDatePickerFieldValue>, "component">,
    IDatePickerOwnProps {
  name: string;
}

export interface IDatePickerFormFieldProps
  extends Omit<IFormFieldProps<TDatePickerFieldValue>, "component">,
    IDatePickerOwnProps {}
