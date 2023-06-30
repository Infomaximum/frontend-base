import { textOverflowOverlayStyle } from "../../styles";

export const getTagStyle = (borderColor?: string, textColor?: string, bgColor?: string) =>
  ({
    position: "relative",
    backgroundColor: `${bgColor} !important`,
    border: borderColor === "none" ? "none" : `1px solid ${borderColor}`,
    color: `${textColor}`,
    maxWidth: "100%",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "12px",
    height: "22px",
    lineHeight: "22px",
    // Чтобы убрать анимацию при клике по тегу [PT-13063], убрать при обновлении до Antd V5
    ":after": {
      animation: "none",
    },
    overflow: "hidden",
    svg: {
      zIndex: 2,
    },
  } as const);

export const notClosableTagStyle = {
  ":hover": {
    opacity: 1,
  },
};

export const tagContentStyle = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  userSelect: "none",
} as const;

export const tagOverlayStyle = (backgroundColor: string, rightOffset: string | number = "7px") =>
  ({
    ...textOverflowOverlayStyle({
      right: rightOffset,
      zIndex: 1,
      backgroundColor: backgroundColor,
    }),
  } as const);
