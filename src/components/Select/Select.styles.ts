export const disableSelectStyle = (theme: TTheme) => ({
  backgroundColor: theme.grey3Color,
  borderRadius: "4px",
});

//todo: Пименов Виктор: разобраться почему стили не попадают из less antd
export const multipleSelectStyle = {
  ".ant-select-selection-search": {
    marginInlineStart: "3px",
    height: "22px",
    textOverflow: "ellipsis",
  },
  ".ant-select-selection-overflow-item+.ant-select-selection-overflow-item .ant-select-selection-search":
    {
      marginInlineStart: 0,
    },
};

export const displaySelectStyle = (iconSlotCount: number) => (theme: TTheme) => {
  const iconWidth = 16;
  const spaceAroundIcons = 8;

  const getSuffixWidth = (iconsCount: number) =>
    iconsCount * iconWidth + (iconsCount + 1) * spaceAroundIcons;

  return {
    display: "block",
    color: theme.grey9Color,
    lineHeight: "22px",

    ".ant-select-selector": {
      paddingRight: `${iconSlotCount ? getSuffixWidth(iconSlotCount) : 3}px !important`,

      ".ant-select-selection-search-input": {
        textOverflow: "ellipsis",
      },

      // overlay для работы cursor: pointer
      "&:before": {
        position: "absolute",
        width: `${getSuffixWidth(iconSlotCount)}px`,
        height: "26px",
        top: 0,
        right: 0,
        cursor: "pointer",
        content: "''",
      },

      ".ant-select-selection-placeholder": {
        width: `calc(100% - ${getSuffixWidth(iconSlotCount)}px)`,
      },
    },
    ".ant-select-selection-item": {
      paddingRight: "0px !important",
      display: "flex",
      alignItems: "center",
      // Для центрирования тегов
      "> span": {
        display: "flex",
        alignItems: "center",
      },
    },
    ".ant-select-arrow, .ant-select-clear": {
      top: "6px",
      marginTop: 0,
      width: `${iconWidth}px`,
      height: "unset",
      alignItems: "unset",
      fontSize: "14px",
      lineHeight: 1.25,
    },
    ".ant-select-clear": {
      opacity: 1,
      color: `${theme.grey6Color}`,
      right: `${iconSlotCount ? getSuffixWidth(iconSlotCount - 1) : 7}px`,
      ":hover": {
        color: theme.grey9Color,
      },
    },
    ".ant-select-arrow": {
      right: spaceAroundIcons,
    },
    ".ant-select.ant-select-in-form-item": {
      display: "flex",
      alignItems: "center",
    },
  } as const;
};

export const commonTagStyle = (theme: TTheme) => ({
  fontSize: `${theme.h5FontSize}px`,
  lineHeight: `${theme.verySmallLineHeight}px`,
  margin: "2px 4px 2px 0",
  display: "flex",
  alignItems: "center",
});

export const disableTagStyle = (theme: TTheme) => ({
  ...commonTagStyle(theme),
  background: theme.grey3Color,
  border: `1px solid ${theme.grey5Color}`,
  color: theme.grey7Color,
});

export const tagStyle = (theme: TTheme) => ({
  ...commonTagStyle(theme),
  background: theme.grey3Color,
  border: `1px solid ${theme.grey4Color}`,
  color: theme.grey8Color,
});

export const closeIconStyle = (theme: TTheme) => ({
  color: `${theme.grey7Color}`,
  marginLeft: "1px",
  display: "flex",
  alignItems: "center",
});

export const suffixIconStyle = (theme: TTheme) => ({
  fill: theme.grey6Color,
  ":hover": {
    fill: theme.grey9Color,
  },
});

export const suffixIconSpinnerStyle = () => ({
  height: "14px",
  ".ant-spin": {
    lineHeight: "unset",
  },
});

export const textWrapperStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
} as const;
