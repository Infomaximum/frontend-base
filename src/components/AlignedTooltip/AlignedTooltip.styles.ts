import { getTextClampStyle } from "@infomaximum/base/src/styles";

export const wrapperStyle = {
  display: "flex",
  alignItems: "center",
  minWidth: 0,
} as const;

export const getAlignedTooltipStyle = (numberOfLines: number) =>
  numberOfLines > 1
    ? getTextClampStyle(numberOfLines)
    : ({
        overflow: "hidden",
        whiteSpace: "pre",
        textOverflow: "ellipsis",
        alignItems: "center",
      } as const);

export const getExpandByParentStyle = (expand?: boolean) => {
  return expand ? { width: "100%" } : { maxWidth: "100%" };
};
