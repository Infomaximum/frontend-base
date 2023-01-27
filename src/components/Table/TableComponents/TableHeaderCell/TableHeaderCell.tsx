import { forwardRef } from "react";
import { tableHeaderCellStyle } from "./TableHeaderCell.styles";
import type { ITableHeaderCellProps } from "./TableHeaderCell.types";

const TableHeaderCellComponent: React.FC<ITableHeaderCellProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableCellElement>) => {
    return (
      <th {...restProps} css={tableHeaderCellStyle} ref={ref} title={undefined}>
        {children}
      </th>
    );
  }
);

export const TableHeaderCell = TableHeaderCellComponent;
