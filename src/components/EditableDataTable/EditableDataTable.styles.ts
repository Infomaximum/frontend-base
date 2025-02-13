import { editableCellClassName } from "../fields/TableCellField/TableCellField";

export const defaultTableWrapperStyle = {
  paddingBottom: "6px",
  display: "flex",
  flexDirection: "column",
  height: "100%",
} as const;

export const emptyEditableTableStyle = {
  margin: "57px 0px",
};

export const clickableRowStyle = (theme: TTheme) =>
  ({
    [`.${editableCellClassName}:hover`]: {
      border: `1px solid ${theme.grey5Color}`,
      borderRadius: "2px",
      padding: "2px 7px",
    },
    cursor: "pointer",
  }) as const;

// todo: проверить правильность использования данного стиля
export const sortingRowStyle = {
  userSelect: "none" as const,
  msUserSelect: "none" as const,
  MozUserSelect: "none" as const,
};

export const getEditableDataTableCellVerticalPadding = (theme: TTheme) =>
  (theme.editableTableRowHeight - theme.editableTableFieldHeight) / 2;

export const editableDataTableCellStyle = (theme: TTheme) => {
  const verticalPadding = getEditableDataTableCellVerticalPadding(theme);

  return {
    padding: `
      ${verticalPadding}px 
      ${theme.tableCellHorizontalPadding}px 
      ${verticalPadding - theme.tableRowBorderSize}px 
      ${theme.tableCellHorizontalPadding}px !important`,
    overflow: "visible",
  };
};
