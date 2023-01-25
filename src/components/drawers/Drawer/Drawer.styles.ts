import { ellipsisStyle } from "../../../styles/common.styles";

export const boldTitleStyle = {
  fontWeight: 500,
  lineHeight: "22px",
};

export const titleStyle = (theme: TTheme) =>
  ({
    fontWeight: 500,
    lineHeight: "22px",
    fontSize: theme.h4FontSize,
    display: "block",
    ...ellipsisStyle,
  } as const);

export const drawerStyle = (theme: TTheme) => ({
  padding: 0,
  zIndex: 1050,
  ".ant-drawer-content-wrapper": {
    maxWidth: "90%",
  },
  "&.ant-drawer > *": {
    transition: `transform 0.15s cubic-bezier(0.7, 0.3, 0.1, 1),
    box-shadow 0.15s cubic-bezier(0.7, 0.3, 0.1, 1),
    -webkit-transform 0.15s cubic-bezier(0.7, 0.3, 0.1, 1)`,
  },
  ".ant-drawer-close": {
    marginRight: "-12px",
  },
  ".ant-drawer-footer": {
    borderTop: `1px solid ${theme.grey45Color}`,
    padding: "9px 24px 10px",
  },
});

export const headerDrawerStyle = (theme: TTheme) => ({
  padding: "12px 48px 14px 24px",
  border: "none",
  background: theme.grey3Color,
  height: "48px",
  minHeight: "48px",
});

export const closeIconWrapperStyle = (theme: TTheme) => ({
  position: "absolute" as const,
  top: 0,
  right: 0,
  height: "48px",
  width: "48px",
  color: theme.grey7Color,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  ":hover": {
    color: theme.grey9Color,
  },
});

export const closeIconStyle = {
  fontSize: "12px",
};
