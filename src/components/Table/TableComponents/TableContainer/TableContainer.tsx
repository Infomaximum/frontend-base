import { forwardRef } from "react";
import type { ITableContainerProps } from "./TableContainer.types";

const TableContainerComponent: React.FC<ITableContainerProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableElement>) => {
    return (
      <table {...restProps} ref={ref}>
        {children}
      </table>
    );
  }
);

export const TableContainer = TableContainerComponent;
