export const formItemStyle = {
  margin: 0,
};

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
