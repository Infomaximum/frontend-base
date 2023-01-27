import { forwardRef } from "react";
import type { ITableBodyWrapperProps } from "./TableBodyWrapper.types";

const TableBodyWrapperComponent: React.FC<ITableBodyWrapperProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableSectionElement>) => {
    return (
      <tbody {...restProps} ref={ref}>
        {children}
      </tbody>
    );
  }
);

export const TableBodyWrapper = TableBodyWrapperComponent;
