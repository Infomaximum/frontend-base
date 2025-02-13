import { first, last, sum, takeRight, tail } from "lodash";

export const getDisableSelectStyle =
  (bordered = true) =>
  (theme: TTheme) => ({
    backgroundColor: bordered ? theme.grey3Color : theme.grey1Color,
    borderRadius: "4px",
    ".ant-select-selector .ant-select-selection-item": {
      color: `${theme.grey7Color} !important`,
    },
  });

// todo: разобраться почему стили не попадают из less antd
export const multipleSelectStyle = {
  ".ant-select-selection-search": {
    marginInlineStart: "3px",
    height: "22px",
  },
  ".ant-select-selection-overflow-item+.ant-select-selection-overflow-item .ant-select-selection-search":
    {
      marginInlineStart: 0,
    },
  // фикс inline-block из antd 5 (длинный тег растягивался безгранично)
  ".ant-select-selection-overflow-item": {
    display: "block",
  },
};

export const getDisplaySelectStyle = (iconSlotCount: number) => (theme: TTheme) => {
  const iconWidths = takeRight([24, 28], iconSlotCount);
  const suffixWidth = sum(iconWidths);
  const iconHeight = 28;
  const inputRightPadding = suffixWidth ? 4 : 3;

  return {
    display: "block",
    color: theme.grey10Color,
    lineHeight: "22px",
    ".ant-select-selector": {
      background: "transparent !important",
      paddingRight: `${suffixWidth}px !important`,

      ".ant-select-selection-overflow": {
        paddingRight: `${inputRightPadding}px`,
      },

      "& > .ant-select-selection-search": {
        right: `${suffixWidth}px`,
        paddingRight: `${inputRightPadding}px`,
      },

      // overlay для работы cursor: pointer
      "&:before": {
        position: "absolute",
        width: `${suffixWidth}px`,
        height: `${iconHeight}px`,
        top: "-1px",
        right: "-1px",
        cursor: "pointer",
        content: "''",
      },

      ".ant-select-selection-placeholder": {
        width: `calc(100% - ${suffixWidth + 7}px)`,
        textOverflow: "unset",
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
      top: 0,
      marginTop: 0,
      height: `${iconHeight}px`,
      zIndex: "100",
    },
    ".ant-select-clear": {
      width: `${first(iconWidths)}px`,
      right: `${sum(tail(iconWidths))}px`,
      opacity: 0,
      color: `${theme.grey6Color}`,
      background: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      ":hover": {
        color: theme.grey7Color,
      },
      ".anticon-close-circle": {
        background: theme.grey1Color, // для перекрытия иконки стрелки
      },
    },
    ".ant-select-arrow": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${last(iconWidths)}px`,
      right: 0,
      opacity: `${1} !important`,
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
  margin: "1px 4px 1px 0",
  display: "flex",
  alignItems: "center",
  paddingRight: 0,

  ".anticon-close": {
    width: 24,
    height: 22,
    display: "flex",
    alignItems: "center",
    paddingLeft: "4px",
  },

  ".ant-tag-close-icon, .anticon-close": {
    marginLeft: 0,
  },
});

export const getSelectTagStyle = (closable: boolean, color?: keyof TTheme["tagsStyles"]) => {
  if (closable) {
    return commonTagStyle;
  }

  if (color === "greyInv") {
    return disableGreyInvTagStyle;
  }

  return disableTagStyle;
};

export const disableTagStyle = (theme: TTheme) => ({
  ...commonTagStyle(theme),
  cursor: "not-allowed",
  paddingRight: "7px",
});

const disableGreyInvTagStyle = (theme: TTheme) => ({
  ...disableTagStyle(theme),
  color: `${theme.tagsStyles.greyInv.textColor} !important`,
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
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "auto" as const, // в antd по умолчанию none
  svg: {
    fill: theme.grey6Color,
  },
  ":hover": {
    svg: {
      fill: theme.grey10Color,
    },
  },
});

export const suffixIconSpinnerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "14px",
  ".ant-spin": {
    lineHeight: "unset",
  },
};

export const arrowSuffixIconStyle = (theme: TTheme) => ({
  ...suffixIconStyle(theme),
  pointerEvents: "none" as const,
});
