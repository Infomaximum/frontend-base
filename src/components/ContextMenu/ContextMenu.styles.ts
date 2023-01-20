const hoverThreeDotsStyle = (theme: TTheme) => ({
  backgroundColor: theme.grey4Color,
  color: theme.grey8Color,
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

export const wrapperMenuDropdownStyle = () => ({
  overflow: "auto",
});

export const itemDeleteStyle = (theme: TTheme) => ({
  color: theme.red6Color,
  ".ant-dropdown-menu-submenu-title": {
    color: theme.grey9Color,
  },
});

export const itemStyle =
  (disabled: boolean | undefined, action: string | undefined) => (theme: TTheme) => ({
    padding: "3px 12px 3px 8px",
    color: !disabled ? (action === "delete" ? theme.red6Color : theme.grey9Color) : undefined,
  });
