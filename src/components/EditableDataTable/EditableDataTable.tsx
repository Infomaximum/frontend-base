import React from "react";
import type {
  IEditableDataTableOwnProps,
  IEditableDataTableProps,
  IEditableDataTableState,
  IEditableRow,
} from "./EditableDataTable.types";
import type {
  IDataTableProps,
  THeaderButtonObject,
} from "../DataTable/DataTable.types";
import type { NCore } from "@im/core";
import { createSelector } from "reselect";
import { some, find, without, isFunction, merge, compact } from "lodash";
import {
  clickableRowStyle,
  editableDataTableCellStyle,
  sortingRowStyle,
} from "./EditableDataTable.styles";
import { getAccessParameters } from "@im/utils";
import {
  controlCellRemoveTestId,
  editableDataTableAddButtonTestId,
} from "../../utils/TestIds";
import { EditableRow } from "./EditableRow/EditableRow";
import { EditableRowButton } from "./EditableRow/EditableRowButton/EditableRowButton";
import { ControlPanel } from "./EditableRow/ControlPanel/ControlPanel";
import { observer } from "mobx-react";
import type { MutableRefObject } from "react";
import { EAddingRowMethod } from "../../managers/Tree";
import type { ITableBodyCellProps } from "../Table/TableComponents/TableBodyCell/TableBodyCell.types";
import { TableBodyCell } from "../Table/TableComponents/TableBodyCell/TableBodyCell";
import { RestModel } from "../../models/RestModel";
import { DeleteOutlined, LoadingOutlined } from "../Icons/Icons";
import type { TreeCounter } from "../../managers/TreeCounter";
import { AddButton } from "../AddButton/AddButton";
import { EditableTableContext } from "../../decorators/contexts/EditableTableContext";
import { DataTable } from "../DataTable/DataTable";
import { withLoc } from "../../decorators/hocs/withLoc/withLoc";
import { withFeature } from "../../decorators/hocs/withFeature/withFeature";
import { withModalError } from "../../decorators/hocs/withModalError/withModalError";
import type {
  IFormData,
  IFormProvider,
} from "../../decorators/contexts/FormContext";

const EditableDataTableKeys = {
  // Ключ для кастомной колонки с кнопками (добавить в columns)
  controlPanelColumn: "controlPanelColumn",
  // Ключ для кастомной кнопки добавления строки (добавить в headerButtonsGetter)
  buttonAdd: "buttonAdd",
  // Ключ для скрытия иконки удаления в стандартной колонке с кнопками (добавить в rowBuilder)
  isRowRemoveDenied: "isRowRemoveDenied",
  // Ключ для отключения редактирования на строке (добавить в rowBuilder)
  isRowEditDenied: "isRowEditDenied",
} as const;

/**
 * Редактируемая таблица.
 */

class EditableDataTableComponent<
  T extends IEditableRow = IEditableRow
> extends React.PureComponent<
  IEditableDataTableProps<T>,
  IEditableDataTableState<T>
> {
  public static readonly addedRowKey: string = "added-row";

  public static defaultProps = {
    addedRowBuilder(key: string) {
      return { key };
    },
    /* 
      Закомментировал, чтобы убрать появление скролла, когда в таблице нет данных.
      Проблема из задачи BI-4377, для которой был определен scroll по умолчанию, не воспроизвелась.
      
      scroll: { x: "max-content" },
    */
    addingRowMethod: EAddingRowMethod.UNSHIFT,
  };

  private tableComponents = {
    body: {
      row: EditableRow,
      cell: (props: ITableBodyCellProps) => (
        <TableBodyCell {...props} css={editableDataTableCellStyle} />
      ),
    },
  };

  private focusedFieldNameRef: MutableRefObject<string | null> =
    React.createRef();
  private readonly contextValue = {
    focusedFieldNameRef: this.focusedFieldNameRef,
  };

  public override readonly state: IEditableDataTableState<T> = {};

  public override componentDidMount() {
    const { providerRef, isFeatureEnabled } = this.props;
    const { handleAddRow } = this;

    if (isFeatureEnabled) {
      this.updateAccess();
    }

    if (providerRef) {
      providerRef.current = {
        /* Сюда можно будет положить данные, необходимые для кастомизации */
        handleAddRow,
      };
    }
  }

  public override componentDidUpdate(
    prevProps: IEditableDataTableProps<T>,
    prevState: IEditableDataTableState<T>
  ) {
    const {
      isFeatureEnabled,
      accessKeys,
      someAccessKeys,
      customAccess,
      onResetRow,
    } = this.props;
    const { addedRow, editingRowKey } = this.state;

    if (
      prevState.editingRowKey &&
      editingRowKey !== prevState.editingRowKey &&
      isFunction(onResetRow)
    ) {
      onResetRow(addedRow, prevState.editingRowKey);
    }

    if (
      editingRowKey !== prevState.editingRowKey &&
      isFunction(this.props.setEditingRowKeyCallback)
    ) {
      this.props.setEditingRowKeyCallback(Boolean(editingRowKey));
    }

    if (
      this.state.isSubmitting === prevState.isSubmitting &&
      prevProps.isSubmitting !== this.props.isSubmitting
    ) {
      this.setState({ isSubmitting: this.props.isSubmitting });
    }

    if (
      isFeatureEnabled !== prevProps.isFeatureEnabled ||
      accessKeys !== prevProps.accessKeys ||
      someAccessKeys !== prevProps.someAccessKeys ||
      customAccess !== prevProps.customAccess
    ) {
      this.updateAccess();
    }
  }

  private getExtendedColumnConfig = createSelector(
    (columns: IEditableDataTableProps<T>["columns"]) => columns,
    (columns) => {
      const hasCustomControlPanel = some(
        columns,
        ({ key }) => key === EditableDataTableKeys.controlPanelColumn
      );

      return hasCustomControlPanel
        ? columns
        : [...(columns || []), ...(this.controlPanelColumns || [])];
    }
  );

  private getTableComponents = createSelector(
    (tableComponents: IEditableDataTableOwnProps<T>["tableComponents"]) =>
      tableComponents,
    (tableComponents) => merge(this.tableComponents, tableComponents)
  );

  private updateAccess() {
    const { customAccess, isFeatureEnabled, accessKeys, someAccessKeys } =
      this.props;

    this.setState({
      access:
        customAccess ??
        getAccessParameters(isFeatureEnabled, accessKeys, someAccessKeys),
    });
  }

  private handleKeyPress = (
    event: KeyboardEvent,
    formProvider: IFormProvider
  ) => {
    const { isSubmitting } = this.state;

    if (!isSubmitting && formProvider) {
      switch (event.key) {
        case "Escape":
          formProvider.reset();
          this.handleResetEditing();
          break;
        case "Enter":
          formProvider.submit();
          break;
      }
    }
  };

  public handleAddRow = () => {
    const { addingRowMethod } = this.props;
    const { addedRow, isSubmitting } = this.state;

    if (!addedRow && this.state.access?.hasCreateAccess && !isSubmitting) {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        addingRowMethod,
        editingRowKey: EditableDataTable.addedRowKey,
        addedRow: this.props.addedRowBuilder?.(EditableDataTable.addedRowKey),
      });
    }
  };

  private handleResetEditing = () => {
    const { onResetRow } = this.props;
    const { addedRow, editingRowKey } = this.state;

    if (isFunction(onResetRow)) {
      onResetRow(addedRow, editingRowKey);
    }

    this.focusedFieldNameRef.current = null;

    this.setState({ editingRowKey: undefined, addedRow: undefined });
  };

  private isRowEditing = (key: string) => {
    return key === this.state.editingRowKey;
  };

  private isEditingRowExist = () => {
    return Boolean(this.state.editingRowKey);
  };

  private getRowFormKey = (rowKey: string) => {
    return `${rowKey}_${this.props.tableKey}`;
  };

  private onRow = (record: T) => {
    const { key, [EditableDataTableKeys.isRowEditDenied]: isRowEditDenied } =
      record;
    const { isSubmitting } = this.state;
    const { isSorting } = this.props;
    const isClickable =
      this.state.access?.hasWriteAccess &&
      !isSubmitting &&
      !this.isRowEditing(key) &&
      !isRowEditDenied &&
      !(record.model instanceof RestModel);

    if (record) {
      return {
        key,
        css: isSorting
          ? sortingRowStyle
          : isClickable
          ? clickableRowStyle
          : undefined,
        onClick: isClickable ? this.getRowClickHandler(record) : null,
        formProps: this.isRowEditing(key) ? this.getFormProps(record) : null,
      };
    }
  };

  private getFormProps = (record: T) => {
    const { key, model } = record;

    if (model instanceof RestModel) {
      return null;
    }

    return {
      form: this.getRowFormKey(key),
      setFormData: this.setActiveFormData,
      initialValues: record,
      onSubmit: model ? this.handleSubmitEditingRow : this.handleSubmitAddedRow,
      onKeyDown: this.handleKeyPress,
    };
  };

  private setActiveFormData = (formData: IFormData) => {
    const { setActiveFormData } = this.props;
    if (formData && setActiveFormData) {
      setActiveFormData(formData);
    }
  };

  private getRowClickHandler = (record: T) => {
    return () => {
      this.setState({ editingRowKey: record.key, addedRow: undefined });
    };
  };

  private handleSubmitAddedRow = (record: T) => {
    return this.handleSubmitResponse(this.props.onSubmitAddedRow(record));
  };

  private handleSubmitEditingRow = (record: T) => {
    return this.handleSubmitResponse(this.props.onSubmitEditingRow(record));
  };

  private handleRemoveRow = (record: T) => {
    this.setState({ removingRowKey: record.key });

    return this.handleSubmitResponse(
      this.props.onRemoveRow?.(record).finally(() => {
        this.setState({ removingRowKey: undefined });
      })
    );
  };

  private handleSubmitResponse = (promise: Promise<any> | undefined) => {
    this.setState({ isSubmitting: true });

    return promise
      ?.then(this.reloadData)
      .catch(this.handleError)
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  private reloadData = () => {
    const { tableStore, queryVariables } = this.props;

    tableStore
      .requestData({
        variables: queryVariables,
      })
      .then(() => {
        this.handleResetEditing();
      });
  };

  private handleError = (error: NCore.TError) => {
    this.props.showModalError(error);
  };

  private get controlPanelColumns(): IEditableDataTableProps<T>["columns"] {
    const columns: IEditableDataTableProps<T>["columns"] = [];

    columns.push({
      key: EditableDataTableKeys.controlPanelColumn,
      width: "84px",
      onCell: () => ({ style: { maxWidth: "84px" } }),
      render: (_: any, record: T) => {
        const {
          key,
          [EditableDataTableKeys.isRowRemoveDenied]: isRowRemoveDenied,
        } = record;
        const { removingRowKey, isSubmitting } = this.state;
        const { onRemoveRow } = this.props;

        const isShowButtonRemove =
          this.state.access?.hasDeleteAccess &&
          Boolean(onRemoveRow) &&
          !isRowRemoveDenied;

        const removeButton = isShowButtonRemove ? (
          <EditableRowButton
            disabled={isSubmitting || this.isEditingRowExist()}
            clickHandlerData={record}
            onClick={this.handleRemoveRow}
            type={EditableRowButton.types.REMOVE}
            test-id={`${key}_${controlCellRemoveTestId}`}
          >
            {removingRowKey === key ? <LoadingOutlined /> : <DeleteOutlined />}
          </EditableRowButton>
        ) : null;

        return (
          <ControlPanel
            isEditing={this.isRowEditing(key)}
            onCancel={this.handleResetEditing}
          >
            {removeButton}
          </ControlPanel>
        );
      },
    });

    return columns;
  }

  private getHeaderButtons = (
    treeCounter: TreeCounter,
    editingState: IEditableDataTableState<T>
  ): THeaderButtonObject[] => {
    const { headerButtonsGetter, tableKey } = this.props;
    const propsButtons = headerButtonsGetter?.(treeCounter, editingState) ?? [];

    const customButtonAdd = find(
      propsButtons,
      (button) => button?.key === EditableDataTableKeys.buttonAdd
    );

    const restPropsButtons = compact(without(propsButtons, customButtonAdd));

    if (!this.state.access?.hasCreateAccess || !this.props.onSubmitAddedRow) {
      return restPropsButtons;
    }

    const buttonAdd = customButtonAdd ?? {
      key: EditableDataTableKeys.buttonAdd,
      component: (
        <AddButton
          disabled={
            Boolean(editingState.addedRow) || Boolean(editingState.isSubmitting)
          }
          onClick={this.handleAddRow}
          test-id={`${tableKey}_${editableDataTableAddButtonTestId}`}
        />
      ),
    };

    return [buttonAdd, ...restPropsButtons];
  };

  public override render() {
    const {
      onSubmitEditingRow,
      onSubmitAddedRow,
      addedRowBuilder,
      columns,
      headerButtonsGetter,
      isFeatureEnabled,
      accessKeys,
      someAccessKeys,
      customAccess,
      tableComponents,
      customStyle,
      ...rest
    } = this.props;

    if (this.state.access?.hasReadAccess) {
      return (
        <EditableTableContext.Provider value={this.contextValue}>
          <DataTable<T>
            onRow={this.onRow as IDataTableProps<T>["onRow"]}
            components={this.getTableComponents(tableComponents)}
            editingState={this.state}
            columns={this.getExtendedColumnConfig(columns)}
            headerButtonsGetter={this.getHeaderButtons}
            customStyle={customStyle}
            {...rest}
          />
        </EditableTableContext.Provider>
      );
    }

    return null;
  }
}

const EditableDataTable = withLoc(
  withFeature(withModalError(observer(EditableDataTableComponent)))
);

export { EditableDataTable, EditableDataTableKeys };
