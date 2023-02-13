import {
  wrapMenuStyle,
  iconsHoverStyle,
  HEADER_MENU_ICONS_WIDTH,
} from "../HeaderMenu.styles";

const HEADER_LEFT_ICON_WIDTH = 50;

export const titleStyle = (theme: TTheme) =>
  ({
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 500,
    color: `${theme.headerPanel.textColor}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    paddingLeft: "8px",
    paddingRight: "12px",
    background: theme.headerPanel.backgroundColor,
  } as const);

export const wrapMenuTitleStyle = (theme: TTheme) => ({
  ...wrapMenuStyle(theme),
  minWidth: 0,
  display: "flex",
});

export const linkRootStyle = (theme: TTheme) => ({
  ...iconsHoverStyle(theme),
  width: `${HEADER_LEFT_ICON_WIDTH}px`,
  height: "inherit",
  cursor: "pointer",
});

export const linkBackStyle = (theme: TTheme) => ({
  ...iconsHoverStyle(theme),
  width: `${HEADER_LEFT_ICON_WIDTH}px`,
});

export const headerBodyRightStyle = () => ({
  paddingLeft: "8px",
  display: "flex",
  flexShrink: 0,
});

export const spinnerStyle = (theme: TTheme) => ({
  padding: "2px",
  ".ant-spin-dot-item": {
    backgroundColor: theme.thrust1Color,
  },
});

export const getHeaderTitleStyle = (sideColumnWidth: number) => ({
  flex: "none",
  width: `${sideColumnWidth}px`,
});

export const getHeaderBodyCenterStyle = (
  sideColumnWidth: number,
  isSettingsIcon: boolean
) => ({
  flex: "none",
  width: `calc(100% - ${sideColumnWidth * 2}px + ${
    HEADER_MENU_ICONS_WIDTH * (isSettingsIcon ? 2 : 1)
  }px)`,
  padding: "0 16px",
});

export const getHeaderBodyRightWithCenterStyle = (
  sideColumnWidth: number,
  isSettingsIcon: boolean
) =>
  ({
    width: `${
      sideColumnWidth - HEADER_MENU_ICONS_WIDTH * (isSettingsIcon ? 2 : 1)
    }px`,
    flex: "auto",
    justifyContent: "flex-end",
    position: "absolute",
    right: "0",
    bottom: "50%",
    transform: "translateY(50%)",
  } as const);

export const headerBodyRightWithLeftWithoutCenterStyle = { flex: "0 0 auto" };

export const headerBodyRightWithoutLeftAndCenterStyle = {
  flex: "auto",
  justifyContent: "flex-end",
};
