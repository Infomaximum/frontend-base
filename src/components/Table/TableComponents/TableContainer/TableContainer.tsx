import { forwardRef } from "react";
import type { ITableContainerProps } from "./TableContainer.types";

const TableContainer: React.FC<ITableContainerProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableElement>) => {
    return (
      <table {...restProps} ref={ref}>
        {children}
      </table>
    );
  }
);

export default TableContainer;
