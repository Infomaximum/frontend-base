export const getThreeDotsStyle = (isChecked?: boolean) => (theme: TTheme) => {
  const hoverColor = isChecked ? theme.blue2Color : theme.grey45Color;

  return {
    fontSize: "14px",
    display: "flex",
    justifyContent: "center",
    margin: `-${theme.tableCellVerticalPadding}px -${theme.tableCellHorizontalPadding}px`,
    "[ant-click-animating-without-extra-node]:after": {
      animation: "none !important",
    },
    "&&&:not(:disabled):not(.ant-btn-disabled):hover": {
      background: hoverColor,
    },
    "&&&:not(:disabled):not(.ant-btn-disabled):focus": {
      background: hoverColor,
      outline: "none",
    },
  };
};

export const contextMenuContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "38px",
  height: "38px",
};
