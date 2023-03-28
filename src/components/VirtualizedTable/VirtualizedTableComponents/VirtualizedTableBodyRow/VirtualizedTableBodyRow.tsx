import { observer } from "mobx-react";
import { tableRowCheckboxTestId, tableRowLoadingTestId } from "../../../../utils/TestIds";
import {
  virtualizedTableBodyRowLoadingCoverStyle,
  usualVirtualizedTableBodyRowStyle,
  checkedVirtualizedTableBodyRowStyle,
  clickableVirtualizedTableBodyRowStyle,
  virtualizedTableCheckboxCellStyle,
} from "./VirtualizedTableBodyRow.styles";
import type { IVirtualizedTableBodyRowProps } from "./VirtualizedTableBodyRow.types";
import { type MouseEvent, useCallback } from "react";
import { Radio } from "../../../Radio/Radio";
import { Checkbox } from "../../../Checkbox/Checkbox";
import { map } from "lodash";
import { VirtualizedTableBodyCell } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell";
import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";
import { TableCheckboxCell } from "../../../Table/TableComponents/TableCheckboxCell/TableCheckboxCell";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";
import { withoutDividerStyle } from "../../../VirtualizedTable/VirtualizedTable.styles";
import { useTheme } from "../../../../decorators/hooks/useTheme";

export const VirtualizedTableBodyRowComponent = <T extends TRow>(
  props: IVirtualizedTableBodyRowProps<T | null>
) => {
  const {
    loading,
    isChecked,
    record,
    isCheckable,
    enableRowClick,
    checkboxProps,
    onSelectChange,
    selectionType,
    columns,
    isTree,
    indentLeft,
    hasExpander,
    isExpanded,
    onExpanderChange,
    isShowDivider,
  } = props;
  const theme = useTheme();
  const isRowDisable = checkboxProps ? checkboxProps.disabled : false;

  const selectChange = useCallback(
    (event: CheckboxChangeEvent | MouseEvent) => {
      if (enableRowClick) {
        event.preventDefault();
      }
      onSelectChange(record, !isChecked);
    },
    [enableRowClick, isChecked, onSelectChange, record]
  );

  const getCheckbox = () => {
    const Component = selectionType === "radio" ? Radio : Checkbox;

    return (
      <div css={virtualizedTableCheckboxCellStyle(theme)}>
        <TableCheckboxCell>
          <Component
            checked={isChecked}
            onChange={!enableRowClick ? selectChange : undefined}
            {...checkboxProps}
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
          enableRowClick && !isRowDisable && clickableVirtualizedTableBodyRowStyle,
          isShowDivider ? null : withoutDividerStyle,
        ]}
        onClick={!isRowDisable && enableRowClick ? selectChange : undefined}
      >
        {isCheckable && getCheckbox()}
        {map(columns, (column, index) => {
          return (
            <VirtualizedTableBodyCell<T>
              key={column.key}
              column={column}
              isTree={isTree}
              index={index}
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
