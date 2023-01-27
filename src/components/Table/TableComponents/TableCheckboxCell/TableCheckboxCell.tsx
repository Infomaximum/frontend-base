import type React from "react";
import { tableCheckboxCellStyle } from "./TableCheckboxCell.styles";
import type { ITableCheckboxCellProps } from "./TableCheckboxCell.types";

const TableCheckboxCellComponent: React.FC<ITableCheckboxCellProps> = ({
  children,
}) => {
  return <div css={tableCheckboxCellStyle}>{children}</div>;
};

export const TableCheckboxCell = TableCheckboxCellComponent;
