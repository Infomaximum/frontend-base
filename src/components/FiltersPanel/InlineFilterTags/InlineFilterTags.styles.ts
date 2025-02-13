import type { TInlineFilterTagsConfig } from "./InlineFilterTags.types";

export const tagsWrapperStyle = {
  height: "22px",
  display: "flex",
  alignItems: "center",
};

export const getTagStyle = (config: TInlineFilterTagsConfig, theme: TTheme) =>
  ({
    borderWidth: `${config.tagBorderWidth}px`,
    borderColor: `${theme.grey5Color} !important`,
    backgroundColor: `${theme.grey1Color} !important`,
    color: theme.grey8Color,
    paddingLeft: `${config.tagSidePadding}px`,
    paddingRight: `${config.tagSidePadding}px`,
    fontSize: `${config.tagFontSize}px`,
    margin: `${0}px`,
    height: config.tagHeight,
    cursor: "pointer",
    borderRadius: "4px",
  }) as const;

export const getResetFilterTagsButtonStyle = (isDisabled: boolean) => (theme: TTheme) => ({
  fontSize: `${theme.h5FontSize}px`,
  fontWeight: 400,
  color: theme.grey7Color,
  cursor: isDisabled ? "default" : "pointer",
  ":hover": isDisabled ? undefined : { color: theme.red5Color },
});

export const getMenuStyle = (maxHeight: number) => ({
  maxWidth: 400,
  maxHeight,
  overflow: "auto",
  // Для ellipsis
  li: { display: "block" },
});

export const wrapperStyle = { marginTop: "12px" };

export const dropdownWrapperStyle = {
  "&& .ant-dropdown-menu-item": {
    display: "list-item",
  },
};

export const dropdownStyle = { marginRight: "8px" };
