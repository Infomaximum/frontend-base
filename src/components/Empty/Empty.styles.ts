/**
 * Стили надписи под картинкой компонента Empty
 */
export const emptyDescriptionStyle = (theme: TTheme) => ({
  fontSize: `${theme.h1FontSize}px`,
  lineHeight: `${theme.smallLineHeight}px`,
  color: theme.grey10Color,
});

export const emptyHintStyle = (theme: TTheme) => ({
  fontSize: `${theme.subtitleFontSize}px`,
  lineHeight: `${theme.defaultLineHeight}px`,
  color: theme.grey7Color,
  "& > *:first-child > *:first-child": {
    marginBottom: "12px",
  },
});

export const getWrapperEmptyTableStyle = (isLoading?: boolean, isVirtualized?: boolean) => {
  const marginValue = isLoading ? (isVirtualized ? 22 : 23) : 48;

  return {
    position: "relative",
    margin: `${marginValue}px 0px`,
  };
};

export const wrapperEmptyStyle = {} as const;

/**
 * Контейнерные (табличные) стили надписи картинки компонента Empty
 */
export const emptyImageStyle = {
  image: { display: "flex", width: "100%", height: "100%", marginBottom: "8px" },
};

export const wrapperNotTableEmptyStyle = {
  marginTop: "48px",
} as const;
