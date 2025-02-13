import { observer } from "mobx-react";
import { tableRowCheckboxTestId, tableRowLoadingTestId } from "../../../../utils/TestIds";
import {
  virtualizedTableBodyRowLoadingCoverStyle,
  usualVirtualizedTableBodyRowStyle,
  checkedVirtualizedTableBodyRowStyle,
  clickableVirtualizedTableBodyRowStyle,
  virtualizedTableCheckboxCellStyle,
  virtualizedTableWithPaddingBodyRowLoadingStyle,
} from "./VirtualizedTableBodyRow.styles";
import type { IVirtualizedTableBodyRowProps } from "./VirtualizedTableBodyRow.types";
import { type MouseEvent } from "react";
import { Radio } from "../../../Radio/Radio";
import { Checkbox } from "../../../Checkbox/Checkbox";
import { map } from "lodash";
import { VirtualizedTableBodyCell } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell";
import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";
import { TableCheckboxCell } from "../../../Table/TableComponents/TableCheckboxCell/TableCheckboxCell";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";
import { withoutDividerStyle } from "../../../VirtualizedTable/VirtualizedTable.styles";
import { useTheme } from "../../../../decorators/hooks/useTheme";

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
  } = props;
  const theme = useTheme();

  const checkboxProps = getCheckboxProps?.(record) || emptyObj;
  const isRowDisable = checkboxProps ? checkboxProps.disabled : false;

  const selectChange = (event: CheckboxChangeEvent | MouseEvent) => {
    if (enableRowClick) {
      event.preventDefault();
    }

    if (window.getSelection()?.toString()) {
      setTimeout(() => {
        onSelectChange(record, !isChecked);
      }, 0);

      return;
    }

    onSelectChange(record, !isChecked);
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

  return (
    <>
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
      {loading && (
        <div
          css={virtualizedTableBodyRowLoadingCoverStyle(theme)}
          test-id={tableRowLoadingTestId}
        />
      )}
    </>
  );
};

export const VirtualizedTableBodyRow = observer(VirtualizedTableBodyRowComponent);
