export const HEADER_MENU_ICONS_WIDTH = 40;

export const MARGIN_LEFT = 8;

export const headerStyle = (theme: TTheme) =>
  ({
    width: "100%",
    background: theme.headerPanel.backgroundColor,
    lineHeight: "inherit",
    height: `${theme.heightHeaderMenu}px`,
    padding: "0px",
    overflow: "hidden",
  }) as const;

export const wrapMenuStyle = (theme: TTheme) => ({
  height: `${theme.heightHeaderMenu}px`,
  flex: "auto",
  lineHeight: `${theme.heightHeaderMenu}px`,
  "&:empty": {
    display: "none",
  },
});

export const iconsHoverStyle = (theme: TTheme) => ({
  cursor: "pointer",
  backgroundColor: theme.headerPanel.iconsBackgroundColor,
  height: `${theme.heightHeaderMenu}px`,
  width: `${HEADER_MENU_ICONS_WIDTH}px`,
  color: theme.headerPanel.iconsColor,
  borderRadius: "0px",
  ":hover": {
    background: theme.headerPanel.iconsBackgroundColorHover,
    color: theme.headerPanel.iconsColorHover,
  },
  transition: "300ms",
  display: "flex",
  flexShrink: 0,
  justifyContent: "center",
  alignItems: "center",
  userSelect: "none" as const,
});

export const wrapStaticMenuStyle = (theme: TTheme) => ({
  ...wrapMenuStyle(theme),
  marginLeft: `${MARGIN_LEFT}px`,
  display: "flex",
  flex: "0 0 auto",
  flexShrink: 0,
});

export const linkSettingsStyle = (theme: TTheme) => ({
  ...iconsHoverStyle(theme),
  cursor: "pointer",
});

export const headerRowStyle = {
  display: "flex",
  flexWrap: "nowrap" as const,
  justifyContent: "space-between",
};

export const drawerBodyStyle = { padding: "0px" };

export const headerWithSettingsIconStyle = {
  maxWidth: `calc(100% - ${HEADER_MENU_ICONS_WIDTH * 2 + MARGIN_LEFT}px)`,
};

export const headerWithoutSettingsIconStyle = {
  maxWidth: `calc(100% - ${HEADER_MENU_ICONS_WIDTH + MARGIN_LEFT}px)`,
};

export const footerStyle = {
  padding: "0px",
  height: "32px",
};

export const headerSettingsDrawerStyle = {
  background: "unset",
  padding: 0,
  minHeight: "48px",
  borderBottom: "none",
};
