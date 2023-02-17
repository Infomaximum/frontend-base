import React, { Component } from "react";
import type { ITableOwnProps, ITableProps, ITableState } from "./Table.types";
import type { RenderExpandIconProps } from "rc-table/lib/interface";
import { Table as AntTable, ConfigProvider } from "antd";
import { VirtualizedTable } from "../VirtualizedTable/VirtualizedTable";
import {
  isEmpty,
  some,
  isBoolean,
  isUndefined,
  merge,
  has,
  includes,
  filter,
  isFunction,
} from "lodash";
import { emptyTableStyle, borderTopStyle, transparentBordersStyle } from "./Table.styles";
import { type Interpolation, withTheme } from "@emotion/react";
import { Empty } from "../Empty/Empty";
import { observer } from "mobx-react";
import { TableContainer } from "./TableComponents/TableContainer/TableContainer";
import { TableBodyRow } from "./TableComponents/TableBodyRow/TableBodyRow";
import { TableBodyWrapper } from "./TableComponents/TableBodyWrapper/TableBodyWrapper";
import { TableBodyCell } from "./TableComponents/TableBodyCell/TableBodyCell";
import { TableHeaderRow } from "./TableComponents/TableHeaderRow/TableHeaderRow";
import { TableHeaderCell } from "./TableComponents/TableHeaderCell/TableHeaderCell";
import { TableHeaderWrapper } from "./TableComponents/TableHeaderWrapper/TableHeaderWrapper";
import { TableExpandIcon } from "./TableComponents/TableExpandIcon/TableExpandIcon";
import { TableCheckboxCell } from "./TableComponents/TableCheckboxCell/TableCheckboxCell";
import { createSelector } from "reselect";
import { TABLE_HEADER_ID, loaderDelay } from "../../utils/const";
import { AutoSizer } from "react-virtualized";
import { cssStyleConversion } from "../../styles";

class TableComponent<T extends TDictionary> extends Component<ITableProps<T>, ITableState> {
  public static defaultProps = {
    isShowDividers: true,
    showHeader: true,
    isStretchByParent: true,
    isStretchToBottom: false,
  };

  private wrapperRef = React.createRef<HTMLDivElement>();
  private headerHtml: HTMLElement | null = null;

  private expandable: ITableProps<T>["expandable"] = {
    expandIcon: (props: RenderExpandIconProps<T>) => <TableExpandIcon {...props} />,
  };

  private components: ITableProps<T>["components"] = {
    table: TableContainer,
    body: {
      wrapper: TableBodyWrapper,
      row: TableBodyRow,
      cell: TableBodyCell,
    },
    header: {
      wrapper: TableHeaderWrapper,
      row: TableHeaderRow,
      cell: TableHeaderCell,
    },
  };

  public override state: ITableState = {
    isExpandableTable: undefined,
  };

  public override componentDidMount() {
    if (this.wrapperRef.current) {
      this.headerHtml = this.wrapperRef.current.querySelector(`[id=${TABLE_HEADER_ID}]`);

      if (this.props.isStretchToBottom) {
        window.addEventListener("resize", this.updateOnResize);
      }
    }
  }

  public override componentDidUpdate(prevProps: ITableProps<T>) {
    const { isNeedCheckExpandable } = this.props;
    const { isExpandableTable } = this.state;

    // todo: Виктор Пименов: пересмотреть этот фунционал
    if (
      (isNeedCheckExpandable && isUndefined(isExpandableTable)) ||
      prevProps.dataSource !== this.props.dataSource
    ) {
      this.setState({
        isExpandableTable: some(this.props.dataSource, (data) => data.children),
      });
    }
  }

  public override componentWillUnmount() {
    window.removeEventListener("resize", this.updateOnResize);
  }

  private getTableComponents = createSelector(
    (components: ITableProps<T>["components"]) => components,
    (components) => merge(this.components, components)
  );

  private getRowSelectionConfig = createSelector(
    (rowSelection: ITableProps<T>["rowSelection"]) => rowSelection,
    (rowSelection) =>
      rowSelection
        ? {
            renderCell: this.renderCheckboxCell,
            columnWidth: this.props.theme.tableCheckboxColumnWidth,
            ...rowSelection,
          }
        : undefined
  );

  private getSpinProps = createSelector(
    ({ loading }: ITableProps<T>) => loading,
    (loading) => {
      if (isBoolean(loading)) {
        return { spinning: loading, delay: loaderDelay };
      }

      if (loading) {
        return loading;
      }

      return false;
    }
  );

  private replaceScrollAreaHeight = createSelector(
    (y) => y,
    (y: number, scroll: ITableOwnProps<T>["scroll"]) => scroll,
    (y: number, scroll: ITableOwnProps<T>["scroll"]) => ({ ...scroll, y } as const)
  );

  private get headerHeight() {
    const { showHeader, theme } = this.props;

    if (!showHeader) {
      return 0;
    }

    return this.headerHtml ? this.headerHtml.offsetHeight : theme.commonTableRowHeight;
  }

  public updateOnResize = () => {
    this.forceUpdate();
  };

  private getEmpty = () => {
    const {
      isFiltersEmpty,
      isSearchEmpty,
      emptyDescription,
      emptyHint,
      loading,
      customEmptyTableStyle,
      customEmptyContent,
    } = this.props;

    let isLoading = false;

    if (isBoolean(loading)) {
      isLoading = loading;
    } else {
      isLoading = !!loading?.spinning;
    }

    return (
      <Empty
        isFiltersEmpty={isFiltersEmpty}
        isSearchEmpty={isSearchEmpty}
        isTableComponent={true}
        description={emptyDescription}
        hint={emptyHint}
        emptyContent={isLoading ? null : customEmptyContent}
        customEmptyTableStyle={customEmptyTableStyle}
      />
    );
  };

  private handleRow = (record: T, index: number) => {
    const { onRow, rowSelection, enableRowClick, dataSource } = this.props;

    const rowProps = isFunction(onRow) ? onRow?.(record, index) : null;

    const checkBoxProps = rowSelection?.getCheckboxProps?.(record);

    const newRowProps = {
      ...rowProps,
    };

    if (enableRowClick && !newRowProps.onClick && !checkBoxProps?.disabled) {
      const isSelected = includes(rowSelection?.selectedRowKeys, record.key);

      const selectedRows = filter(dataSource, (item) =>
        includes(rowSelection?.selectedRowKeys, item.key)
      );

      newRowProps.onClick = (e) => {
        e.preventDefault();
        rowSelection?.onSelect?.(record, !isSelected, selectedRows, e.nativeEvent);
      };

      newRowProps.style = {
        ...newRowProps.style,
        cursor: "pointer",
      };
    }

    return newRowProps;
  };

  private getStyleTable = (): Interpolation<TTheme> => {
    const { dataSource, customStyle, isShowDividers, theme } = this.props;

    const styles: Interpolation<TTheme>[] = [];

    if (!dataSource || isEmpty(dataSource)) {
      styles.push(emptyTableStyle);
    } else {
      styles.push(cssStyleConversion(theme, customStyle));
    }

    if (!isShowDividers) {
      styles.push(transparentBordersStyle);
    }

    return styles;
  };

  private get wrapperStyle() {
    return this.props.isStretchToBottom
      ? { height: this.defineDistanceToBottom() }
      : this.props.isStretchByParent
      ? { flexGrow: 1 }
      : undefined;
  }

  /** Определить расстояние от верхнего края таблицы до нижнего края страницы */
  private defineDistanceToBottom() {
    return this.wrapperRef.current
      ? window.innerHeight - this.wrapperRef.current.getBoundingClientRect().top
      : 0;
  }

  private renderCheckboxCell(value: boolean, record: T, index: number, children: React.ReactNode) {
    return <TableCheckboxCell>{children}</TableCheckboxCell>;
  }

  public override render() {
    const {
      localization,
      isVirtualized,
      columns,
      isFiltersEmpty,
      isSearchEmpty,
      rowSelection,
      components,
      isShowDividers,
      isStretchByParent,
      isStretchToBottom,
      ...rest
    } = this.props;

    const loading = this.getSpinProps(this.props);

    /** Передана ли явно высота области прокрутки */
    const isExplicitHeight = has(this.props.scroll, "y");
    const isStretchedHeight = !isExplicitHeight && (isStretchByParent || isStretchToBottom);

    return (
      <div style={this.wrapperStyle} ref={this.wrapperRef}>
        <AutoSizer disableWidth={true} disableHeight={!isStretchedHeight}>
          {({ height }) => {
            // Делаем запас в 1px для корректной работы при разных масштабах окна браузера
            const scrollAreaHeight = height - this.headerHeight - 1;

            const scroll = isStretchedHeight
              ? this.replaceScrollAreaHeight(scrollAreaHeight, this.props.scroll)
              : this.props.scroll;

            return isVirtualized ? (
              <VirtualizedTable
                {...rest}
                isShowDividers={isShowDividers ?? true}
                columns={columns}
                localization={localization}
                loading={loading}
                rowSelection={rowSelection}
                scrollAreaHeight={scroll?.y as number}
                empty={this.getEmpty()}
              />
            ) : (
              <ConfigProvider renderEmpty={this.getEmpty}>
                {rest.showHeader !== undefined && !rest.showHeader ? (
                  <div css={borderTopStyle(this.props.theme)} />
                ) : null}
                <AntTable<T>
                  {...rest}
                  css={this.getStyleTable()}
                  loading={loading}
                  columns={columns}
                  showSorterTooltip={false}
                  expandable={this.state.isExpandableTable ? this.expandable : undefined}
                  components={this.getTableComponents(components)}
                  rowSelection={this.getRowSelectionConfig(rowSelection)}
                  scroll={scroll}
                  pagination={false}
                  onRow={this.handleRow}
                />
              </ConfigProvider>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}

const TableWithTheme = withTheme(observer(TableComponent));

export const Table = <T extends TDictionary>(props: ITableOwnProps<T>) => (
  <TableWithTheme {...props} />
);
