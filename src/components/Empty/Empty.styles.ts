/**
 * Стили надписи под картинкой компонента Empty
 */
export const emptyDescriptionStyle = (theme: TTheme) => ({
  fontSize: `${theme.h1FontSize}px`,
  lineHeight: `${theme.mediumLineHeight}px`,
  color: theme.grey10Color,
});

export const emptyHintStyle = (theme: TTheme) => ({
  fontSize: `${theme.subtitleFontSize}px`,
  lineHeight: `${theme.smallLineHeight}px`,
  color: theme.grey7Color,
});

export const getWrapperEmptyTableStyle = (isLoading?: boolean, isVirtualized?: boolean) => {
  const marginValue = isLoading ? (isVirtualized ? 22 : 23) : 56;

  return {
    position: "relative",
    margin: `${marginValue}px 0px`,
  };
};

export const wrapperEmptyStyle = {} as const;

/**
 * Стили надписи картинки компонента Empty
 */
export const emptyImageStyle = {
  width: "100%",
  height: "100%",
  marginBottom: "25px",
};

export const wrapperNotTableEmptyStyle = {} as const;
