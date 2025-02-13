import { convertHexToRgbaStyle } from "../../../utils/colors";

export const boldTitleStyle = {
  fontWeight: 500,
  lineHeight: "24px",
};

export const titleStyle = (theme: TTheme) =>
  ({
    fontWeight: 500,
    lineHeight: "24px",
    fontSize: theme.subtitleFontSize,
    display: "block",
  }) as const;

export const drawerStyle = (theme: TTheme) => ({
  padding: 0,
  zIndex: 1050,
  ".ant-drawer-body": {
    padding: "16px 24px 0px",
  },
  ".ant-drawer-header": {
    border: "none",
    borderBottom: `1px solid ${theme.grey45Color}`,
  },

  ".ant-drawer-header-title": {
    display: "flex",
    flexDirection: "row-reverse" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  ".ant-drawer-close": {
    width: "48px",
    height: "48px",
    padding: 0,
    marginInlineEnd: 0,

    "&:hover, &:active": {
      backgroundColor: "inherit",
    },
  },
  ".ant-drawer-title": {
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    color: `${convertHexToRgbaStyle(theme.grey13Color, 0.85)}`,
  },
});

export const wrapperDrawerStyle = {
  maxWidth: "90%",
};

export const footerDrawerStyle = (theme: TTheme) => ({
  borderTop: `1px solid ${theme.grey45Color}`,
  padding: "10px 24px",
});

export const headerDrawerStyle = {
  padding: "16px 8px 16px 24px",
  height: "56px",
  minHeight: "56px",
  userSelect: "none" as const,
};

export const closeIconWrapperStyle = (theme: TTheme) => ({
  color: theme.grey7Color,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",

  ":hover": {
    color: theme.grey10Color,
  },
});

export const closeIconStyle = {
  fontSize: "16px",
};
