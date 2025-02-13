import type { ModalFuncProps } from "antd";

export const marginValue = 8;

export const boldTitleStyle = {
  fontWeight: 500,
  lineHeight: "24px",
  display: "block",
};

export const titleStyle = (theme: TTheme) =>
  ({
    ...boldTitleStyle,
    fontSize: theme.subtitleFontSize,
    userSelect: "none",
  }) as const;

export const getModalStyle = (height: ModalFuncProps["height"]) =>
  ({
    footer: {
      borderTop: "none",
      padding: "12px 24px 20px",
      marginTop: 0,
    },
    header: {
      padding: "20px 58px 12px 24px",
      border: "none",
      borderRadius: "4px 4px 0 0",
      marginBottom: 0,
    },
    content: {
      borderRadius: "4px",
      padding: 0,
      flexDirection: "column",
      maxHeight: `calc(100dvh - ${marginValue * 2}px)`,
      height: height,
      display: "flex",
    },
    body: {
      overflow: "auto",
      flexGrow: 1,
      position: "relative",
    },
  }) satisfies ModalFuncProps["styles"];

export const modalStyle = {
  ".ant-modal-close": {
    width: "48px",
    height: "48px",
    top: "8px",
    right: "8px",
    ":hover": {
      backgroundColor: "transparent",
    },
    ":active": {
      backgroundColor: "transparent",
    },
  },

  ".ant-modal-close-x": {
    width: "100%",
    height: "100%",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ".ant-modal-close-icon": {
      display: "block",
    },
  },
} as const;
