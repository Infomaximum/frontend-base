import { scrollDefaultStyle } from "../../../styles/global.styles";

export const titleStyle = (theme: TTheme) => ({
  fontSize: `${theme.subtitleFontSize}px`,
  fontWeight: "bold" as const,
  lineHeight: "24px",
  marginBottom: "12px",
});

export const textStyle = (theme: TTheme) =>
  ({
    margin: `8px 0px 28px`,
    color: theme.grey8Color,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    wordBreak: "break-word",
  } as const);

export const iconWrapStyle = {
  position: "absolute" as const,
};

export const modalContentStyle = {
  marginLeft: "32px",
  whiteSpace: "pre-wrap",
  display: "flex",
  flexDirection: "column",
  width: "100%",
} as const;

export const modalFooterStyle = {
  textAlign: "right" as const,
};

export const errorIconStyle = (theme: TTheme) => ({
  color: theme.red6Color,
  fontSize: "20px",
});

export const infoIconStyle = (theme: TTheme) => ({
  color: theme.blue6Color,
  fontSize: "24px",
});

export const bodyModalStyle = {
  padding: `20px 28px 0`,
  overflow: "hidden",
  display: "flex",
};

export const modalStyle = (theme: TTheme) =>
  ({
    ".ant-modal-centered": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    ".ant-modal-content": {
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },

    padding: `48px 0`,
    height: "100%",
    display: "inline-flex !important",
    alignItems: "center",
    justifyContent: "center",
    ...scrollDefaultStyle(theme),
  } as const);
