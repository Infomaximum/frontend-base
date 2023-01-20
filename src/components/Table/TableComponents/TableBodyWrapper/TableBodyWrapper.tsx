import { forwardRef } from "react";
import type { ITableBodyWrapperProps } from "./TableBodyWrapper.types";

const TableBodyWrapper: React.FC<ITableBodyWrapperProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableSectionElement>) => {
    return (
      <tbody {...restProps} ref={ref}>
        {children}
      </tbody>
    );
  }
);

export default TableBodyWrapper;
