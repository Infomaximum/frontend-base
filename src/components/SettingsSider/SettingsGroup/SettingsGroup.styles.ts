import type { Interpolation } from "@emotion/react";

export const linkWrapperStyle = {
  height: "28px",
  display: "block",
  padding: "3px 6px 3px 8px",
};

export const titleStyle: Interpolation<TTheme> = (theme) => ({
  fontSize: theme.h4FontSize,
  lineHeight: "22px",
  color: theme.grey7Color,
  ":first-letter": {
    textTransform: "uppercase",
  },
  width: "100%",
  ...linkWrapperStyle,
});

export const wrapperStyle: Interpolation<TTheme> = () => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

export const linkStyle: Interpolation<TTheme> = (theme) => ({
  color: theme.grey10Color,
  fontSize: theme.h4FontSize,
  lineHeight: "22px",
  border: `1px solid ${theme.grey1Color}`,
  display: "block",
  ":hover": {
    color: "inherit",
    backgroundColor: theme.grey4Color,
    borderRadius: "4px",
    border: `1px solid ${theme.grey4Color}`,
  },
});

export const betaLinkStyle = {
  display: "flex",
  alignItems: "center",
  columnGap: 8,
};

export const currentRouteStyle = (theme: TTheme) =>
  ({
    "&&": {
      backgroundColor: theme.thrust0Color,
      border: `1px solid ${theme.thrust2Color}`,
      borderRadius: "4px",
      cursor: "default",
      pointerEvents: "none",
    },
  }) as const;
