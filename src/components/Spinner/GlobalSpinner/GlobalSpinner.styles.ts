import { keyframes } from "@emotion/react";
import { isNull } from "lodash";

const enum EAnimationTimingFunction {
  LINEAR = "linear",
  CENTER = "cubic-bezier(.5,.25,.5,.75)",
  END = "cubic-bezier(0,0,0,1)",
}

export const wrapperGlobalSpinnerStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  minHeight: "100px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
} as const;

export const spinnerContainerStyle = {
  display: "flex",
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
} as const;

const getKeyframeValueStyle = (
  rotation: number,
  strokeDashoffset: number,
  animationFunction?: string | null
) => ({
  transform: `scale(1, -1) rotate(${rotation}deg)`,
  strokeDashoffset: strokeDashoffset,
  animationTimingFunction: animationFunction
    ? animationFunction
    : isNull(animationFunction)
      ? ""
      : EAnimationTimingFunction.LINEAR,
});

const path2Animation = keyframes({
  "0%, 10%": getKeyframeValueStyle(359, 291, null),
  "20.5%": getKeyframeValueStyle(359, 292),
  "31%": getKeyframeValueStyle(348, 304),
  "41.5%": getKeyframeValueStyle(330, 328),
  "55%": getKeyframeValueStyle(254, 402, EAnimationTimingFunction.CENTER),
  "68.5%": getKeyframeValueStyle(88, 339),
  "82%": getKeyframeValueStyle(20, 302, EAnimationTimingFunction.END),
  "100%": getKeyframeValueStyle(-1, 291),
});

const path1Animation = keyframes({
  "0%, 10%": getKeyframeValueStyle(359, 289, null),
  "20.5%": getKeyframeValueStyle(359, 291),
  "31%": getKeyframeValueStyle(354, 298),
  "41.5%": getKeyframeValueStyle(350, 308),
  "55%": getKeyframeValueStyle(314, 368, EAnimationTimingFunction.CENTER),
  "68.5%": getKeyframeValueStyle(148, 338),
  "82%": getKeyframeValueStyle(28, 304, EAnimationTimingFunction.END),
  "100%": getKeyframeValueStyle(-1, 289),
});

export const getSpinnerStyle = (isVisible: boolean) => (theme: TTheme) =>
  ({
    display: isVisible ? "block" : "none",
    width: "24px",
    height: "24px",

    "g > path": {
      strokeDasharray: 289,
      strokeDashoffset: 290,
      strokeLinecap: "round",
      fill: "none",
      transformOrigin: "50px 50px",
    },

    "g > #path_2": {
      stroke: theme.graphite1Color,
      strokeWidth: 8,
      transform: "scale(1, -1)",
      animation: `${path2Animation} 1.5s infinite linear`,
    },
    "g > #path_1": {
      stroke: theme.thrust3Color,
      strokeWidth: 7,
      transform: "scale(1, -1)",
      animation: `${path1Animation} 1.5s infinite linear`,
    },
  }) as const;
