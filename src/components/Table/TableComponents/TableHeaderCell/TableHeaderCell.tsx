import { forwardRef } from "react";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { tableHeaderCellStyle } from "./TableHeaderCell.styles";
import type { ITableHeaderCellProps } from "./TableHeaderCell.types";

const TableHeaderCellComponent: React.FC<ITableHeaderCellProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableCellElement>) => {
    const theme = useTheme();

    return (
      <th {...restProps} css={tableHeaderCellStyle(theme)} ref={ref} title={undefined}>
        {children}
      </th>
    );
  }
);

export const TableHeaderCell = TableHeaderCellComponent;
