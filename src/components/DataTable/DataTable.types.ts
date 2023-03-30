import type { headerModes } from "./DataTableHeader/DataTableHeader";
import type { TableRowSelection, RowSelectionType } from "antd/lib/table/interface";
import type { IEditableDataTableState } from "../EditableDataTable/EditableDataTable.types";
import type { Group, IModel } from "@infomaximum/graphql-model";
import type { TAccessRules } from "../../utils/access";
import type { ITableOwnProps } from "../Table/Table.types";
import type { IColumnProps } from "../VirtualizedTable/VirtualizedTable.types";
import type { TExtendColumns } from "../../managers/Tree";
import type { TContextMenuItem } from "../ContextMenuTable/ContextMenuTable.types";
import type { TableStore } from "../../utils/Store/TableStore";
import type { ELimitsStateNames } from "../../utils/const";
import type { TreeCounter } from "../../managers/TreeCounter";
import type { IShowMoreProps } from "../ShowMore/ShowMore.types";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { IWithFeatureProps } from "../../decorators/hocs/withFeature/withFeature.types";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";
import type { IWithLocationProps } from "../../decorators/hocs/withLocation/withLocation.types";

export type TRowDisable = (model: IModel) => boolean;

export type THeaderButtonObject = {
  component: React.ReactElement;
  accessRules?: TAccessRules | TAccessRules[];
  float?: "left" | "right";
  priority?: number;
  key?: string;
};

type TTableProps<T> = Omit<ITableOwnProps<T>, "localization" | "isSearchEmpty">;

export interface IDataTableOwnProps<T> extends TTableProps<T> {
  customDataSource?: TExtendColumns<T>[];
  columns: IColumnProps<TExtendColumns<T>>[] | undefined;
  contextMenuGetter?(model?: IModel): TContextMenuItem[] | undefined;
  onContextMenuSelect?(action: string, record: TExtendColumns<T>): void;
  tableStore: TableStore<Group>;
  limitStateName: ELimitsStateNames;
  selectionType?: RowSelectionType;
  headerMode?: valueof<typeof headerModes>;
  invisibleRowKeys?: string[];
  headerButtonsGetter?(
    treeCounter?: TreeCounter,
    editingState?: IEditableDataTableState<T>
  ): THeaderButtonObject[];
  defaultCheckedModels?: IModel[];
  showMoreMode?: IShowMoreProps["mode"];
  searchPlaceholder?: string;

  /**
   * Операции, при наличии которых чекбоксы таблицы будут включены. Если операции не указаны, то проверка производится
   * не будет.
   */
  checkboxesAccessRules?: TAccessRules | TAccessRules[];

  rowBuilder(model: IModel): T;
  onCheckChange?(selectedModels: IModel[] | undefined): void;
  /**
   * Флаг включения группового выделения
   */
  isGroupSelection?: boolean;
  /**
   * Флаг включения/отключения отображения чекбоксов
   */
  isCheckable?: boolean;
  /**
   * Дополнительные переменные для выполнения запроса
   */
  queryVariables?: TDictionary;
  /**
   * Блокирование строки по какому-либо признаку
   */
  rowDisable?: TRowDisable;
  /**
   * нужна ли сортировка по приоритету
   */
  sortColumnsByPriority?: boolean;
  /**
   * Запрашивать ли данные при монтировании таблицы
   */
  requestOnMount?: boolean;
  /**
   * Очищать ли данные стора целиком при отмонтировании таблицы
   */
  clearOnUnmount?: boolean;
  /**
   * Подписываться ли на изменения данных сервера при монтировании таблицы
   */
  subscribeOnMount?: boolean;
  /**
   * Отписываться ли от изменений данных сервера при отмонтировании таблицы
   */
  unsubscribeOnUnmount?: boolean;
  /**
   * Являются ли фильтры пустыми
   */
  isFiltersEmpty?: boolean;

  /**
   * Включать ли виртуализацию в таблице
   */
  isVirtualized?: boolean;

  /**
   * Состояние редактируемой таблицы
   */
  editingState?: IEditableDataTableState<T>;

  /** Включить ли очистку поля поиска */
  allowClear?: boolean;

  /** Подсказка пользователю, когда "нет данных" */
  emptyHint?: string;

  /** Первоначальная проверка на expandable. prevProps.dataSource !== this.props.dataSource не отрабатывает
   * в невиртуализированныx древовидных DataTable
   */
  isNeedCheckExpandable?: boolean;

  /**
   * Функция, выдергивающая метод clearCheck() из DataTable, чтобы с помощью него очищать
   * состояние выбранных элементов в Tree, извне.
   */
  treeCheckedStateCleanSetter?: (treeCheckedStateCleaner: () => void) => void;

  /** Будут ли раскрываться строки после изменении модели в древовидных списках при пустом поиске
   * @default true
   */
  isExpandRowsAfterModelChange?: boolean;
}

export interface IDataTableProps<T>
  extends IDataTableOwnProps<T>,
    IWithLocProps,
    IWithFeatureProps,
    IWithThemeProps<TTheme>,
    IWithLocationProps {
  allowClear?: boolean;
}

export interface IDataTableState<T> {
  extendedColumns?: IColumnProps<any>[];
  contextMenuColumn?: IColumnProps<T>;
  rowSelectionConfig: TableRowSelection<any> | undefined;
  dataSource: TExtendColumns<T>[] | undefined;
  isInitiation: boolean;
}
