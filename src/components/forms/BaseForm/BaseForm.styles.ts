import { EFormLayoutType } from "./BaseForm.types";

export const formContentBackgroundStyle = (theme: TTheme) => ({
  borderRadius: "6px",
  backgroundColor: theme.grey1Color,
  "&:not(:first-of-type)": {
    marginTop: "24px",
  },
});

export const getFormDefaultStyle = (formType?: EFormLayoutType) => ({
  display: "flex",
  flexDirection: "column" as const,
  flexGrow: 1,
  maxWidth: formType && formType !== EFormLayoutType.LargeType ? "100%" : "550px",
  minWidth: "214px",
});

const formFieldsContainerStyle = {
  marginBottom: "16px",
  "& > div:first-of-type": {
    padding: "12px 16px 4px",
    height: "100%",
    maxHeight: "100%",
  },
};

export const formFieldsContainerWithoutPaddingStyle = {
  margin: 0,
  "& > div:first-of-type": {
    padding: "0px",
  },
};

export const formContentDefaultStyle = () => ({
  display: "block",
  padding: "16px 0px 76px",
  ...formFieldsContainerStyle,
});

export const formContentWithFooterStyle = () => ({
  display: "block",
  padding: "0px 0px 76px",
  ...formFieldsContainerStyle,
});

export const formContentWithButtonsPanelStyle = () => ({
  display: "block",
  ...formFieldsContainerStyle,
});

export const formFooterStyle = (theme: TTheme) => ({
  padding: "14px 20px",
  height: "57px",
  borderTop: `1px ${theme.grey4Color} solid`,
  background: theme.grey1Color,
  position: "fixed" as const,
  bottom: 0,
  width: "100%",
  zIndex: 2,
});

export const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
} as const;

export const connectedFormContainerStyle = {
  height: "100%",
  maxHeight: "100%",
};

export const formSubgroupContainerNameStyle = (theme: TTheme) => ({
  "& div": { color: theme.grey8Color, fontSize: theme.subtitleFontSize, fontWeight: 500 },
});

export const notificationFormItemStyle = {
  marginBottom: "12px",
};
