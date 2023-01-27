import { forwardRef } from "react";
import type { ITableBodyRowProps } from "./TableBodyRow.types";

const TableBodyRowComponent: React.FC<ITableBodyRowProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableRowElement>) => {
    return (
      <tr {...restProps} ref={ref}>
        {children}
      </tr>
    );
  }
);

export const TableBodyRow = TableBodyRowComponent;
