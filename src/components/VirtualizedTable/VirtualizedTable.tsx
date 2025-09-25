import { createRef, PureComponent } from "react";
import type { ListRowProps, List as VList } from "react-virtualized";
import {
  getEmptyContentStyle,
  loaderWrapperStyle,
  getTableWrapperStyle,
  bodyRowStyle,
} from "./VirtualizedTable.styles";
import { Row } from "antd";
import type {
  IVirtualizedColumnConfig,
  IVirtualizedTableOwnProps,
  IVirtualizedTableProps,
  IVirtualizedTableState,
  TRow,
} from "./VirtualizedTable.types";
import {
  forEach,
  isEmpty,
  without,
  concat,
  intersection,
  indexOf,
  get,
  set,
  includes,
  isFunction,
  filter,
  take,
  isUndefined,
} from "lodash";
import {
  virtualizedTableRowTestId,
  virtualizedTableTestId,
} from "@infomaximum/base/src/utils/TestIds";
import { ESortDirection } from "@infomaximum/base/src/utils/const";
import { VirtualizedTableHeaderRow } from "./VirtualizedTableComponents/VirtualizedTableHeaderRow/VirtualizedTableHeaderRow";
import { VirtualizedTableBodyRow } from "./VirtualizedTableComponents/VirtualizedTableBodyRow/VirtualizedTableBodyRow";
import { VirtualizedTableBody } from "./VirtualizedTableComponents/VirtualizedTableBody/VirtualizedTableBody";
import { assertSimple } from "@infomaximum/assert";
import type { SorterResult, SortOrder } from "antd/lib/table/interface";
import { borderTopStyle } from "../Table/Table.styles";
import { observer } from "mobx-react";
import { RestModel } from "@infomaximum/base/src/models/RestModel";
import { withSpinPropsReplacer } from "./VirtualizedTable.utils";
import { withTheme } from "@infomaximum/base/src/decorators/hocs/withTheme";
import { GlobalSpinner } from "../Spinner/GlobalSpinner/GlobalSpinner";

const defaultOrders = [ESortDirection.ASC, ESortDirection.DESC] as [SortOrder, SortOrder];

/**
 * Таблица для виртуализированной отрисовки больших данных, стилизованная под AntTable и
 * реализующая часть интерфейса AntTable.
 */
class VirtualizedTableComponent<T extends TRow> extends PureComponent<
  IVirtualizedTableProps<T | null>,
  IVirtualizedTableState<T | null>
> {
  public static readonly defaultProps = {
    showHeader: true,
    indentSize: 20,
  };

  /**
   * Флаг, что список имеет хотя бы одну группу с вложенными элементами
   */
  private isTree: boolean = false;
  /**
   * Коллекция для быстрого определения состояния раскрытости узла дерева
   */
  private expandedRowKeysSet: Set<string | number> = new Set();
  /**
   * Коллекция коэффициентов отступов вложенных элементов относительно корня дерева
   */
  private indents: Map<string | number, number> = new Map();

  private vListRef: React.RefObject<VList> = createRef();

  constructor(props: IVirtualizedTableProps<T | null>) {
    super(props);

    this.state = {
      surfaceNodes: [],
      sorter: { order: false, field: undefined },
      columnsOrders: {},
      columnConfig: props.columns,
      scrollOffset: 0,
      selectedRowKeysSet: null,
      isCheckableDisabled: true,
      initialScrollTop: undefined,
    };
  }

  public override componentDidMount() {
    const { columns, rowSelection } = this.props;

    // установка при монтировании значения скролла для данных из пропса
    this.setState({ initialScrollTop: this.props.scrollTop });

    if (columns) {
      this.updateSurfaceNodes();
      this.updateColumnsSortOrders(columns);
    }

    this.setState({
      selectedRowKeysSet: new Set(rowSelection?.selectedRowKeys as Iterable<string>),
    });
  }

  public override componentDidUpdate(prevProps: IVirtualizedTableProps<T | null>) {
    const { rowSelection, dataSource, expandable, loading, columns, rowHeight } = this.props;

    // при неменяющемся пропсе и заданном значении скрола, устнавливаем его в undef, дабы не мешать работать
    if (prevProps.scrollTop === this.props.scrollTop && this.state.initialScrollTop !== undefined) {
      this.setState({ initialScrollTop: undefined });
    }

    if (prevProps.rowSelection !== rowSelection) {
      this.setState(
        {
          selectedRowKeysSet: new Set(rowSelection?.selectedRowKeys as Iterable<string>),
        },
        () => {
          this.vListRef.current?.forceUpdateGrid();
        }
      );
    }

    if (prevProps.loading !== loading) {
      this.vListRef.current?.forceUpdateGrid();
    }

    if (prevProps.rowHeight !== rowHeight) {
      this.vListRef.current?.recomputeGridSize();
    }

    if (
      prevProps.dataSource !== dataSource ||
      prevProps.expandable?.expandedRowKeys !== expandable?.expandedRowKeys
    ) {
      this.updateSurfaceNodes();
      this.vListRef.current?.forceUpdateGrid();
    }

    if (prevProps.columns !== columns) {
      this.setState(
        {
          columnConfig: columns,
        },
        () => {
          this.updateColumnsSortOrders(columns);
          this.updateSurfaceNodes();
          this.vListRef.current?.forceUpdateGrid();
        }
      );
    }
  }

  public addScrollOffset = (offset: number) => {
    if (this.state.scrollOffset !== offset) {
      this.setState({ scrollOffset: offset });
    }
  };

  private updateColumnsSortOrders(columns: IVirtualizedTableProps<T | null>["columns"]) {
    let previousKey: string | number;

    const columnsOrders: IVirtualizedTableState<T | null>["columnsOrders"] = {};

    forEach(columns, (column) => {
      const { sorter: isSorter, key, sortDirections, sortOrder } = column;

      if (isSorter && key) {
        set(
          columnsOrders,
          key,
          sortDirections ? intersection(defaultOrders, sortDirections) : defaultOrders
        );
      }

      if (sortOrder && key) {
        assertSimple(
          !previousKey,
          "Назначить сортировку по-умолчанию можно только для одной колонки"
        );

        previousKey = key;

        const columnOrders = get(columnsOrders, key);

        const i = indexOf(columnOrders, sortOrder);
        assertSimple(i !== -1, "Задана недопустимая сортировка по-умолчанию");

        this.setState({ sorter: { order: columnOrders[i], field: key } });
      }
    });

    this.setState({ columnsOrders });
  }

  private getNextSortOrder(columnKey: string | number) {
    const columnOrders: SortOrder[] = get(this.state.columnsOrders, columnKey);

    const {
      sorter: { field, order },
    } = this.state;

    let newSortIndex: number;

    if (columnKey === field) {
      const currentSortIndex = indexOf(defaultOrders, order);
      assertSimple(
        currentSortIndex !== -1,
        "Попытка установить некорректное направление сортировки"
      );

      newSortIndex = currentSortIndex === columnOrders.length ? 0 : currentSortIndex + 1;
    } else {
      newSortIndex = 0;
    }

    return newSortIndex === columnOrders.length ? false : columnOrders[newSortIndex];
  }

  private updateSurfaceNodes() {
    const { dataSource, expandable } = this.props;

    const { expandedRowKeys } = expandable || {};

    this.expandedRowKeysSet = new Set(expandedRowKeys as Iterable<string>);

    this.isTree = false;

    const surfaceNodes: T[] = [];

    const traverseTree = (treeNodes: readonly (T | null)[] | undefined, depth = 0) => {
      forEach(treeNodes, (treeNode) => {
        if (!treeNode) {
          return;
        }

        const { children, key } = treeNode;

        /**
         * Для расчета отступа элемента
         */
        key && this.indents.set(key, depth);

        surfaceNodes.push(treeNode);

        if (children) {
          if (!this.isTree) {
            this.isTree = true;
          }

          if (key && this.expandedRowKeysSet.has(key)) {
            traverseTree(children as T[], depth + 1);
          }
        }
      });
    };

    traverseTree(dataSource);
    const isCheckableDisabled = this.areAllCheckboxesDisabled(surfaceNodes);

    this.setState({ surfaceNodes, isCheckableDisabled });
  }

  private areAllCheckboxesDisabled = (surfaceNodes: T[]): boolean => {
    const { rowSelection, dataSource } = this.props;

    if (!rowSelection || !dataSource) {
      return true;
    }

    return surfaceNodes.every((record) => {
      const checkboxProps = rowSelection.getCheckboxProps?.(record) ?? {};

      return checkboxProps.disabled;
    });
  };

  private handleSorterChange = (column: IVirtualizedColumnConfig<T | null>) => {
    const { surfaceNodes } = this.state;
    const { multipleRowSelectionConfig } = this.props;
    const key = column?.key;

    const order = key ? this.getNextSortOrder(key) : undefined;
    const field = order === false ? undefined : key;

    const sorter = {
      column,
      order: order || undefined,
      field,
      columnKey: key,
    };

    if (surfaceNodes.length) {
      /* Фильтры, пагинация и extra еще не реализованы */
      this.props.onChange?.(null!, null!, sorter as SorterResult<T | null>, null!);
    }

    this.setState({ sorter: { field, order } });
    multipleRowSelectionConfig?.updateLastSelectedIndex(null);
    this.vListRef.current?.forceUpdateGrid();
  };

  private handleSelectMultipleChange = (index: number) => {
    const { rowSelection, multipleRowSelectionConfig } = this.props;

    const onChange = rowSelection?.onChange;
    const dataSource = this.props.dataSource?.map((row) =>
      rowSelection?.getCheckboxProps?.(row).disabled ? null : row
    );
    const selectedRowKeysSet = this.state.selectedRowKeysSet;

    const changedKeys = multipleRowSelectionConfig?.handleMultipleSelect(
      index,
      dataSource,
      selectedRowKeysSet
    );

    if (isFunction(onChange) && !isUndefined(changedKeys) && !isUndefined(dataSource)) {
      const selectedRows = dataSource?.filter((row) =>
        !isUndefined(row?.key) ? selectedRowKeysSet?.has(row?.key) : false
      );

      onChange(changedKeys, selectedRows, { type: "multiple" });
    }
  };

  private handleSelectChange = (record: T | null, isChecking: boolean, index?: number) => {
    const { rowSelection, dataSource, multipleRowSelectionConfig } = this.props;

    const onSelect = rowSelection?.onSelect;
    const onSelectAll = rowSelection?.onSelectAll;

    if (record) {
      const selectedRows = filter(dataSource, (item) =>
        includes(rowSelection?.selectedRowKeys, item?.key)
      );

      if (isChecking) {
        selectedRows.push(record);

        if (!isUndefined(index)) {
          multipleRowSelectionConfig?.updateLastSelectedIndex(index);
        }
      } else {
        multipleRowSelectionConfig?.updateLastSelectedIndex(null);
      }

      if (isFunction(onSelect)) {
        onSelect(record, isChecking, selectedRows, undefined!);
      }
    } else {
      if (isFunction(onSelectAll)) {
        onSelectAll(isChecking, undefined!, undefined!);
      }

      multipleRowSelectionConfig?.updateLastSelectedIndex(null);
    }
  };

  private handleRowExpanderChange = (key: string, isOpening: boolean) => {
    const { expandable } = this.props;

    const _expandedRowKeys = expandable?.expandedRowKeys;
    const _onExpandedRowsChange = expandable?.onExpandedRowsChange;

    const newExpandedRowKeys = isOpening
      ? concat(_expandedRowKeys as string[], key)
      : without(_expandedRowKeys as string[], key);

    _onExpandedRowsChange?.(newExpandedRowKeys);
  };

  private stretchColumn(
    column: IVirtualizedColumnConfig<T | null>
  ): IVirtualizedColumnConfig<T | null> {
    return { ...column, width: "100%" };
  }

  /**
   * Отрисовывает каждую строку, попадающую во Viewport
   */
  private rowRenderer = ({ index, key, style }: ListRowProps) => {
    const {
      rowSelection,
      loading,
      indentSize,
      enableRowClick,
      isShowDividers,
      onRow,
      isWithoutWrapperStyles,
      floatingContextMenuConfig,
    } = this.props;
    const { surfaceNodes, columnConfig, selectedRowKeysSet } = this.state;

    const record = surfaceNodes[index] ?? null;

    const checkboxProps = rowSelection?.getCheckboxProps?.(record) ?? {};

    const hasExpander = this.isTree && !isEmpty(record?.children);

    const isExpanded = !!record?.key && hasExpander && this.expandedRowKeysSet.has(record.key);

    const isEnableRowClick =
      !!record?.model && enableRowClick && !(record.model instanceof RestModel);

    const columns =
      record?.model instanceof RestModel
        ? take(columnConfig).map(this.stretchColumn)
        : columnConfig;

    return (
      <div key={key} style={style} css={bodyRowStyle} test-id={virtualizedTableRowTestId}>
        <VirtualizedTableBodyRow
          index={index}
          onRow={onRow}
          columns={columns}
          record={record}
          loading={Boolean(loading)}
          isCheckable={Boolean(rowSelection)}
          isChecked={
            !!record?.key && !!selectedRowKeysSet?.has(record.key) && !checkboxProps.disabled
          }
          onSelectChange={this.handleSelectChange}
          onSelectMultipleChange={this.handleSelectMultipleChange}
          selectionType={rowSelection?.type}
          getCheckboxProps={rowSelection?.getCheckboxProps}
          indentLeft={
            !!record?.key && indentSize ? indentSize * (this.indents.get(record.key) ?? 0) : 0
          }
          hasExpander={hasExpander}
          isExpanded={isExpanded}
          isTree={this.isTree}
          onExpanderChange={this.handleRowExpanderChange}
          enableRowClick={isEnableRowClick}
          isShowDivider={isShowDividers}
          isWithoutWrapperStyles={isWithoutWrapperStyles}
          floatingContextMenuConfig={floatingContextMenuConfig}
        />
      </div>
    );
  };

  public get loader() {
    return this.props.loading ? (
      <Row key="loader" justify="center" align="middle" css={loaderWrapperStyle}>
        <GlobalSpinner delay={0} />
      </Row>
    ) : null;
  }

  public override render() {
    const { sorter, columnsOrders, columnConfig, isCheckableDisabled, initialScrollTop } =
      this.state;
    const {
      showHeader,
      rowSelection,
      targetAll,
      loading,
      isShowDividers,
      scrollAreaHeight,
      empty,
      onScroll,
      theme,
      rowHeight,
      isWithoutWrapperStyles,
    } = this.props;

    const itemsCount = this.state.surfaceNodes.length;

    return (
      <div test-id={virtualizedTableTestId} css={getTableWrapperStyle(isWithoutWrapperStyles)}>
        {showHeader && (
          <VirtualizedTableHeaderRow<T>
            key="header"
            checkableColumnTitle={rowSelection?.columnTitle}
            isTableEmpty={!itemsCount}
            isCheckable={Boolean(rowSelection)}
            isSelectionEmpty={isEmpty(rowSelection?.selectedRowKeys)}
            sorter={sorter}
            onSorterChange={this.handleSorterChange}
            onSelectChange={this.handleSelectChange}
            targetAll={targetAll}
            columns={columnConfig}
            columnsOrders={columnsOrders}
            loading={loading}
            scrollOffset={this.state.scrollOffset}
            isShowDivider={isShowDividers}
            hideSelectAll={rowSelection?.hideSelectAll}
            isCheckableDisabled={isCheckableDisabled}
          />
        )}
        {this.loader}
        {!showHeader && isShowDividers ? <div css={borderTopStyle(theme)} /> : null}
        {itemsCount ? (
          <VirtualizedTableBody
            vListRef={this.vListRef}
            rowRenderer={this.rowRenderer}
            itemsCount={itemsCount}
            scrollAreaHeight={scrollAreaHeight}
            addScrollOffset={this.addScrollOffset}
            onScroll={onScroll}
            rowHeight={rowHeight}
            scrollTop={initialScrollTop}
            isWithoutWrapperStyles={isWithoutWrapperStyles}
          />
        ) : (
          <div key="empty" css={getEmptyContentStyle(scrollAreaHeight, Boolean(loading))}>
            {empty}
          </div>
        )}
      </div>
    );
  }
}

export const VirtualizedTable = observer(
  withTheme(withSpinPropsReplacer(VirtualizedTableComponent))
) as <T>(props: IVirtualizedTableOwnProps<T | null>) => JSX.Element;
