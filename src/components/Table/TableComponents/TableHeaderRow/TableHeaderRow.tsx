import React, { forwardRef } from "react";
import type { ITableHeaderRowProps } from "./TableHeaderRow.types";

const TableHeaderRowComponent: React.FC<ITableHeaderRowProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableRowElement>) => {
    return (
      <tr {...restProps} ref={ref}>
        {children}
      </tr>
    );
  }
);

export const TableHeaderRow = TableHeaderRowComponent;
