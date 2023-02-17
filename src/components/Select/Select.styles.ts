import { first, last, sum, takeRight, tail } from "lodash";

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
  const iconWidths = takeRight([24, 28], iconSlotCount);
  const suffixWidth = sum(iconWidths);
  const iconHeight = 28;
  const inputRightPadding = suffixWidth ? 4 : 3;

  return {
    display: "block",
    color: theme.grey9Color,
    lineHeight: "22px",

    ".ant-select-selector": {
      paddingRight: `${suffixWidth}px !important`,

      ".ant-select-selection-search-input": {
        textOverflow: "ellipsis",
      },

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
        width: `calc(100% - ${suffixWidth}px)`,
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
    },
    ".ant-select-clear": {
      width: `${first(iconWidths)}px`,
      right: `${sum(tail(iconWidths))}px`,
      opacity: 1,
      color: `${theme.grey6Color}`,
      background: "transparent",
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      paddingLeft: "5px",
      ":hover": {
        color: theme.grey9Color,
      },
      ".anticon-close-circle": {
        background: theme.grey1Color, // для перекрытия иконки стрелки
      },
    },
    ".ant-select-arrow": {
      width: `${last(iconWidths)}px`,
      right: 0,
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
  paddingRight: 0,

  ".anticon-close": {
    width: 24,
    height: 22,
    display: "flex",
    alignItems: "center",
    paddingLeft: "5px",
  },

  ".ant-tag-close-icon, .anticon-close": {
    marginLeft: 0,
  },
});

export const disableTagStyle = (theme: TTheme) => ({
  ...commonTagStyle(theme),
  background: theme.grey3Color,
  border: `1px solid ${theme.grey5Color}`,
  color: theme.grey7Color,
  paddingRight: "7px",
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
  paddingLeft: "5px",
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  pointerEvents: "auto" as const, // в antd по умолчанию none
  svg: {
    fill: theme.grey6Color,
  },
  ":hover": {
    svg: {
      fill: theme.grey9Color,
    },
  },
});

export const suffixIconSpinnerStyle = {
  height: "14px",
  paddingLeft: "5px",
  ".ant-spin": {
    lineHeight: "unset",
  },
};

export const textWrapperStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
} as const;

export const arrowSuffixIconStyle = (theme: TTheme) => ({
  ...suffixIconStyle(theme),
  pointerEvents: "none" as const,
});
