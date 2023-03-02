export const getTagStyle = (borderColor?: string, textColor?: string, bgColor?: string) => ({
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
});

export const notClosableTagStyle = {
  ":hover": {
    opacity: 1,
  },
};

export const tagContentStyle = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  userSelect: "none",
} as const;
