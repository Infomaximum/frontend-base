import React, { Component } from "react";
import type { ITableOwnProps, ITableProps, ITableState, TTableOpacity } from "./Table.types";
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
import {
  emptyTableStyle,
  borderTopStyle,
  transparentBordersStyle,
  getTableStyle,
  getAntTableSpinStyle,
  tableWrapperStyle,
} from "./Table.styles";
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
import { TABLE_HEADER_ID, leftMouseBtnCode, loaderDelay } from "../../utils/const";
import { AutoSizer } from "react-virtualized";
import { getCssConversionStyle } from "../../styles";
import { AntTableScrollListener } from "./Table.utils";
import type { IVirtualizedColumnConfig } from "../VirtualizedTable/VirtualizedTable.types";
import type { ExpandableConfig } from "antd/es/table/interface";

class TableComponent<T extends TDictionary> extends Component<ITableProps<T>, ITableState> {
  public static defaultProps = {
    isShowDividers: true,
    showHeader: true,
    isStretchByParent: true,
    isStretchToBottom: false,
    isShowTopBorder: true,
  };

  private wrapperRef = React.createRef<HTMLDivElement>();
  private headerHtml: HTMLElement | null = null;
  private antTableScrollListener: AntTableScrollListener | null = null;

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
    tableOpacity: 0,
  };

  public override componentDidMount() {
    if (this.wrapperRef.current) {
      this.headerHtml = this.wrapperRef.current.querySelector(`[id=${TABLE_HEADER_ID}]`);

      const { isVirtualized, onScroll } = this.props;

      if (!isVirtualized && onScroll) {
        this.antTableScrollListener = new AntTableScrollListener(this.wrapperRef.current, onScroll);
        this.antTableScrollListener.listen();
      }

      if (this.props.isStretchToBottom) {
        window.addEventListener("resize", this.updateOnResize);
      }
    }

    /**
     * TODO: этот костыль решает проблему появления head таблицы позже body,
     * что в свою очередь связано с работой ant design
     */
    queueMicrotask(() => this.setState({ tableOpacity: 1 }));
  }

  public override componentDidUpdate(prevProps: ITableProps<T>) {
    const { isNeedCheckExpandable } = this.props;
    const { isExpandableTable } = this.state;

    // todo: пересмотреть этот фунционал
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
    this.antTableScrollListener?.dispose();
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
            onCell: () => {
              return {
                onClick(event: React.MouseEvent) {
                  if (window.getSelection()?.toString()) {
                    event.stopPropagation();

                    return;
                  }
                },
                onMouseDown(e: React.MouseEvent) {
                  if (e.button === leftMouseBtnCode) {
                    window.getSelection()?.removeAllRanges();
                  }
                },
              };
            },
            ...rowSelection,
          }
        : undefined
  );

  private getSpinProps = createSelector(
    ({ loading }: ITableProps<T>) => loading,
    (loading) => {
      if (isBoolean(loading) && loading) {
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
    (y: number, scroll: ITableOwnProps<T>["scroll"]) => ({ ...scroll, y }) as const
  );

  private getAntSpinProps = createSelector(
    (headerHeight) => headerHeight,
    (headerHeight: number, loading: ITableOwnProps<T>["loading"]) => loading,
    (headerHeight: number, loading: ITableOwnProps<T>["loading"]) => ({
      style: getAntTableSpinStyle(headerHeight),
      ...(isBoolean(loading) ? { spinning: loading } : loading),
    })
  );

  private getAntTableExpandable = createSelector(
    (isExpandableTable) => isExpandableTable,
    (_: boolean | undefined, expandable: ExpandableConfig<T> | undefined) => expandable,
    (isExpandableTable, expandable) => {
      if (isExpandableTable && expandable) {
        return {
          ...this.expandable,
          ...expandable,
        };
      }

      if (isExpandableTable) {
        return this.expandable;
      }

      return expandable;
    }
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
      customEmptyTableStyle,
      customEmptyContent,
      emptyImage,
      loading,
      isVirtualized,
    } = this.props;

    const isLoading = isBoolean(loading) ? loading : !!loading?.spinning;

    return (
      <Empty
        isFiltersEmpty={isFiltersEmpty}
        isSearchEmpty={isSearchEmpty}
        isTableComponent={true}
        description={emptyDescription}
        hint={emptyHint}
        emptyContent={isLoading ? null : customEmptyContent}
        isLoading={isLoading}
        isVirtualized={isVirtualized}
        customEmptyTableStyle={customEmptyTableStyle}
        emptyImage={emptyImage}
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

        if (window.getSelection()?.toString()) {
          setTimeout(() => {
            rowSelection?.onSelect?.(record, !isSelected, selectedRows, e.nativeEvent);
          }, 0);

          return;
        }

        rowSelection?.onSelect?.(record, !isSelected, selectedRows, e.nativeEvent);
      };

      newRowProps.style = {
        ...newRowProps.style,
        cursor: "pointer",
      };
    }

    return newRowProps;
  };

  private getStyleTable = (opacity: TTableOpacity): Interpolation<TTheme> => {
    const { dataSource, customStyle, isShowDividers, theme, isWithoutWrapperStyles } = this.props;

    const styles: Interpolation<TTheme>[] = [getTableStyle(opacity, isWithoutWrapperStyles)];

    if (!dataSource || isEmpty(dataSource)) {
      styles.push(emptyTableStyle);
    } else {
      styles.push(getCssConversionStyle(theme, customStyle));
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
      onScroll,
      rowHeight,
      scrollTop,
      expandable,
      isWithoutWrapperStyles: isWithoutWrapperStylesProp,
      ...rest
    } = this.props;
    const { isExpandableTable } = this.state;

    const loading = this.getSpinProps(this.props);
    const antTableSpinProps = this.getAntSpinProps(
      this.wrapperRef.current?.getBoundingClientRect()?.top || 0,
      loading
    );

    /** Передана ли явно высота области прокрутки */
    const isExplicitHeight = has(this.props.scroll, "y");
    const isStretchedHeight = !isExplicitHeight && (isStretchByParent || isStretchToBottom);

    return (
      <div style={this.wrapperStyle} ref={this.wrapperRef} css={tableWrapperStyle}>
        <AutoSizer disableWidth={true} disableHeight={!isStretchedHeight}>
          {({ height }) => {
            // Делаем запас в 1px для корректной работы при разных масштабах окна браузера
            // Если без isWithoutWrapperStylesProp, то учитываем высоту верхнего паддинга
            const scrollAreaHeight =
              height - this.headerHeight - (isWithoutWrapperStylesProp ? 1 : 13);

            const scroll = isStretchedHeight
              ? this.replaceScrollAreaHeight(scrollAreaHeight, this.props.scroll)
              : this.props.scroll;

            return isVirtualized ? (
              <VirtualizedTable
                {...rest}
                rowHeight={rowHeight}
                isShowDividers={isShowDividers ?? true}
                columns={columns as IVirtualizedColumnConfig<any>[]}
                localization={localization}
                loading={loading}
                rowSelection={rowSelection}
                scrollAreaHeight={scroll?.y as number}
                empty={this.getEmpty()}
                onScroll={onScroll}
                scrollTop={scrollTop}
                expandable={expandable}
                isWithoutWrapperStyles={isWithoutWrapperStylesProp}
              />
            ) : (
              <ConfigProvider renderEmpty={this.getEmpty}>
                {rest.showHeader !== undefined && !rest.showHeader && rest.isShowTopBorder ? (
                  <div css={borderTopStyle(this.props.theme)} />
                ) : null}
                <AntTable<T>
                  pagination={false}
                  {...rest}
                  css={this.getStyleTable(this.state.tableOpacity)}
                  loading={antTableSpinProps}
                  columns={columns}
                  showSorterTooltip={false}
                  expandable={this.getAntTableExpandable(isExpandableTable, expandable)}
                  components={this.getTableComponents(components)}
                  rowSelection={this.getRowSelectionConfig(rowSelection)}
                  scroll={scroll}
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

const TableWithTheme = withTheme(observer(TableComponent)) as <T>(
  props: ITableOwnProps<T>
) => JSX.Element;

export const Table = <T extends TDictionary>(props: ITableOwnProps<T>) => (
  <TableWithTheme<T> {...props} />
);
