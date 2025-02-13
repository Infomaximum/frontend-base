export const antDropdownMenuItemClassName = "ant-dropdown-menu-item";
export const antDropdownMenuSelectedItemClassName = "ant-dropdown-menu-selected-item";
export const antDropdownMenuItemDividerClassName = "ant-dropdown-menu-item-divider";

export const menuStyle = (theme: TTheme) => ({
  minWidth: "160px",
  backgroundColor: `${theme.headerPanel.dropdownBackgroundColor} !important`,
  padding: "4px 0px !important",
  border: "none !important",
  [`.${antDropdownMenuItemClassName}`]: {
    height: "32px",
    padding: "0px 12px !important",
    lineHeight: "20px",
    color: `${theme.headerPanel.dropdownTextColor}!important`,
    fontWeight: "400",
    ":hover": {
      background: `${theme.headerPanel.dropdownItemColorHover}!important`,
    },
  },
  [`.${antDropdownMenuSelectedItemClassName}`]: {
    color: `${theme.grey8Color}!important`,
    fontWeight: "500",
    ":hover": {
      backgroundColor: `${theme.transparentColor}!important`,
    },
  },
  [`.${antDropdownMenuItemDividerClassName}`]: {
    backgroundColor: `${theme.graphite1Color}!important`,
    marginTop: "0px !important",
    marginBottom: "4px !important",
  },
});

export const menuItemTextStyle = (theme: TTheme) => ({
  fontSize: `${theme.h5FontSize}px`,
  whiteSpace: "nowrap",
} as const);

export const iconMenuItemStyle = {
  display: "flex",
  fontSize: "16px",
};
