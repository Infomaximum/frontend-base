import React from "react";
import { isFunction, filter, drop, isEmpty, isUndefined, some, compact, uniq } from "lodash";
import { InvalidIndex } from "@infomaximum/utility";
import { hiddenCheckbox, weightLabelStyle, spinnerWrapperStyle } from "./DataTable.style";
import type { IDataTableProps, IDataTableState, IDataTableOwnProps } from "./DataTable.types";
import { DataTableHeader, headerModes } from "./DataTableHeader/DataTableHeader";
import { getColumnsWithShowMore } from "./DataTableUtils";
import type { TableRowSelection } from "antd/lib/table/interface";
import { observer } from "mobx-react";
import { type IReactionDisposer, reaction } from "mobx";
import { type TBaseRow, type TExtendColumns, TreeManager } from "../../managers/Tree";
import { goBackPath } from "../../utils/Routes/paths";
import { getBasePrefix } from "../../utils/URI/URI";
import { Group, type IModel } from "@infomaximum/graphql-model";
import { RestModel } from "../../models/RestModel";
import { isShowElement } from "../../utils/access";
import type { IColumnProps } from "../VirtualizedTable/VirtualizedTable.types";
import { sortByPriority } from "../../utils/Routes/routes";
import { contextMenuColumnKey } from "../../utils/const";
import type { TContextMenuItem } from "../ContextMenuTable/ContextMenuTable.types";
import { ContextMenuTable } from "../ContextMenuTable/ContextMenuTable";
import { Spinner } from "../Spinner/Spinner";
import { Table } from "../Table/Table";
import { withFeature } from "../../decorators/hocs/withFeature/withFeature";
import { withLoc } from "../../decorators/hocs/withLoc";
import { withTheme } from "../../decorators/hocs/withTheme";
import { withLocation } from "../../decorators";

const emptyColumnKey = "empty-column";

class DataTableComponent<T extends TBaseRow = TBaseRow> extends React.Component<
  IDataTableProps<T>,
  IDataTableState<T>
> {
  public static defaultProps: Readonly<Partial<IDataTableOwnProps<TBaseRow>>> = {
    selectionType: "checkbox",
    headerMode: headerModes.NONE,
    size: "middle",
    isGroupSelection: false,
    isCheckable: true,
    requestOnMount: true,
    clearOnUnmount: false,
    subscribeOnMount: true,
    unsubscribeOnUnmount: true,
    isFiltersEmpty: true,
    isExpandRowsAfterModelChange: true,
  };

  private static checkBoxProps = {
    empty: {},
    indeterminate: { indeterminate: true },
    disabled: { disabled: true },
  };

  private treeLogic: TreeManager;

  private blockedRowKeys?: string[] = [];

  private disposer: IReactionDisposer | undefined = undefined;

  private sourceTreeExpandedKeys: string[];

  public override readonly state: Readonly<IDataTableState<T>> = {
    extendedColumns: undefined,
    rowSelectionConfig: undefined,
    dataSource: undefined,
    isInitiation: true,
    contextMenuColumn: undefined,
  };

  constructor(props: IDataTableProps<T>) {
    super(props);
    const {
      isGroupSelection,
      invisibleRowKeys: erasedKeys,
      defaultCheckedModels,
      isCheckable,
      rowBuilder,
      tableStore,
      clearOnUnmount,
    } = props;

    this.disposer = this.getReaction();

    this.treeLogic = new TreeManager({
      defaultCheckedModels: defaultCheckedModels || tableStore.checkedState.accumulatedModels,
      isGroupSelection,
      erasedKeys,
      isCheckable,
      isFilteredTree: this.isFilteredTree,
      rowBuilder,
    });

    this.sourceTreeExpandedKeys = tableStore.expandedState;

    if (!clearOnUnmount) {
      this.listenLeavingOfRouteBranch(() => {
        // setTimeout, чтобы вызов очистки из componentWillUnmount не отменил данный вызов
        setTimeout(tableStore.clearData);
      });
    }
  }

  public override componentDidMount() {
    const {
      columns,
      requestOnMount,
      defaultCheckedModels,
      tableStore,
      contextMenuGetter,
      treeCheckedStateCleanSetter,
    } = this.props;

    if (isFunction(treeCheckedStateCleanSetter)) {
      treeCheckedStateCleanSetter(this.clearCheck);
    }

    if (!isUndefined(defaultCheckedModels) && !isEmpty(defaultCheckedModels)) {
      tableStore.setTopRowsModels(defaultCheckedModels, this.props.queryVariables);
    }

    if (tableStore.model) {
      this.onModelUpdate(true);
    }

    this.updateColumnConfig(columns);

    if (requestOnMount) {
      const checkedState = this.treeLogic.getCheckedStateDispatchData();
      tableStore.setCheckState(checkedState);

      this.requestTableData();
    }

    if (contextMenuGetter) {
      this.setState(
        {
          contextMenuColumn: this.getContextMenuColumn(),
        },
        () => {
          this.updateColumnConfig(columns);
        }
      );
    }
  }

  public override componentDidUpdate(prevProps: Readonly<IDataTableProps<T>>): void {
    const {
      columns,
      queryVariables,
      tableStore,
      editingState,
      contextMenuGetter,
      isFeatureEnabled,
    } = this.props;

    if (tableStore.model && prevProps.editingState !== editingState) {
      this.onModelUpdate(this.state.isInitiation);
    }
    // проверка на queryVariables, чтобы обновить их в "Показать еще" при обновлении columnConfig
    if (
      columns !== prevProps.columns ||
      queryVariables !== prevProps.queryVariables ||
      isFeatureEnabled !== prevProps.isFeatureEnabled
    ) {
      this.updateColumnConfig(columns);
    }

    if (
      contextMenuGetter !== prevProps.contextMenuGetter ||
      isFeatureEnabled !== prevProps.isFeatureEnabled
    ) {
      this.setState(
        {
          contextMenuColumn: this.getContextMenuColumn(),
        },
        () => {
          this.updateColumnConfig(columns);
        }
      );
    }

    if (isFeatureEnabled !== prevProps.isFeatureEnabled) {
      if (!this.isSelectAccess) {
        this.clearCheck();
      }

      this.applySelectionChange();
    }
  }

  public override componentWillUnmount() {
    const { tableStore, clearOnUnmount, unsubscribeOnUnmount } = this.props;

    this.disposer?.();

    if (unsubscribeOnUnmount && tableStore.isSubscribed) {
      tableStore.unsubscribe();
    }

    if (clearOnUnmount) {
      tableStore.clearData();
    } else {
      tableStore.clearData(["expandedState", "searchValue", "checkedState"]);
    }
  }

  /**
   * Подписаться на выход из ветки текущего route'а.
   * - переход в дочерний route не считается за выход (например, переход в профиль сущности);
   * - переход в соседний или родительский route считается за выход.
   */
  private listenLeavingOfRouteBranch(callback: () => void) {
    const sourcePathname = this.props.location.pathname;
    const dispose = this.props.listenLocationChange(({ location: { pathname } }) => {
      if (
        pathname.indexOf(`${getBasePrefix()}${sourcePathname}`) !== 0 &&
        pathname !== goBackPath
      ) {
        callback();
        dispose();
      }
    });
  }

  private getReaction() {
    const { tableStore } = this.props;
    const { isInitiation } = this.state;

    return reaction(
      () => ({
        treeModel: tableStore.model,
      }),
      (value, prevValue) => {
        if (isInitiation && !!prevValue.treeModel && !!value.treeModel) {
          this.setState({ isInitiation: false });
        }

        if (!prevValue.treeModel && value.treeModel) {
          this.onModelUpdate(true);
          this.expandRowsAfterModelChange();
        }

        if (prevValue.treeModel && prevValue.treeModel !== value.treeModel) {
          this.onModelUpdate(isInitiation);
          this.expandRowsAfterModelChange();
        }
      }
    );
  }

  private requestTableData = () => {
    const { queryVariables, subscribeOnMount, tableStore } = this.props;

    tableStore.requestData({
      variables: queryVariables,
    });

    if (subscribeOnMount && tableStore.isHasSubscription && !tableStore.isSubscribed) {
      tableStore.subscribe();
    }
  };

  private get isFilteredTree() {
    const { isFiltersEmpty, tableStore } = this.props;

    const isSearchEmpty = !tableStore.searchValue;

    return !isSearchEmpty || !isFiltersEmpty;
  }

  private isRestModel(model: IModel | undefined) {
    return model instanceof RestModel;
  }

  private get isShowCheckboxes() {
    return this.props.isCheckable && this.isSelectAccess;
  }

  private onModelUpdate(isInitiation: boolean) {
    const { editingState, tableStore } = this.props;
    const { isFilteredTree } = this;
    const addedRow = editingState?.addedRow;
    const addingRowMethod = editingState?.addingRowMethod;

    if (tableStore.model) {
      this.treeLogic.onModelChange(tableStore.model, {
        isFilteredTree,
        addedRow,
        addingRowMethod,
      });
    }

    if (this.isShowCheckboxes) {
      this.treeLogic.updateSelection(isInitiation);
      this.applySelectionChange();
    }

    this.setState({
      dataSource: this.treeLogic.preparedTreeData as TExtendColumns<T>[],
    });
  }

  /**
   * Применяет изменения выделения к таблице и кладет их в стор
   */
  private applySelectionChange() {
    const { tableStore, onCheckChange } = this.props;

    const checkedState = this.treeLogic.getCheckedStateDispatchData();

    onCheckChange?.(checkedState.accumulatedModels);

    tableStore.setCheckState(checkedState);

    this.updateRowSelectionConfig(checkedState.keys);
  }

  private expandRowsAfterModelChange() {
    const { tableStore, isExpandRowsAfterModelChange } = this.props;

    if (!tableStore.model || !tableStore.isTree) {
      return;
    }

    if (Boolean(tableStore.searchValue)) {
      const expandedKeys = this.treeLogic.defineExpandedKeysForFound();

      tableStore.expandRows(expandedKeys);
    } else if (isExpandRowsAfterModelChange) {
      this.sourceTreeExpandedKeys = uniq([
        tableStore.model.getInnerName(),
        ...this.treeLogic.defineExpandedKeysForSelected(),
        ...this.sourceTreeExpandedKeys,
      ]);

      tableStore.expandRows(this.sourceTreeExpandedKeys);
    }
  }

  /**
   * Метод используется, т.к. в onSelect нe отлавливается нажатие на header
   */
  private onSelectAll = (selected: boolean) => {
    this.onSelect(undefined, selected);
  };

  private onSelect = (record: TExtendColumns<T> | undefined, selected: boolean) => {
    if (this.isRestModel(record?.model)) {
      return;
    }

    const { selectionType } = this.props;

    this.treeLogic.handleSelect(record, selected, selectionType, this.blockedRowKeys);
    this.applySelectionChange();
  };

  private updateRowSelectionConfig = (selectedRowKeys: string[] | number[] | undefined) => {
    const { rowSelection, selectionType } = this.props;

    const rowSelectionConfig: TableRowSelection<T> | undefined = this.isShowCheckboxes
      ? {
          ...rowSelection,
          selectedRowKeys,
          type: selectionType,
          onSelect: this.onSelect,
          onSelectAll: this.onSelectAll,
          getCheckboxProps: this.getCheckboxProps,
        }
      : undefined;

    this.setState({
      rowSelectionConfig,
    });
  };

  private get isSelectAccess(): boolean {
    const { checkboxesAccessRules, isFeatureEnabled } = this.props;

    if (!checkboxesAccessRules) {
      return true;
    }

    return isFeatureEnabled ? isShowElement(checkboxesAccessRules, isFeatureEnabled) : false;
  }

  private getCheckboxProps = (record: TExtendColumns<T>) => {
    const { rowDisable } = this.props;

    const isRestModel = this.isRestModel(record.model);

    if (record.model && isFunction(rowDisable) && !isRestModel && rowDisable(record.model)) {
      this.blockedRowKeys?.push(record.model.getInnerName());
      return DataTableComponent.checkBoxProps.disabled;
    }

    if (this.treeLogic && this.treeLogic.isCheckIndeterminate(record)) {
      return DataTableComponent.checkBoxProps.indeterminate;
    }

    return isRestModel ? hiddenCheckbox : DataTableComponent.checkBoxProps.empty;
  };

  private clearCheck = () => {
    this.treeLogic.clearSelection();
    this.applySelectionChange();
  };

  private handleSearchChange = (inputValue: string) => {
    const { queryVariables, tableStore } = this.props;

    tableStore.searchValueChange(inputValue, queryVariables);
  };

  private handleExpandChange = (expandedRows: string[]) => {
    const { tableStore } = this.props;

    if (!tableStore.searchValue) {
      this.sourceTreeExpandedKeys = expandedRows;
    }

    tableStore.expandRows(expandedRows);
  };

  private updateColumnConfig = <T extends TBaseRow>(columns: IColumnProps<T>[] | undefined) => {
    const { sortColumnsByPriority, tableStore, limitStateName, queryVariables, showMoreMode } =
      this.props;

    const columnsWithShowMore = getColumnsWithShowMore(columns, {
      tableStore,
      limitStateName,
      queryVariables,
      mode: showMoreMode,
    });

    const extendedColumns = compact([
      columnsWithShowMore[0] ? this.getColumnWithBoldGroups(columnsWithShowMore[0]) : null,
      ...drop(columnsWithShowMore),
    ]);

    if (!!this.state.contextMenuColumn) {
      /* добавляем пустую колонку, чтобы она заняла все свободное пространство,
          и контекстное меню было всегда гарантированно справа (фиксит если заполненность < 100%) */
      const isAllColumnWithWidth = !some(extendedColumns, (col) => isUndefined(col.width));
      const shouldAddEmptyColumn = !extendedColumns.find((column) => column.key === emptyColumnKey);

      if (isAllColumnWithWidth && shouldAddEmptyColumn) {
        extendedColumns.push({ key: "empty-column" });
      }

      extendedColumns.push(this.state.contextMenuColumn);
    }

    this.setState({
      extendedColumns: sortColumnsByPriority ? sortByPriority(extendedColumns) : extendedColumns,
    });
  };

  /**
   * Возвращает колонку с контекстным меню, если есть доступ
   */
  private getContextMenuColumn(): IColumnProps<T> | undefined {
    const { contextMenuGetter, onContextMenuSelect, isFeatureEnabled, theme } = this.props;

    if (contextMenuGetter && onContextMenuSelect) {
      return {
        onCell() {
          return {
            style: {
              flexShrink: 0,
              justifyContent: "end",
              overflow: "hidden", // fix для IE
            },
          };
        },
        key: contextMenuColumnKey,
        dataIndex: contextMenuColumnKey,
        width: `${theme.tableContextMenuColumnWidth}px`,
        render: (text: string, record: T): React.ReactNode => {
          if (this.isRestModel(record.model)) {
            return null;
          }

          const filteredMenuItems: TContextMenuItem[] = filter(
            contextMenuGetter(record.model),
            (item) =>
              !item.accessRules ||
              (!!isFeatureEnabled && isShowElement(item.accessRules, isFeatureEnabled))
          );

          return (
            <ContextMenuTable
              items={filteredMenuItems}
              data={record}
              onSelect={onContextMenuSelect}
            />
          );
        },
        priority: InvalidIndex,
      };
    }
  }

  /**
   * Добавляет в колонку с моделью Group жирную обводку контента
   */
  private getColumnWithBoldGroups<T extends TBaseRow>(column: IColumnProps<T>): IColumnProps<T> {
    return {
      ...column,
      render(text: string, record: T, index: number) {
        const recordModel: IModel | undefined = record.model;

        const textNode: React.ReactNode =
          recordModel instanceof Group ? <span css={weightLabelStyle}>{text}</span> : text;

        if (column.render) {
          return column.render(textNode, record, index);
        }

        return textNode;
      },
    };
  }

  public override render() {
    const {
      size,
      loading,
      localization,
      showHeader,
      onRow,
      className,
      headerMode,
      headerButtonsGetter,
      isFeatureEnabled,
      editingState,
      allowClear,
      emptyHint,
      tableStore,
      isShowDividers,
      searchPlaceholder,
      customDataSource,
      ...restProps
    } = this.props;

    const { treeCounter } = this.treeLogic;

    if (!tableStore.model) {
      return tableStore.error ? null : (
        <div css={spinnerWrapperStyle}>
          <Spinner />
        </div>
      );
    }

    return (
      <>
        <DataTableHeader<T>
          key="header-data-table"
          editingState={editingState}
          headerMode={headerMode}
          headerButtonsGetter={headerButtonsGetter}
          treeCounter={treeCounter}
          onSearchChange={this.handleSearchChange}
          clearCheck={this.clearCheck}
          searchValue={tableStore.searchValue}
          searchPlaceholder={searchPlaceholder}
          allowClear={allowClear}
        />
        <Table<TExtendColumns<T>>
          {...restProps}
          isShowDividers={isShowDividers}
          loading={loading || tableStore?.isLoading}
          localization={localization}
          expandedRowKeys={tableStore?.expandedState}
          onExpandedRowsChange={this.handleExpandChange}
          size={size}
          dataSource={customDataSource ?? this.state.dataSource}
          rowSelection={this.state.rowSelectionConfig}
          columns={this.state.extendedColumns}
          showHeader={showHeader}
          onRow={onRow}
          className={className}
          targetAll={treeCounter.targetAll}
          emptyHint={emptyHint}
          isSearchEmpty={!tableStore.searchValue}
        />
      </>
    );
  }
}

const _DataTableComponent = withFeature(
  withTheme(withLocation(withLoc(observer(DataTableComponent))))
);

const DataTable = <T extends TBaseRow = TBaseRow>(props: IDataTableOwnProps<T>) => (
  <_DataTableComponent {...props} />
);

export { DataTable, emptyColumnKey };
