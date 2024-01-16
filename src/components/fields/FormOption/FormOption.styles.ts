import { ESpaceSize } from "../../../decorators/contexts/SpaceSizeContext";

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

export const spaceFormOptionStyle = (spaceSize: ESpaceSize) => (theme: TTheme) => ({
  marginBottom: `${spaceSize === ESpaceSize.small ? theme.smallSpace : theme.defaultSpace}px`,
});

export const fieldDescriptionStyle = (theme: TTheme) => ({
  marginTop: 3,
  fontSize: theme.h4FontSize,
  lineHeight: "16px",
  color: theme.grey7Color,
});
