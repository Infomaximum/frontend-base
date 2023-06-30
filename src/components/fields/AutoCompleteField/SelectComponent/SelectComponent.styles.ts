import { hintStyle } from "../../../Select/DropdownPlaceholder/DropdownPlaceholder.styles";
import { suffixIconStyle as suffixIconCommonStyle } from "../../../Select/Select.styles";

export const hintContainerStyle = {
  float: "right",
  position: "relative",
} as const;

export const suffixIconStyle = (theme: TTheme) =>
  ({
    ...suffixIconCommonStyle(theme),
    pointerEvents: "auto",
  } as const);

export const closeCircleStyle = (theme: TTheme) => ({
  fontSize: "14px",
  marginTop: "-1px",
  marginLeft: "-6px",
  color: theme.grey6Color,
  ":hover": {
    color: theme.grey7Color,
  },
});

export const inputSelectedContentStyle = {
  overflow: "hidden",
};

export const hintOptionStyle = {
  ...hintStyle,
  whiteSpace: "normal",
} as const;
