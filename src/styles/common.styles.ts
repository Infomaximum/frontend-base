export const ellipsisStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export const closeModalIconStyle = (theme: TTheme) => ({
  height: "48px",
  width: "48px",
  display: "table-cell",
  verticalAlign: "middle",
  color: theme.grey7Color,
  fontSize: "12px",

  ":hover": {
    color: theme.grey9Color,
  },
});
