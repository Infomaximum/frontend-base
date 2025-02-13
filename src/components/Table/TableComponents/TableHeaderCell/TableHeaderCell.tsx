import { forwardRef } from "react";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { tableHeaderCellStyle } from "./TableHeaderCell.styles";
import type { ITableHeaderCellProps } from "./TableHeaderCell.types";
import { tableCheckboxTestId } from "../../../../utils/TestIds";

const TableHeaderCellComponent: React.FC<ITableHeaderCellProps> = forwardRef(
  ({ children, ...restProps }, ref: React.Ref<HTMLTableCellElement>) => {
    const theme = useTheme();

    const testId = restProps.className?.includes("ant-table-selection-column")
      ? { "test-id": tableCheckboxTestId }
      : {};

    return (
      <th {...restProps} css={tableHeaderCellStyle(theme)} ref={ref} title={undefined} {...testId}>
        {children}
      </th>
    );
  }
);

export const TableHeaderCell = TableHeaderCellComponent;
