import { menuStyle } from "../../../Dropdown";
import { FILTERS_LIMIT } from "../../../../utils";

export const getWrapperStyle = (theme: TTheme, isHeaderFilter?: boolean) => ({
  ...menuStyle(theme),
  backgroundColor: isHeaderFilter ? theme.headerPanel.dropdownBackgroundColor : theme.grey1Color,
  padding: "4px 0px",
  overflow: "overlay",
  minWidth: "76px",
  maxWidth: "260px",
  borderRadius: "2px",
});

export const wrapperTopPanelStyle = (theme: TTheme) => ({
  ...menuStyle(theme),
  width: "222px",
  border: `1px solid ${theme.grey4Color}`,
  padding: "4px 0",
  borderRadius: "2px",
});

export const getWrapperWithScrollStyle = (isHeaderFilter: boolean) => (theme: TTheme) => ({
  ...getWrapperStyle(theme, isHeaderFilter),
  minWidth: "225px",
  maxHeight: `${theme.topPanelHeight + FILTERS_LIMIT * theme.mediumLineHeight}px`, // n - полей по 32px
});

export const defaultFilterItemsWrapperStyle = (theme: TTheme) =>
  ({
    maxHeight: `${FILTERS_LIMIT * theme.mediumLineHeight}px`, // n - полей по 32px
    overflowY: "auto" as const,
  }) as const;

export const headerFilterItemsWrapperStyle = (theme: TTheme) =>
  ({
    "::-webkit-scrollbar-thumb": {
      backgroundColor: theme.grey8Color,
    },
    "::-webkit-scrollbar-track": {
      backgroundColor: theme.headerPanel.dropdownBackgroundColor,
    },
    ...defaultFilterItemsWrapperStyle(theme),
  }) as const;

export const emptyStyle = (theme: TTheme) => ({
  margin: "8px 0px",
  fontSize: `${theme.h5FontSize}px`,
  color: theme.grey7Color,
  lineHeight: `${theme.verySmallLineHeight}px`,
});

export const emptyImageStyle = {
  height: "46px",
  marginBottom: "4px",
};

export const getItemStyle =
  (isHeaderPanel: boolean = true) =>
  (theme: TTheme) => ({
    display: "flex",
    alignItems: "center",
    color: isHeaderPanel ? theme.headerPanel.dropdownTextColor : "unset",
    fontSize: `${isHeaderPanel ? theme.h5FontSize : theme.h4FontSize}px`,
    lineHeight: "28px",
    fontWeight: 400,
    height: "28px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    cursor: "pointer",
    userSelect: "none" as const,
    padding: "3px 8px",
    boxSizing: "border-box" as const,
    ":hover": {
      backgroundColor: isHeaderPanel ? theme.graphite1Color : theme.grey3Color,
    },
  });

export const iconStyle = (theme: TTheme) => ({
  color: theme.grey7Color,
});

export const inputDefaultStyle = { padding: "8px" };

export const headerInputStyle = (theme: TTheme) => ({
  ...inputDefaultStyle,
  ".ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused": {
    borderColor: theme.thrust3Color,
    boxShadow: `0px 0px 4px ${theme.thrust3Color}`,
  },
  ".ant-input-affix-wrapper:hover": {
    borderColor: theme.thrust3Color,
  },
});

export const searchInputStyle = { padding: "4px 10px" };

export const headerSearchInputStyle = (theme: TTheme) => ({
  ...searchInputStyle,
  backgroundColor: theme.grey13Color,
  borderColor: theme.grey10Color,
  input: {
    backgroundColor: `${theme.grey13Color} !important`,
    color: `${theme.grey3Color} !important`,
    "::placeholder": {
      color: theme.grey7Color,
    },
  },
});
