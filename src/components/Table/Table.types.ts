import type { CSSProperties } from "react";
import type { ColumnProps, TableProps } from "antd/lib/table";
import type { Localization } from "@infomaximum/localization";
import type { Interpolation } from "@emotion/react";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";
import type { ScrollParams } from "react-virtualized";
import type { IVirtualizedTableProps } from "../VirtualizedTable/VirtualizedTable.types";

export interface IBaseColumnConfig<T>
  extends Omit<ColumnProps<T>, "children" | "key" | "dataIndex"> {
  children?: IBaseColumnConfig<T>[] | null;
  dataIndex?: string;
  priority?: number;
  key?: string | number;
}

type TTableProps<T> = Omit<TableProps<T>, "columns" | "onScroll" | "rowKey">;

export interface ITableOwnProps<T>
  extends TTableProps<T>,
    Pick<IVirtualizedTableProps<T>, "targetAll" | "rowHeight"> {
  rowKey?: string;
  localization: Localization;
  onScroll?(params: ScrollParams): void;
  scrollTop?: number;
  isVirtualized?: boolean;
  isSearchEmpty?: boolean;
  isFiltersEmpty?: boolean;
  emptyDescription?: string | JSX.Element;
  emptyImage?: React.ReactNode;
  /** Подсказка пользователю, когда "нет данных" */
  emptyHint?: string | JSX.Element;
  columns?: IBaseColumnConfig<T>[];
  customStyle?: Interpolation<TTheme>;
  customEmptyContent?: JSX.Element;
  customEmptyTableStyle?: Interpolation<TTheme>;
  enableRowClick?: boolean;
  /** Первоначальная проверка на expandable. prevProps.dataSource !== this.props.dataSource не отрабатывает
   * в невиртуализированныx древовидных DataTable
   */
  isNeedCheckExpandable?: boolean;
  isShowDividers?: boolean;

  /** Включить высоту области прокрутки по высоте родительского flex блока */
  isStretchByParent?: boolean;
  /** Включить высоту области прокрутки до нижнего края экрана */
  isStretchToBottom?: boolean;
  /** Показывать полосу сверху между шапкой и содержимым таблицы */
  isShowTopBorder?: boolean;
  /** Отключить стили таблицы новой навигации */
  isWithoutWrapperStyles?: boolean;
}

export interface ITableProps<T> extends IWithThemeProps<TTheme>, ITableOwnProps<T> {}

export type TTableOpacity = CSSProperties["opacity"];

export interface ITableState {
  isExpandableTable: boolean | undefined;
  tableOpacity: TTableOpacity;
}
