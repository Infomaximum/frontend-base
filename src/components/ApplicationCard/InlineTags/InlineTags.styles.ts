export const containerStyle = { display: "flex" };

export const tagSidePadding = 7;
export const tagsGutter = 8;
export const tagFontSize = 12;
export const tagBorderWidth = 1;

export const getTagContainerStyle = (flexShrink: number) =>
  ({
    flexShrink,
    overflow: "hidden",
    marginRight: `${tagsGutter}px`,
  } as const);

export const tagStyle = {
  borderWidth: `${tagBorderWidth}px`,
  paddingLeft: `${tagSidePadding}px`,
  paddingRight: `${tagSidePadding}px`,
  fontSize: `${tagFontSize}px`,
  margin: `${0}px`,
} as const;

export const outerEllipsisFontSize = 12;
export const outerEllipsisPaddingLeft = 8;

export const ellipsisStyle = (theme: TTheme) =>
  ({
    cursor: "pointer",
    fontSize: `${outerEllipsisFontSize}px`,
    paddingLeft: `${outerEllipsisPaddingLeft}px`,
    color: theme.grey8Color,
    lineHeight: "22px",
  } as const);
