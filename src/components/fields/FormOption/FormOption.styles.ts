import { ESpaceSize } from "./FormOption";

export const formOptionLabelStyle = (theme: TTheme) => ({
  color: theme.grey8Color,
});

const formOptionHeight = 28;

export const formOptionComponentWrapperStyle = {
  float: "left",
  minHeight: `${formOptionHeight}px`,
} as const;

export const formOptionTooltipContainerStyle = {
  position: "absolute",
  whiteSpace: "nowrap",
  display: "inline",
  marginLeft: "8px",
  height: `${formOptionHeight}px`,
} as const;

export const labelWrapperStyle = {
  ".ant-form-item-label": {
    paddingBottom: 0,
  },
};

export const spaceFormOptionStyle = (spaceSize?: ESpaceSize) => ({
  marginBottom: `${spaceSize === ESpaceSize.small ? 12 : 24}px`,
});
