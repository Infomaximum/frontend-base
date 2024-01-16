export const closeBannerAnimationDuration = 0.5; // секунды

export const bannerStyle = {
  flexShrink: 0,
  maxHeight: "200px",

  "span > svg": {
    overflow: "visible", // fix для Mozilla FireFox
  },
} as const;

export const animationBannerStyle = {
  transition: `max-height ${closeBannerAnimationDuration}s`,
  overflow: "hidden",
  maxHeight: 0,
} as const;

export const dontShowAgainWrapperBannerStyle = {
  marginTop: "12px",
  display: "flex",
  alignItems: "center",
} as const;

export const dontShowAgainCheckboxBannerStyle = {
  marginLeft: "16px",
} as const;
