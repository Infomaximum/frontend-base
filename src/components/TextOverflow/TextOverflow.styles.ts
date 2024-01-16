import { getGradientColorsFromTransparent } from "../../utils/colors";

export const textOverflowStyle = {
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
} as const;

export const textOverflowOverlayStyle = (overlay: string) => (theme: TTheme) => {
  const { minOpacity, maxOpacity } = getGradientColorsFromTransparent(theme, overlay);

  return {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "8px",
    backgroundImage: `linear-gradient(to right, ${minOpacity}, ${maxOpacity})`,
    pointerEvents: "none",
  } as const;
};
