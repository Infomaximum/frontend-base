const hoverThreeDotsStyle = (theme: TTheme) => ({
  backgroundColor: `${theme.grey45Color} !important`,
  color: `${theme.grey10Color} !important`,
});

export const wrapperContextMenuStyle = {
  cursor: "pointer",
  display: "inline-block",
  verticalAlign: "middle",
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
  ":hover": { ...hoverThreeDotsStyle(theme), cursor: "pointer" },
  ":focus": {
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
  padding: "3px 12px 3px 8px",
  color: !disabled ? theme.grey10Color : undefined,
  userSelect: "none" as const,
});
