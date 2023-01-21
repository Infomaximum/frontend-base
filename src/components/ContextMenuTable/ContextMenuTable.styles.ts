export const threeDotsStyle = (theme: TTheme) =>
  ({
    display: "flex",
    justifyContent: "center",
    margin: `-${theme.tableCellVerticalPadding}px -${theme.tableCellHorizontalPadding}px`,
    "[ant-click-animating-without-extra-node]:after": {
      animation: "none !important",
    },
  } as const);
