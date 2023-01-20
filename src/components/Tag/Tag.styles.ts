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
} as const;
