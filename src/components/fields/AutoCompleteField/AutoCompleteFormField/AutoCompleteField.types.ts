import type { SelectProps } from "antd/lib/select";
import type { RowSelectionType } from "antd/lib/table/interface";
import type { FieldRenderProps } from "react-final-form";
import type { IWithFeatureProps } from "../../../../decorators/hocs/withFeature/withFeature.types";
import type { IGroup, IModel } from "@infomaximum/graphql-model";
import type { AutoCompleteStore } from "../../../../utils/Store/AutoCompleteStore/AutoCompleteStore";
import type { Localization } from "@infomaximum/localization";
import type { IColumnProps } from "../../../VirtualizedTable/VirtualizedTable.types";
import type { IFieldProps } from "../../FormField/Field/Field.types";
import type { IFormFieldProps } from "../../FormField/FormField.types";
import type { TRowDisable } from "../../../DataTable/DataTable.types";
import type { IDataTableDrawerOwnProps } from "../../../drawers/DataTableDrawer/DataTableDrawer.types";
import type { ISelectProps } from "../../../Select/Select.types";
export type TAutoCompleteFieldValue = IModel[];

export interface IAutoCompleteProps
  extends IAutoCompleteOwnProps,
    FieldRenderProps<TAutoCompleteFieldValue> {
  /**
   * Автофокус для дровера, чтобы убрать фокус с поля автокомплита и схлопнуть дропдаун,
   * при открытии дровера без полей для автофокуса
   */
  drawerAutoFocus?: boolean;
}

export interface IAutoCompleteOwnProps
  extends Omit<
      SelectProps<TAutoCompleteFieldValue>,
      "onChange" | "onFocus" | "onBlur" | "value" | "notFoundContent" | "children"
    >,
    Pick<ISelectProps, "autoFocusWithPreventScroll">,
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
   * callback-функция, которая будет вызвана при вводе каждого символа
   */
  onSearch?: (searchText: string) => void;

  /**
   * управляемая строка поиска
   */
  searchText?: string;
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

  isWithoutParentsGroupSelection?: boolean;

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

  /**
   * Доступен ли поиск
   */
  showSearch?: boolean;

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
  columnConfig?: IColumnProps<any>[];

  renderDrawer?(props: IAutoCompleteDrawerProps): React.ReactNode;

  /** Используется для выполнения действий при открытии дровера */
  onDrawerOpen?(): void;
}

export interface IAutoCompleteDrawerProps {
  onClose(): void;
  onSubmit(models: IModel[]): Promise<void>;
  selectedModels: IModel[];
}

export interface IAutoCompleteState {
  showDrawer?: boolean;
  searchText?: string;
}

export interface IAutoCompleteFieldProps
  extends Omit<IFieldProps<TAutoCompleteFieldValue>, "children">,
    Omit<IAutoCompleteOwnProps, keyof IWithFeatureProps> {
  name: string;
}

export interface IAutoCompleteFormFieldProps
  extends Omit<IFormFieldProps<TAutoCompleteFieldValue>, "children">,
    Omit<IAutoCompleteOwnProps, keyof IWithFeatureProps> {}
