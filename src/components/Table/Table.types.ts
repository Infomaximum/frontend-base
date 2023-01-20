import type { ColumnProps, TableProps } from "antd/lib/table";
import type { IWithThemeProps, Localization } from "@im/utils";
import type { Interpolation } from "@emotion/react";

export interface IBaseColumnConfig<T> extends Omit<ColumnProps<T>, "children"> {
  children?: IBaseColumnConfig<T>[] | null;
}

type TTableProps<T> = Omit<TableProps<T>, "pagination" | "columns">;

export interface ITableOwnProps<T> extends TTableProps<T> {
  localization: Localization;
  targetAll?: boolean;
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
}

export interface ITableProps<T> extends IWithThemeProps<TTheme>, ITableOwnProps<T> {}

export interface ITableState {
  isExpandableTable: boolean | undefined;
}
