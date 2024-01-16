import type { CSSProperties } from "react";
import type { ColumnProps, TableProps } from "antd/lib/table";
import type { Localization } from "@infomaximum/localization";
import type { Interpolation } from "@emotion/react";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";
import type { ScrollParams } from "react-virtualized";
import type { IVirtualizedTableProps } from "../VirtualizedTable/VirtualizedTable.types";

export interface IBaseColumnConfig<T> extends Omit<ColumnProps<T>, "children"> {
  children?: IBaseColumnConfig<T>[] | null;
}

type TTableProps<T> = Omit<TableProps<T>, "columns">;

export interface ITableOwnProps<T>
  extends TTableProps<T>,
    Pick<IVirtualizedTableProps<T>, "targetAll" | "rowHeight"> {
  localization: Localization;
  onScroll?(params: ScrollParams): void;
  scrollTop?: number;
  isVirtualized?: boolean;
  isSearchEmpty?: boolean;
  isFiltersEmpty?: boolean;
  emptyDescription?: string;
  /** Подсказка пользователю, когда "нет данных" */
  emptyHint?: string;
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
}

export interface ITableProps<T> extends IWithThemeProps<TTheme>, ITableOwnProps<T> {}

export type TTableOpacity = CSSProperties["opacity"];

export interface ITableState {
  isExpandableTable: boolean | undefined;
  tableOpacity: TTableOpacity;
}
