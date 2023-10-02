import { createRef, PureComponent } from "react";
import type { ListRowProps, List as VList } from "react-virtualized";
import { getEmptyContentStyle, loaderWrapperStyle } from "./VirtualizedTable.styles";
import { Spin, Row, Col } from "antd";
import type {
  IVirtualizedColumnConfig,
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
} from "lodash";
import { virtualizedTableRowTestId, virtualizedTableTestId } from "../../utils/TestIds";
import { ESortDirection } from "../../utils/const";
import { VirtualizedTableHeaderRow } from "./VirtualizedTableComponents/VirtualizedTableHeaderRow/VirtualizedTableHeaderRow";
import { VirtualizedTableBodyRow } from "./VirtualizedTableComponents/VirtualizedTableBodyRow/VirtualizedTableBodyRow";
import { VirtualizedTableBody } from "./VirtualizedTableComponents/VirtualizedTableBody/VirtualizedTableBody";
import { assertSimple } from "@infomaximum/assert";
import type { SorterResult, SortOrder } from "antd/lib/table/interface";
import { borderTopStyle } from "../Table/Table.styles";
import { observer } from "mobx-react";
import { RestModel } from "../../models/RestModel";
import { withSpinPropsReplacer } from "./VirtualizedTable.utils";
import { withTheme } from "../../decorators";

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

  constructor(props: IVirtualizedTableProps<T>) {
    super(props);

    this.state = {
      surfaceNodes: [],
      sorter: { order: false, field: undefined },
      columnsOrders: {},
      columnConfig: props.columns,
      scrollOffset: 0,
      selectedRowKeysSet: null,
    };
  }

  public override componentDidMount() {
    const { columns, rowSelection } = this.props;

    if (columns) {
      this.updateSurfaceNodes();
      this.updateColumnsSortOrders(columns);
    }

    this.setState({
      selectedRowKeysSet: new Set(rowSelection?.selectedRowKeys as Iterable<string>),
    });
  }

  public override componentDidUpdate(prevProps: IVirtualizedTableProps<T | null>) {
    const { rowSelection, dataSource, expandedRowKeys, loading, columns, rowHeight } = this.props;

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

    if (prevProps.dataSource !== dataSource || prevProps.expandedRowKeys !== expandedRowKeys) {
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
    const { dataSource, expandedRowKeys } = this.props;

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

    this.setState({ surfaceNodes });
  }

  private handleSorterChange = (column: SorterResult<T | null>["column"]) => {
    const { surfaceNodes } = this.state;
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
    this.vListRef.current?.forceUpdateGrid();
  };

  private handleSelectChange = (record: T | null, isChecking: boolean) => {
    const { rowSelection, dataSource } = this.props;

    const onSelect = rowSelection?.onSelect;
    const onSelectAll = rowSelection?.onSelectAll;

    if (record) {
      const selectedRows = filter(dataSource, (item) =>
        includes(rowSelection?.selectedRowKeys, item?.key)
      );
      if (isChecking) {
        selectedRows.push(record);
      }

      if (isFunction(onSelect)) {
        onSelect(record, isChecking, selectedRows, undefined!);
      }
    } else {
      if (isFunction(onSelectAll)) {
        onSelectAll(isChecking, undefined!, undefined!);
      }
    }
  };

  private handleRowExpanderChange = (key: string, isOpening: boolean) => {
    const { expandedRowKeys, onExpandedRowsChange } = this.props;

    const newExpandedRowKeys = isOpening
      ? concat(expandedRowKeys as string[], key)
      : without(expandedRowKeys as string[], key);

    onExpandedRowsChange?.(newExpandedRowKeys);
  };

  private stretchColumn(column: IVirtualizedColumnConfig<T>): IVirtualizedColumnConfig<T> {
    return { ...column, width: "100%" };
  }

  /**
   * Отрисовывает каждую строку, попадающую во Viewport
   */
  private rowRenderer = ({ index, key, style }: ListRowProps) => {
    const { rowSelection, loading, indentSize, enableRowClick, isShowDividers, onRow } = this.props;
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
      <div key={key} style={style} test-id={virtualizedTableRowTestId}>
        <VirtualizedTableBodyRow
          index={index}
          onRow={onRow}
          columns={columns}
          record={record}
          loading={Boolean(loading)}
          isCheckable={Boolean(rowSelection)}
          isChecked={!!record?.key && !!selectedRowKeysSet?.has(record.key)}
          onSelectChange={this.handleSelectChange}
          selectionType={rowSelection?.type}
          checkboxProps={checkboxProps}
          indentLeft={
            !!record?.key && indentSize ? indentSize * (this.indents.get(record.key) ?? 0) : 0
          }
          hasExpander={hasExpander}
          isExpanded={isExpanded}
          isTree={this.isTree}
          onExpanderChange={this.handleRowExpanderChange}
          enableRowClick={isEnableRowClick}
          isShowDivider={isShowDividers}
        />
      </div>
    );
  };

  public get loader() {
    return this.props.loading ? (
      <Row key="loader" justify="center" align="middle" css={loaderWrapperStyle}>
        <Col>
          <Spin />
        </Col>
      </Row>
    ) : null;
  }

  public override render() {
    const { sorter, columnsOrders, columnConfig } = this.state;
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
      scrollTop,
    } = this.props;

    const itemsCount = this.state.surfaceNodes.length;

    return (
      <div test-id={virtualizedTableTestId}>
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
            scrollTop={scrollTop}
          />
        ) : (
          <div key="empty" css={getEmptyContentStyle(scrollAreaHeight)}>
            {empty}
          </div>
        )}
      </div>
    );
  }
}

export const VirtualizedTable = observer(
  withTheme(withSpinPropsReplacer(VirtualizedTableComponent))
);
