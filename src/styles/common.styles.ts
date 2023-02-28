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
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.grey7Color,

  ":hover": {
    color: theme.grey9Color,
  },
});

//для дальнейшей кастомизации стилей всех лаяутов
export const commonLayoutStyle = () =>
  ({
    height: "100%",
    position: "relative",
  } as const);

export const commonContentStyle = () =>
  ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "0px",
    position: "relative",
  } as const);

export const commonContentListStyle = () =>
  ({
    ...commonContentStyle(),
    padding: `16px 24px 0 24px`,
    overflow: "hidden",
  } as const);
