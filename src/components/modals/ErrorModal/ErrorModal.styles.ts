import type { ModalProps } from "antd/lib/modal";
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
    color: theme.grey10Color,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    wordBreak: "break-word",
  }) as const;

export const iconWrapStyle = {
  position: "absolute" as const,
};

export const modalContentStyle = {
  marginLeft: "34px",
  whiteSpace: "pre-wrap",
  display: "flex",
  flexDirection: "column",
  width: "100%",
} as const;

export const getModalFooterStyle = (hasAddableButtons: boolean) => ({
  textAlign: "right" as const,
  ...(hasAddableButtons && {
    display: "flex",
    justifyContent: "space-between",
  }),
});

export const errorIconStyle = (theme: TTheme) => ({
  color: theme.red6Color,
  fontSize: "20px",
});

export const infoIconStyle = (theme: TTheme) => ({
  color: theme.blue6Color,
  fontSize: "24px",
});

export const modalComponentsStyle = {
  body: {
    padding: `20px 24px 0`,
    overflow: "hidden",
    display: "flex",
  },
  content: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
} satisfies ModalProps["styles"];

export const modalStyle = (theme: TTheme) =>
  ({
    ".ant-modal-centered": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    padding: `48px 0`,
    ...scrollDefaultStyle(theme),
  }) as const;

export const additionalButtonsStyle = {
  display: "flex",
  gap: "8px",
};
