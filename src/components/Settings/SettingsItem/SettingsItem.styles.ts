import type { Interpolation } from "@emotion/react";
import type { NCore } from "@im/core";

export const titleStyle: Interpolation<TTheme> = (theme) => ({
  fontSize: theme.h5FontSize,
  lineHeight: "16px",
  fontWeight: 500,
  color: theme.grey65Color,
  textTransform: "uppercase",
});

export const wrapperStyle: Interpolation<TTheme> = () => ({
  display: "flex",
  flexDirection: "column",
  width: "220px",
  padding: "8px 0px 0px 0px",
  margin: "16px 0",
});

export const linkStyle: Interpolation<TTheme> = (theme) => ({
  color: theme.grey10Color,
  fontSize: `${theme.h4FontSize}px`,
  lineHeight: "22px",
  display: "block",
  paddingTop: "8px",
});

export function calculateSize(route: NCore.IRoutes): number {
  const linkStylePaddingTop = 8;
  const wrapperStyleMarginTop = 16;
  const wrapperStylePaddingTop = 8;
  const lineHeight = 22;

  return (
    (route.routes?.length ?? 1) * (lineHeight + linkStylePaddingTop) +
    lineHeight +
    wrapperStylePaddingTop +
    wrapperStyleMarginTop
  );
}

export const leftColumnStyles = {
  marginLeft: "24px",
};
