import { outlinedButtonStyle, primaryButtonStyle } from "../Button/Button.styles";

export const tourGlobalStyle = (theme: TTheme) => ({
  ".ant-tour-target-placeholder": {
    borderRadius: "4px",
    border: `1px solid ${theme.thrust3Color}`,
    zIndex: 1000,
  },
  ".ant-tour": {
    maxWidth: "412px",
  },
  ".ant-tour .ant-tour-inner .ant-tour-footer .ant-tour-indicators .ant-tour-indicator-active": {
    background: theme.thrust4Color,
  },
  ".ant-tour-next-btn": {
    ...primaryButtonStyle(theme),
  },
  ".ant-tour-prev-btn": {
    ...outlinedButtonStyle(theme),
  },
});

export const nextButtonChildrenStyle = {
  display: "flex",
  alignItems: "center",
  svg: { rotate: "180deg", marginLeft: "4px", marginTop: "1px" },
};
