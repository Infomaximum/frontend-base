import type { Interpolation } from "@emotion/react";

export const getCssConversionStyle = <T extends TDictionary>(
  theme: T,
  styles: Interpolation<T>
): Interpolation<T> => {
  if (Array.isArray(styles)) {
    return styles.map((s) => getCssConversionStyle(theme, s));
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

// для дальнейшей кастомизации стилей всех лаяутов
export const commonLayoutStyle = () =>
  ({
    height: "100%",
    position: "relative",
    background: "inherit",
  }) as const;

export const commonContentStyle = () =>
  ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "0px",
    position: "relative",
  }) as const;

// стили с отступами для списков
export const commonContentListStyle = () =>
  ({
    ...commonContentStyle(),
    padding: `12px 16px 0px 16px`,
    overflow: "hidden",
  }) as const;

// стили для вложенных списков
export const commonContentListInsideStyle = () =>
  ({
    ...commonContentStyle(),
    backgroundColor: "inherit",
    overflow: "hidden",
  }) as const;

export const commonContentListDefaultStyle = (theme: TTheme) =>
  ({
    ...commonContentListStyle(),
    background: theme.grey4Color,
  }) as const;

/** Cтиль наложения обёртки:
 * multiply - для светлых цветов
 * screen - для тёмных цветов
 */
export type TTextOverflowMode = "multiply" | "screen";

/** Cтиль для обёртки элемента, где возможно переполнение текста */
export const getTextOverflowWrapperStyle = (mode: TTextOverflowMode = "multiply") =>
  ({
    position: "relative",
    overflow: "hidden",
    mixBlendMode: mode,
  }) as const;

export const dropDownHeaderPanelButtonStyle = (theme: TTheme) => ({
  minWidth: "28px",
  borderRadius: "0 2px 2px 0",
  borderLeftColor: theme.thrust1Color,
  padding: "0px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // Фикс для Safari
  "& > .anticon.anticon-down": {
    fontSize: "14px",
    height: "14px",
    width: "14px",
  },

  "&:hover, &:focus": {
    borderLeftColor: theme.thrust1Color,
  },
  "&:active": {
    borderLeftColor: theme.thrust5Color,
  },
  svg: {
    marginRight: 0,
  },
});

export const changeHeaderPanelButtonStyle = (theme: TTheme) => ({
  marginLeft: "8px",
  color: theme.headerPanel.textColor,
  borderRadius: "2px 0 0 2px",
});

export const getTextClampStyle = (numberOfLines: number) =>
  ({
    WebkitLineClamp: numberOfLines,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
  }) as const;

/** Cтилb фона обычного контейнера c формой новой навигации */
export const commonProfileFormLayoutStyle = {
  overflow: "hidden",
};

export const commonProfileFormScrollContainerStyle = (theme: TTheme) => ({
  padding: "12px 6px 0px 16px",
  background: theme.grey4Color,
  overflowY: "scroll" as const,
});
