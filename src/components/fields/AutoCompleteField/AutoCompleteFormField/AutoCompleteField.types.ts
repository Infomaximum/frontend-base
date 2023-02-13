import type { SelectProps } from "antd/lib/select";
import type { RowSelectionType } from "antd/lib/table/interface";
import type { FieldRenderProps } from "react-final-form";
import type { IWithFeatureProps } from "../../../../decorators/hocs/withFeature/withFeature.types";
import type { IGroup, IModel } from "@im/models";
import type { AutoCompleteStore } from "../../../../utils/Store/AutoCompleteStore/AutoCompleteStore";
import type { Localization } from "@im/localization";
import type { IColumnProps } from "../../../VirtualizedTable/VirtualizedTable.types";
import type { TBaseRow } from "../../../../managers/Tree";
import type { IFieldProps } from "../../FormField/Field/Field.types";
import type { IFormFieldProps } from "../../FormField/FormField.types";
import type { TRowDisable } from "../../../DataTable/DataTable.types";
import type { IDataTableDrawerOwnProps } from "../../../drawers/DataTableDrawer/DataTableDrawer.types";
export type TAutoCompleteFieldValue = IModel[];

export interface IAutoCompleteProps
  extends IAutoCompleteOwnProps,
    FieldRenderProps<TAutoCompleteFieldValue> {}

export interface IAutoCompleteOwnProps
  extends Omit<
      SelectProps<TAutoCompleteFieldValue>,
      | "onChange"
      | "onFocus"
      | "onBlur"
      | "value"
      | "notFoundContent"
      | "children"
    >,
    IWithFeatureProps,
    Partial<Pick<IDataTableDrawerOwnProps, "tableStore" | "headerMode">> {
  hintContainer?: React.ReactNode;

  /**
   * Делать ли запрос при монтировании автокомплита
   */
  requestOnMount?: boolean;

  /**
   * callback-функция, которая будет вызвана при изменении значения автокомплита
   */
  onChangeCallback?: (value: TAutoCompleteFieldValue) => void;

  /**
   * Экземпляр Autocomplete-store возможных значений поля
   */
  autocompleteStore: AutoCompleteStore;

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
   * Функция блокирования строки по какому-либо признаку, принимает Model, возвращает boolean
   */
  rowDisable?: TRowDisable;

  /**
   * Обработчик отображаемых значений в автокомплите/селекте
   */
  handlerDisplayValues?: (value: IModel) => React.ReactNode | undefined;

  /**
   * Обработчик всплывающих значений в автокомплите/селекте
   */
  handlerTitleValues?: (value: IModel) => string | undefined;

  /**
   * Обработчик отображения выбранных значений в автокомплите/селекте
   * (нужен что бы перехватить значение initialValues)
   */
  handlerDisplaySelectedValues?: (value: IModel) => React.ReactNode | undefined;

  /**
   * Обработчик отображаемых значений в DataTable
   */
  handlerTableDisplayValues?: (value: IGroup | IModel) => string | undefined;

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
  ) => React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;

  /**
   * Ключи доступа к данным
   */
  dataAccessKeys?: string[];
  /**
   * Нужна ли группировка
   * @param model: IModel
   * @return строка по которой сгруппируются значения
   */
  groupBy?(model: IModel): string;
  /**
   * columnConfig для таблицы в дровере
   */
  columnConfig?: IColumnProps<TBaseRow>[];
}

export interface IAutoCompleteState {
  showDrawer?: boolean;
}

export interface IAutoCompleteFieldProps
  extends Omit<IFieldProps<TAutoCompleteFieldValue>, "children">,
    Omit<IAutoCompleteOwnProps, keyof IWithFeatureProps> {
  name: string;
}

export interface IAutoCompleteFormFieldProps
  extends Omit<IFormFieldProps<TAutoCompleteFieldValue>, "children">,
    Omit<IAutoCompleteOwnProps, keyof IWithFeatureProps> {}
