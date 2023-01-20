/**
 * Стили надписи под картинкой компонента Empty
 */
export const emptyDescriptionStyle = (theme: TTheme) => ({
  fontSize: `${theme.h1FontSize}px`,
  lineHeight: `${theme.mediumLineHeight}px`,
  color: theme.grey9Color,
});

export const emptyHintStyle = (theme: TTheme) => ({
  fontSize: `${theme.subtitleFontSize}px`,
  lineHeight: `${theme.smallLineHeight}px`,
  color: theme.grey7Color,
});

export const wrapperEmptyTableStyle = { position: "relative", marginTop: "72px" } as const;

export const wrapperEmptyStyle = {} as const;

/**
 * Стили надписи картинки компонента Empty
 */
export const emptyImageStyle = { width: "100%", height: "100%" };

export const wrapperNotTableEmptyStyle = {} as const;
