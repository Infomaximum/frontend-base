import type { ModalProps } from "antd";

export const iconDefaultStyle = (theme: TTheme) => ({
  fontSize: "20px",
  color: `${theme.red6Color}`,
  padding: "1px 12px 1px 1px",
});

export const modalStyle = {
  body: {
    padding: "20px 24px 0",
  },
} satisfies ModalProps["styles"];

export const titleModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey10Color,
    fontSize: `${theme.subtitleFontSize}px`,
    fontWeight: 500,
    verticalAlign: "text-bottom",
    wordBreak: "break-word",
    paddingBottom: "12px",
  }) as const;

export const bodyModalStyle = (theme: TTheme) =>
  ({
    color: theme.grey10Color,
    fontSize: `${theme.h4FontSize}px`,
    paddingTop: "8px",
    paddingBottom: "28px",
    display: "block",
    lineHeight: "20px",
    wordBreak: "break-word",
  }) as const;

export const modalContentStyle = {
  display: "flex",
};
