export const tableExpandIconStyle = (theme: TTheme) =>
  ({
    border: "none",
    background: "none",
    transition: "300ms",
    minWidth: `${17 + theme.tableCellHorizontalPadding}px`, // размер иконки + отступы
    height: `calc(100% + ${theme.tableCellVerticalPadding * 2}px)`,
    padding: `${theme.tableCellVerticalPadding}px ${theme.tableCellHorizontalPadding / 2}px`,
    margin: `-${theme.tableCellVerticalPadding}px 
      ${theme.tableCellHorizontalPadding / 2}px 
      -${theme.tableCellVerticalPadding}px 
      -${theme.tableCellHorizontalPadding / 2}px`,
    outline: "none",
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "center",
    float: "left",
    cursor: "pointer",
    boxShadow: "none",
    color: theme.blue6Color,
    ":hover": {
      color: theme.linkHoverColor,
    },
  }) as const;

export const tableExpandIconHiddenStyle = {
  visibility: "hidden",
} as const;
