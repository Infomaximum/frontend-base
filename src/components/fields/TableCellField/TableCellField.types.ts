import type { IFieldProps, IWrappedFieldProps } from "../FormField/Field/Field.types";
import type { Localization } from "@infomaximum/localization";
import type { FieldRenderProps } from "react-final-form";

export interface ICommonTableCellProps {
  defaultContent: React.ReactNode;
  /**
   * css-ширина редактируемого поля
   */
  width?: string | number;
  /**
   * Нужно ли содержимое поля обрезать троеточием в конце?
   * Работает в паре с maxWidth: 0px; для стиля ячейки
   */
  isNeedEllipsis?: boolean;
}

type TOmittedFieldProps<V, T extends FieldRenderProps<V>> = Omit<
  IFieldProps<V, T>,
  "component" | "localization"
>;

interface ICommonFieldProps<V, T extends FieldRenderProps<V>>
  extends TOmittedFieldProps<V, T>,
    Pick<IWrappedFieldProps<V>, "setFieldProvider"> {
  localization: Localization;
}

export interface ITableCellProps<V, T extends FieldRenderProps<V>>
  extends ICommonTableCellProps,
    TOmittedFieldProps<V, T> {
  component: React.ComponentType<Partial<ICommonFieldProps<V, T>>>;
}

export interface ITableCellFieldFormItemProps<V, T extends FieldRenderProps<V>>
  extends Omit<ITableCellProps<V, T>, "defaultContent" | "width"> {}
