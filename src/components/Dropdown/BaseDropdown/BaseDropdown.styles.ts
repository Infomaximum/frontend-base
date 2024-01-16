import { convertHexToRgbaStyle } from "../../../utils/colors";

export const menuStyle = (theme: TTheme) => ({
  backgroundColor: theme.grey1Color,
  borderRadius: "4px",
  boxShadow: `0px 2px 8px ${convertHexToRgbaStyle(theme.grey13Color, 0.15)}`,
  overflowY: "auto" as const,
});

export const mainBaseDropdownOverlayStyle = {
  position: "fixed",
  zIndex: 999,
} as const;
