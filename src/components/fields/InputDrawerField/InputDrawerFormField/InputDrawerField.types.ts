import type { SelectProps } from "antd/lib/select";
import type { RowSelectionType } from "antd/lib/table/interface";
import type { FieldRenderProps } from "react-final-form";
import type { IGroup, IModel } from "@infomaximum/graphql-model";
import type { Localization } from "@infomaximum/localization";
import type { IFieldProps } from "../../FormField/Field/Field.types";
import type { IFormFieldProps } from "../../FormField/FormField.types";
import type { IDataTableDrawerOwnProps } from "../../../drawers/DataTableDrawer/DataTableDrawer.types";
export type TInputDrawerFieldValue = IModel[];

export interface IInputDrawerProps
  extends IInputDrawerOwnProps,
    FieldRenderProps<TInputDrawerFieldValue> {}

export interface IInputDrawerOwnProps
  extends Omit<
      SelectProps<TInputDrawerFieldValue>,
      "onChange" | "onFocus" | "onBlur" | "value" | "notFoundContent"
    >,
    Partial<Pick<IDataTableDrawerOwnProps, "tableStore" | "headerMode">> {
  hintContainer?: React.ReactNode;

  /**
   * Делать ли запрос при монтировании компонента
   */
  requestOnMount?: boolean;

  /**
   * callback-функция, которая будет вызвана при изменении значения
   */
  onChangeCallback?: (value: TInputDrawerFieldValue) => void;

  /**
   * Включать ли дровер для выбора значения из таблицы
   */
  isDrawerEnabled?: boolean;

  /**
   * Заголовок в дровере
   */
  drawerTitle?: string;

  removeContradictions?: boolean;

  /**
   * Переменные запроса
   */
  queryVariables?: TDictionary;

  /**
   * Обработчик отображаемых значений в DataTable
   */
  handlerTableDisplayValues?: (value: IGroup | IModel) => string;

  /**
   * Поле доступно только для чтения
   */
  readOnly?: boolean;

  /**
   * Показывать ли шапку в таблице дровера
   */
  showHeader?: boolean;

  localization?: Localization;

  /**
   * тип элемента выбора в таблице radio или checkbox
   */
  tableSelectionType?: RowSelectionType;

  /**
   * Передача пропсов для элементов автокомплита/селекта
   */
  labelPropsGetter?: (
    value: IModel
  ) => React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

export interface IInputDrawerState {
  showDrawer?: boolean;
}

export interface IInputDrawerFieldProps
  extends Omit<IFieldProps<TInputDrawerFieldValue>, "children">,
    IInputDrawerOwnProps {
  name: string;
}

export interface IInputDrawerFormFieldProps
  extends IFormFieldProps<TInputDrawerFieldValue>,
    IInputDrawerOwnProps {}
