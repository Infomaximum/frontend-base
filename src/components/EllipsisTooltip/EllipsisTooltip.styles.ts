export const ellipsisTextWrapper = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap" as const,
};

// Чтобы скрыть браузерный тултип в Safari
export const ellipsisStyleForSafari = {
  "span > span:after": {
    content: "''",
    display: "block",
  },
};
