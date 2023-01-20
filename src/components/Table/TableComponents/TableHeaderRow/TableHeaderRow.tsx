import React, { forwardRef } from "react";
import type { ITableHeaderRowProps } from "./TableHeaderRow.types";

const TableHeaderRow: React.FC<ITableHeaderRowProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableRowElement>) => {
    return (
      <tr {...restProps} ref={ref}>
        {children}
      </tr>
    );
  }
);

export default TableHeaderRow;
