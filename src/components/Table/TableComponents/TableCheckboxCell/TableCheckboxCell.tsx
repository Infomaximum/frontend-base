import { useTheme } from "../../../../decorators/hooks/useTheme";
import { tableCheckboxCellStyle } from "./TableCheckboxCell.styles";
import type { ITableCheckboxCellProps } from "./TableCheckboxCell.types";

const TableCheckboxCellComponent: React.FC<ITableCheckboxCellProps> = ({ children }) => {
  const theme = useTheme();

  return <div css={tableCheckboxCellStyle(theme)}>{children}</div>;
};

export const TableCheckboxCell = TableCheckboxCellComponent;
