import { observer } from "mobx-react";
import { tableRowCheckboxTestId, tableRowLoadingTestId } from "@infomaximum/base/src/utils/TestIds";
import {
  virtualizedTableBodyRowLoadingCoverStyle,
  usualVirtualizedTableBodyRowStyle,
  checkedVirtualizedTableBodyRowStyle,
  clickableVirtualizedTableBodyRowStyle,
  virtualizedTableCheckboxCellStyle,
  virtualizedTableWithPaddingBodyRowLoadingStyle,
} from "./VirtualizedTableBodyRow.styles";
import type { IVirtualizedTableBodyRowProps } from "./VirtualizedTableBodyRow.types";
import { useCallback, type MouseEvent } from "react";
import { Radio } from "@infomaximum/base/src/components/Radio/Radio";
import { Checkbox } from "@infomaximum/base/src/components/Checkbox/Checkbox";
import { map } from "lodash";
import { VirtualizedTableBodyCell } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell";
import type { TRow } from "@infomaximum/base/src/components/VirtualizedTable/VirtualizedTable.types";
import { TableCheckboxCell } from "@infomaximum/base/src/components/Table/TableComponents/TableCheckboxCell/TableCheckboxCell";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";
import { withoutDividerStyle } from "@infomaximum/base/src/components/VirtualizedTable/VirtualizedTable.styles";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { ContextMenuFloating } from "@infomaximum/base/src/components/ContextMenu/ContextMenuTable/ContextMenuFloating/ContextMenuFloating";
import { RestModel } from "@infomaximum/base/src/models";

const emptyObj: ReturnType<NonNullable<IVirtualizedTableBodyRowProps<any>["getCheckboxProps"]>> =
  {};

export const VirtualizedTableBodyRowComponent = <T extends TRow>(
  props: IVirtualizedTableBodyRowProps<T | null>
) => {
  const {
    index: rowIndex,
    loading,
    isChecked,
    record,
    isCheckable,
    enableRowClick,
    getCheckboxProps,
    onSelectChange,
    onSelectMultipleChange,
    selectionType,
    columns,
    isTree,
    indentLeft,
    hasExpander,
    isExpanded,
    onExpanderChange,
    isShowDivider,
    onRow,
    isWithoutWrapperStyles,
    floatingContextMenuConfig,
  } = props;
  const theme = useTheme();

  const checkboxProps = getCheckboxProps?.(record) || emptyObj;
  const isRowDisable = checkboxProps ? checkboxProps.disabled : false;

  const handleSelectChange = useCallback(
    (event: CheckboxChangeEvent | MouseEvent) => {
      if (event.nativeEvent.shiftKey) {
        onSelectMultipleChange(rowIndex);
      } else {
        onSelectChange(record, !isChecked, rowIndex);
      }
    },
    [isChecked, onSelectChange, onSelectMultipleChange, record, rowIndex]
  );

  const selectChange = (event: CheckboxChangeEvent | MouseEvent) => {
    if (enableRowClick) {
      event.preventDefault();
    }

    if (window.getSelection()?.toString()) {
      setTimeout(() => {
        handleSelectChange(event);
      }, 0);

      return;
    }

    handleSelectChange(event);
  };

  const clearTextSelection = () => {
    if (window.getSelection()?.toString()) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const getCheckbox = () => {
    const Component = selectionType === "radio" ? Radio : Checkbox;
    const { indeterminate, ...generalProps } = checkboxProps;

    return (
      <div css={virtualizedTableCheckboxCellStyle(theme)} onClick={clearTextSelection}>
        <TableCheckboxCell>
          <Component
            checked={isChecked}
            onChange={!enableRowClick ? selectChange : undefined}
            {...(selectionType === "radio" ? generalProps : checkboxProps)}
            key={checkboxProps?.key}
            test-id={tableRowCheckboxTestId}
          />
        </TableCheckboxCell>
      </div>
    );
  };

  const rowContent = (
    <div
      css={[
        isChecked
          ? checkedVirtualizedTableBodyRowStyle(theme)
          : usualVirtualizedTableBodyRowStyle(theme),
        isWithoutWrapperStyles ? {} : virtualizedTableWithPaddingBodyRowLoadingStyle,
        enableRowClick && !isRowDisable && clickableVirtualizedTableBodyRowStyle,
        isShowDivider ? null : withoutDividerStyle,
      ]}
      onClick={!isRowDisable && enableRowClick ? selectChange : undefined}
      {...onRow?.(record, rowIndex)}
    >
      {isCheckable && getCheckbox()}
      {map(columns, (column, columnIndex) => {
        return (
          <VirtualizedTableBodyCell<T>
            key={column.key}
            column={column}
            isTree={isTree}
            index={columnIndex}
            indentLeft={indentLeft}
            record={record}
            hasExpander={hasExpander}
            isExpanded={isExpanded}
            enableRowClick={enableRowClick}
            onExpanderChange={onExpanderChange}
          />
        );
      })}
    </div>
  );

  const loadingContent = loading && (
    <div css={virtualizedTableBodyRowLoadingCoverStyle(theme)} test-id={tableRowLoadingTestId} />
  );

  if (!record?.model || record?.model instanceof RestModel) {
    return (
      <>
        {rowContent}
        {loadingContent}
      </>
    );
  }

  return (
    <>
      <ContextMenuFloating
        data={record}
        isRowChecked={isChecked}
        floatingContextMenuConfig={floatingContextMenuConfig}
      >
        {rowContent}
      </ContextMenuFloating>
      {loadingContent}
    </>
  );
};

export const VirtualizedTableBodyRow = observer(VirtualizedTableBodyRowComponent);
