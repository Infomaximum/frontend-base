import { suffixIconStyle } from "../../../Select";

export const hintContainerStyle = {
  float: "right",
  position: "relative",
} as const;

export const iconBarsDrawerStyle = (theme: TTheme) =>
  ({
    ...suffixIconStyle(theme),
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
  textOverflow: "ellipsis",
};

export const dropdownStyle = { visibility: "hidden" as const };
