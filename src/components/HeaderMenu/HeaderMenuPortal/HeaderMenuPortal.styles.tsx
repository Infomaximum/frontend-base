import { textOverflowOverlayStyle } from "../../../styles";
import {
  wrapMenuStyle,
  iconsHoverStyle,
  HEADER_MENU_ICONS_WIDTH,
  MARGIN_LEFT as HEADER_MENU_ICONS_MARGIN_LEFT,
} from "../HeaderMenu.styles";
import type { THeaderMenuColumnConfig } from "./HeaderMenuPortal.types";

const HEADER_LEFT_ICON_WIDTH = 50;

export const titleStyle = (theme: TTheme) =>
  ({
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 500,
    color: `${theme.headerPanel.textColor}`,
    overflow: "hidden",
    whiteSpace: "nowrap",
    paddingLeft: "8px",
    paddingRight: "12px",
    background: theme.headerPanel.backgroundColor,
    position: "relative",
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

export const getHeaderTitleStyle = (leftWidth: number) => ({
  flex: "unset",
  width: `${leftWidth}px`,
});

const getSettingsMenuWidth = (isSettingsIcon: boolean) =>
  HEADER_MENU_ICONS_WIDTH * (isSettingsIcon ? 2 : 1) + HEADER_MENU_ICONS_MARGIN_LEFT;

export const getHeaderBodyCenterStyle = (
  columnsConfig: THeaderMenuColumnConfig,
  isSettingsIcon: boolean
) => {
  const defaultPaddings = 32;
  const settingsMenuWidth = getSettingsMenuWidth(isSettingsIcon);
  const occupiedWidth =
    columnsConfig.leftColWidth + columnsConfig.rightColWidth + defaultPaddings - settingsMenuWidth;

  return {
    flex: "none",
    width: `${
      columnsConfig.centerColWidth
        ? `${columnsConfig.centerColWidth}px`
        : `calc(100% - ${occupiedWidth}px)`
    }`,
    position: "absolute" as const,
    left: `${columnsConfig.centerColPosition ? `${columnsConfig.centerColPosition}%` : "50%"}`,
    transform: `translateX(calc(-50% + ${settingsMenuWidth / 2}px))`,
    zIndex: 10, // перекрытие забледнения заголовка
  };
};

export const getHeaderBodyRightWithCenterStyle = (
  sideColumnWidth: number,
  isSettingsIcon: boolean
) =>
  ({
    width: `${sideColumnWidth - getSettingsMenuWidth(isSettingsIcon)}px`,
    justifyContent: "flex-end",
    position: "absolute",
    right: "0",
    bottom: "50%",
    transform: "translateY(50%)",
    zIndex: 10, // перекрытие забледнения заголовка
  } as const);

export const headerBodyRightWithLeftWithoutCenterStyle = { flex: "0 0 auto" };

export const headerBodyRightWithoutLeftAndCenterStyle = {
  flex: "0 0 auto",
  justifyContent: "flex-end",
};

export const titleOverlayStyle = (theme: TTheme) =>
  ({
    "::after": {
      content: "''",
      ...textOverflowOverlayStyle({
        backgroundColor: theme.headerPanel.backgroundColor,
      }),
      pointerEvents: "none",
      height: "100%",
    },
  } as const);
