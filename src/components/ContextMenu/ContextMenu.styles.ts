const contextMenuItemVerticalPadding = 3;
const contextMenuItemLeftPadding = 8;
const contextMenuItemRightPadding = 12;
export const contextMenuItemSummaryHorizontalPadding =
  contextMenuItemLeftPadding + contextMenuItemRightPadding;
export const contextMenuItemSummaryVerticalPadding = contextMenuItemVerticalPadding * 2;

const hoverThreeDotsStyle = (theme: TTheme) => ({
  backgroundColor: `${theme.grey45Color}`,
  color: `${theme.grey10Color}`,
});

export const wrapperContextMenuStyle = {
  cursor: "pointer",
  display: "inline-block",
  verticalAlign: "middle",
  height: "100%",
};

export const threeDotsButtonStyle = (theme: TTheme) => ({
  border: "none",
  background: "none",
  transition: "background-color 0.3s, color 0.5s",
  padding: "4px",
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.grey7Color,
  "&&&:not(:disabled):not(.ant-btn-disabled):hover": {
    ...hoverThreeDotsStyle(theme),
    cursor: "pointer",
  },
  "&&&:not(:disabled):not(.ant-btn-disabled):focus": {
    ...hoverThreeDotsStyle(theme),
    outline: "none",
  },
});

export const wrapperMenuDropdownStyle = {
  overflow: "auto",
  userSelect: "none" as const,
  padding: "4px 0",
};

export const getItemStyle = (disabled: boolean | undefined) => (theme: TTheme) => ({
  padding: `
    ${contextMenuItemVerticalPadding}px
    ${contextMenuItemRightPadding}px
    ${contextMenuItemVerticalPadding}px
    ${contextMenuItemLeftPadding}px
  `,
  color: !disabled ? theme.grey10Color : undefined,
  userSelect: "none" as const,
});
