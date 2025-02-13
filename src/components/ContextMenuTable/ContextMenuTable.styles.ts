export const threeDotsStyle = (theme: TTheme) =>
  ({
    display: "flex",
    justifyContent: "center",
    margin: `-${theme.tableCellVerticalPadding}px -${theme.tableCellHorizontalPadding}px`,
    "[ant-click-animating-without-extra-node]:after": {
      animation: "none !important",
    },
    ":hover": {
      background: theme.grey45Color,
    },
    ":focus": {
      background: theme.grey45Color,
      outline: "none",
    },
  }) as const;

export const contextMenuContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "38px",
  height: "38px",
};
