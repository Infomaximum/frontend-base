import { getTextClampStyle } from "../../styles";

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
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        alignItems: "center",
      } as const);

export const getExpandByParentStyle = (expand?: boolean) => {
  return expand ? { width: "100%" } : {};
};
