import { TABLE_HEADER_ID } from "../../../../utils/const";
import { forwardRef } from "react";
import type { ITableHeaderWrapperProps } from "./TableHeaderWrapper.types";

const TableHeaderWrapper: React.FC<ITableHeaderWrapperProps> = forwardRef(
  (
    { children, className, ...restProps },
    ref: React.Ref<HTMLTableSectionElement>
  ) => {
    return (
      <thead {...restProps} ref={ref} id={TABLE_HEADER_ID}>
        {children}
      </thead>
    );
  }
);

export default TableHeaderWrapper;
