import { ESpaceSize } from "../../../decorators/contexts/SpaceSizeContext";

export const formOptionLabelStyle = (theme: TTheme) => ({
  display: "inline-flex",
  alignItems: "center",
  color: theme.grey10Color,
  width: "100%",
});

const formOptionHeight = 28;

export const formOptionComponentWrapperStyle = {
  float: "left",
  minHeight: `${formOptionHeight}px`,
} as const;

export const formOptionTooltipContainerDefaultStyle = {
  whiteSpace: "nowrap",
  display: "inline-flex",
} as const;

export const formOptionRightTooltipContainerStyle = {
  ...formOptionTooltipContainerDefaultStyle,
  position: "absolute",
  height: `${formOptionHeight}px`,
} as const;

export const labelContainerStyle = {
  display: "flex",
  flexWrap: "nowrap",
} as const;

export const labelWrapperStyle = {
  ".ant-form-item-label": {
    paddingBottom: 0,
  },
};

export const getSpaceFormOptionStyle = (spaceSize: ESpaceSize) => (theme: TTheme) => {
  const getMarginBottomValue = () => {
    switch (spaceSize) {
      case ESpaceSize.table:
        return 0;
      case ESpaceSize.large:
        return theme.defaultSpace;
      default:
        return theme.smallSpace;
    }
  };

  return {
    marginBottom: `${getMarginBottomValue()}px`,
    width: "100%",
  };
};

export const fieldDescriptionStyle = (theme: TTheme) => ({
  marginTop: 3,
  fontSize: theme.h4FontSize,
  lineHeight: "16px",
  color: theme.grey7Color,
});
