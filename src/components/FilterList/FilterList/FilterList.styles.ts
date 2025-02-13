import { keyframes } from "@emotion/react";

const animationFilter = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const animationRemoveFilter = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
`;

export const wrapperStyle = {
  position: "relative",
  width: "100%",
  mixBlendMode: "screen",
  "&: hover": {
    mixBlendMode: "normal",
  },
} as const;

export const wrapperFiltersStyle = {
  position: "absolute",
  display: "flex",
  right: 0,
  left: 0,
  height: "100%",
} as const;

export const wrapperVisibleFiltersStyle = {
  display: "flex",
  overflow: "hidden",
  padding: "0px",
  margin: "0px",
  "& > li": {
    display: "flex",
  },
};

export const getAnimationAddStyle = (countFilters: number, childrenLength: number) => ({
  ...wrapperVisibleFiltersStyle,
  [`& > li:nth-of-type(${countFilters})`]: {
    animation: countFilters < childrenLength ? undefined : `${animationFilter} 150ms ease`,
  },
});

export const getAnimationRemoveStyle = (indexStart: number, indexEnd: number) => ({
  ...wrapperVisibleFiltersStyle,
  [`& > li:nth-of-type(n+${indexStart}):nth-of-type(-n+${indexEnd})`]: {
    animation: `${animationRemoveFilter} 150ms ease`,
  },
});

export const overlayStyle = {
  width: "225px",
  overflow: "hidden",
  borderRadius: "2px",
} as const;

export const menuStyle = (theme: TTheme) => ({
  backgroundColor: theme.grey13Color,
  "::-webkit-scrollbar-thumb": {
    backgroundColor: theme.grey8Color,
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: theme.grey13Color,
  },
});

export const dividerHorizontalStyle = (theme: TTheme) => ({
  margin: "0px",
  backgroundColor: theme.graphite1Color,
});

export const dividerVerticalStyle = (theme: TTheme) => ({
  height: `${theme.heightDividerHeaderMenu}px`,
  margin: "0px",
  top: "6px",
  backgroundColor: theme.graphite2Color,
});
