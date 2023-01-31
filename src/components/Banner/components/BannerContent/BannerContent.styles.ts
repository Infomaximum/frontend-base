export const bannerContentStyle = (theme: TTheme) =>
  ({
    position: "relative",
    maxHeight: `${4 * theme.defaultLineHeight}px`,
    overflow: "hidden",
  } as const);

export const bannerContentParagraphStyle = {
  margin: 0,
  wordBreak: "break-word",
} as const;

export const bannerContentShowMoreStyle = (
  backgroundColor: string | undefined
) =>
  ({
    position: "absolute",
    bottom: 0,
    right: 0,
    display: "inline-block",
    background: backgroundColor,
  } as const);

export const bannerContentShowMoreButtonStyle = (theme: TTheme) =>
  ({
    height: "20px",
    padding: 0,
    color: theme.thrust4Color,
    ":hover": {
      color: theme.thrust3Color,
    },
    ":focus": {
      color: theme.thrust3Color,
    },
    ":active": {
      color: theme.thrust5Color,
    },
  } as const);
