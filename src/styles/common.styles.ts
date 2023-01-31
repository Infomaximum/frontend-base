import type { Interpolation } from "@emotion/react";

export const cssStyleConversion = <T extends TDictionary>(
  theme: T,
  styles: Interpolation<T>
): Interpolation<T> => {
  if (Array.isArray(styles)) {
    return styles.map((s) => cssStyleConversion(theme, s));
  }

  if (typeof styles === "function") {
    return styles(theme);
  }

  return styles;
};

export const ellipsisStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export const closeModalIconStyle = (theme: TTheme) => ({
  height: "48px",
  width: "48px",
  display: "table-cell",
  verticalAlign: "middle",
  color: theme.grey7Color,
  fontSize: "12px",

  ":hover": {
    color: theme.grey9Color,
  },
});
