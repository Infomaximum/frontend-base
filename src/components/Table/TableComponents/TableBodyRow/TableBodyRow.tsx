import { forwardRef } from "react";
import type { ITableBodyRowProps } from "./TableBodyRow.types";

const TableBodyRow: React.FC<ITableBodyRowProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableRowElement>) => {
    return (
      <tr {...restProps} ref={ref}>
        {children}
      </tr>
    );
  }
);

export default TableBodyRow;
