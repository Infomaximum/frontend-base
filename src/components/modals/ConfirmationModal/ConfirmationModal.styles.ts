import type { ModalProps } from "antd/lib/modal";

export const iconModalStyle = (theme: TTheme) => ({
  fontSize: `${theme.h2FontSize}px`,
  color: `${theme.gold6Color}`,
  paddingRight: "12px",
});

export const modalStyle = {
  body: {
    padding: "20px 24px 0px",
  },
} satisfies ModalProps["styles"];

export const titleModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey10Color,
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 500,
    verticalAlign: "text-bottom",
    lineHeight: `${theme.smallLineHeight}px`,
    paddingBottom: "12px",
  }) as const;

export const bodyModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey10Color,
    fontSize: `${theme.h4FontSize}px`,
    display: "block",
    lineHeight: "22px",
    paddingTop: "8px",
    paddingBottom: "28px",
  }) as const;

export const additionalButtonStyle = {
  position: "absolute" as const,
  left: "24px",
};

export const confirmationModalStyle = {
  display: "flex",
  alignItems: "flex-start",
};

export const rightFooterButtonStyle = { marginLeft: "8px" };
