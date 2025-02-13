import { PureComponent } from "react";
import { assertSimple } from "@infomaximum/assert";
import { isUndefined, map } from "lodash";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";
import {
  virtualizedTableHeaderTestId,
  virtualizedTableCheckboxTestId,
} from "../../../../utils/TestIds";
import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";
import { Checkbox } from "../../../Checkbox/Checkbox";
import type {
  IVirtualizedTableHeaderRowOwnProps,
  IVirtualizedTableHeaderRowProps,
} from "./VirtualizedTableHeaderRow.types";
import { VirtualizedTableHeaderCell } from "../VirtualizedTableHeaderCell/VirtualizedTableHeaderCell";
import {
  virtualizedTableHeaderRowStyle,
  virtualizedTableHeaderRowWrapperStyle,
} from "./VirtualizedTableHeaderRow.styles";
import {
  virtualizedTableBodyRowLoadingCoverStyle,
  virtualizedTableCheckboxCellStyle,
} from "../VirtualizedTableBodyRow/VirtualizedTableBodyRow.styles";
import { TableCheckboxCell } from "../../../Table/TableComponents/TableCheckboxCell/TableCheckboxCell";
import { withoutDividerStyle } from "../../../VirtualizedTable/VirtualizedTable.styles";
import { TABLE_HEADER_ID } from "../../../../utils/const";
import { withTheme } from "../../../../decorators";

export class VirtualizedTableHeaderRowComponent<T extends TRow = TRow> extends PureComponent<
  IVirtualizedTableHeaderRowProps<T | null>
> {
  private getHeaderStyle = (
    scrollOffset: number | undefined,
    isShowDivider: boolean,
    theme: TTheme
  ) => [
    virtualizedTableHeaderRowStyle(theme),
    scrollOffset ? { paddingRight: `${scrollOffset}px` } : undefined,
    isShowDivider ? null : withoutDividerStyle,
  ];

  private handleCheckboxClick = () => {
    if (window.getSelection()?.toString()) {
      window.getSelection()?.removeAllRanges();
    }
  };

  private get checkbox() {
    const {
      targetAll,
      isCheckable,
      isSelectionEmpty,
      isTableEmpty,
      theme,
      checkableColumnTitle,
      hideSelectAll,
      isCheckableDisabled,
    } = this.props;

    if (isCheckable) {
      if (hideSelectAll) {
        return <div css={virtualizedTableCheckboxCellStyle(theme)} key="wrapper-checkbox" />;
      }

      assertSimple(
        !isUndefined(targetAll),
        "Для работы выделения по шапке необходимо передать флаг targetAll"
      );

      const isIndeterminate = !isTableEmpty && !targetAll && !isSelectionEmpty;
      const isDisabled = isTableEmpty || isCheckableDisabled;
      const isChecked = targetAll && !isDisabled;

      const checkbox = (
        <Checkbox
          key="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          indeterminate={isIndeterminate}
          onChange={this.handleHeaderCheckboxChange}
          test-id={virtualizedTableCheckboxTestId}
        />
      );

      return (
        <div
          css={virtualizedTableCheckboxCellStyle(theme)}
          key="wrapper-checkbox"
          onClick={this.handleCheckboxClick}
        >
          <TableCheckboxCell>
            {(typeof checkableColumnTitle === "function"
              ? checkableColumnTitle(checkbox)
              : checkableColumnTitle) ?? checkbox}
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
        <VirtualizedTableHeaderCell
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
    const { scrollOffset, isShowDivider, theme } = this.props;

    return (
      <div key="wrapper-header" css={virtualizedTableHeaderRowWrapperStyle} id={TABLE_HEADER_ID}>
        <div
          key="wrapper"
          css={this.getHeaderStyle(scrollOffset, isShowDivider, theme)}
          test-id={virtualizedTableHeaderTestId}
        >
          {this.checkbox}
          {this.content}
        </div>
        {this.props.loading && (
          <div key="block" css={virtualizedTableBodyRowLoadingCoverStyle(theme)} />
        )}
      </div>
    );
  }
}

const VirtualizedTableHeaderRowWithHOCs = withTheme(VirtualizedTableHeaderRowComponent) as <T>(
  props: IVirtualizedTableHeaderRowOwnProps<T>
) => JSX.Element;

export const VirtualizedTableHeaderRow = <T extends TRow>(
  props: IVirtualizedTableHeaderRowOwnProps<T>
) => <VirtualizedTableHeaderRowWithHOCs {...props} />;
