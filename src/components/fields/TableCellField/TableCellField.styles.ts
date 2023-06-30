export const formItemStyle = {
  margin: 0,
};

export const editableCellWrapperStyle = (theme: TTheme) => ({
  marginLeft: `${theme.editableTableMarginLeft - theme.tableCellHorizontalPadding}px`,
  marginRight: `${theme.editableTableMarginRight - theme.tableCellHorizontalPadding}px`,
});

export const commonEditableCellStyle = (theme: TTheme) => ({
  minHeight: `${theme.editableTableFieldHeight}px`,
  height: `${theme.editableTableFieldHeight}px`,
  padding: `${theme.editableTableFieldVerticalPadding}px ${theme.editableTableFieldHorizontalPadding}px`,
});

export const ellipsisEditableCellStyle = {
  whiteSpace: "nowrap",
  overflow: "hidden",
} as const;

export const fieldComponentStyle = {
  width: "100%",
};
