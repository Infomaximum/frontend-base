import { PureComponent } from "react";
import { assertSimple } from "@im/asserts";
import { isUndefined, map } from "lodash";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";
import {
  virtualizedTableHeaderTestId,
  virtualizedTableCheckboxTestId,
} from "../../../../utils/TestIds";
import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";
import { Checkbox } from "../../../Checkbox/Checkbox";
import type { IVirtualizedTableHeaderRowProps } from "./VirtualizedTableHeaderRow.types";
import { VirtualizedTableHeaderCell } from "../VirtualizedTableHeaderCell/VirtualizedTableHeaderCell";
import {
  virtualizedTableHeaderRowStyle,
  virtualizedTableHeaderRowWrapperStyle,
} from "./VirtualizedTableHeaderRow.styles";
import { createSelector } from "reselect";
import {
  virtualizedTableBodyRowLoadingCoverStyle,
  virtualizedTableCheckboxCellStyle,
} from "../VirtualizedTableBodyRow/VirtualizedTableBodyRow.styles";
import { TableCheckboxCell } from "../../../Table/TableComponents/TableCheckboxCell/TableCheckboxCell";
import { withoutDividerStyle } from "../../../VirtualizedTable/VirtualizedTable.styles";
import { TABLE_HEADER_ID } from "../../../../utils/const";

export class VirtualizedTableHeaderRowComponent<T = TRow> extends PureComponent<
  IVirtualizedTableHeaderRowProps<T>
> {
  private getHeaderStyle = createSelector(
    (scrollOffset) => scrollOffset,
    (scrollOffset: number | undefined, isShowDivider: boolean) => isShowDivider,
    (scrollOffset, isShowDivider) => [
      virtualizedTableHeaderRowStyle,
      scrollOffset ? { paddingRight: `${scrollOffset}px` } : undefined,
      isShowDivider ? null : withoutDividerStyle,
    ]
  );

  private get checkbox() {
    const { targetAll, isCheckable, isSelectionEmpty, isTableEmpty } =
      this.props;

    if (isCheckable) {
      assertSimple(
        !isUndefined(targetAll),
        "Для работы выделения по шапке необходимо передать флаг targetAll"
      );

      const isIndeterminate = !isTableEmpty && !targetAll && !isSelectionEmpty;

      return (
        <div css={virtualizedTableCheckboxCellStyle} key="wrapper-checkbox">
          <TableCheckboxCell>
            <Checkbox
              key="checkbox"
              checked={targetAll}
              disabled={isTableEmpty}
              indeterminate={isIndeterminate}
              onChange={this.handleHeaderCheckboxChange}
              test-id={virtualizedTableCheckboxTestId}
            />
          </TableCheckboxCell>
        </div>
      );
    }

    return null;
  }

  private get content() {
    const { columns, sorter, onSorterChange, columnsOrders } = this.props;

    return map(columns, (column, index) => {
      const isSorted = sorter && sorter.field === column.key;

      return (
        <VirtualizedTableHeaderCell<T>
          key={column.key || index}
          column={column}
          onSorterChange={onSorterChange}
          columnsOrders={columnsOrders}
          isSorted={isSorted}
          sortOrder={isSorted ? sorter?.order : undefined}
        />
      );
    });
  }

  private handleHeaderCheckboxChange = (e: CheckboxChangeEvent) => {
    this.props.onSelectChange(null, e.target.checked);
  };

  public override render() {
    const { scrollOffset, isShowDivider } = this.props;

    return (
      <div
        key="wrapper-header"
        css={virtualizedTableHeaderRowWrapperStyle}
        id={TABLE_HEADER_ID}
      >
        <div
          key="wrapper"
          css={this.getHeaderStyle(scrollOffset, isShowDivider)}
          test-id={virtualizedTableHeaderTestId}
        >
          {this.checkbox}
          {this.content}
        </div>
        {this.props.loading && (
          <div key="block" css={virtualizedTableBodyRowLoadingCoverStyle} />
        )}
      </div>
    );
  }
}

export const VirtualizedTableHeaderRow = VirtualizedTableHeaderRowComponent;
