export const antDropdownMenuItemClassName = "ant-dropdown-menu-item";
export const antDropdownMenuSelectedItemClassName =
  "ant-dropdown-menu-selected-item";
export const antDropdownMenuItemDividerClassName =
  "ant-dropdown-menu-item-divider";

export const menuStyle = (theme: TTheme) => ({
  minWidth: "160px",
  borderRadius: "2px",
  backgroundColor: theme.headerPanel.dropdownBackgroundColor,
  border: "none !important",
  [`.${antDropdownMenuItemClassName}`]: {
    height: "32px",
    padding: "0px 12px",
    lineHeight: "20px",
    color: theme.headerPanel.dropdownTextColor,
    fontWeight: "400",
    fontSize: `${theme.h5FontSize}px`,
    ":hover": {
      background: theme.headerPanel.dropdownItemColorHover,
    },
  },
  [`.${antDropdownMenuSelectedItemClassName}`]: {
    color: theme.grey8Color,
    fontWeight: "500",
    ":hover": {
      backgroundColor: theme.transparentColor,
    },
  },
  [`.${antDropdownMenuItemDividerClassName}`]: {
    backgroundColor: theme.graphite1Color,
    marginTop: "0px",
    marginBottom: "4px",
  },
});

export const iconMenuItemStyle = {
  display: "flex",
  fontSize: "16px",
};
