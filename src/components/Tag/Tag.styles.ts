export const getTagStyle =
  (
    borderColor?: string,
    textColor?: string,
    bgColor?: string,
    closeIconColor?: string,
    closeIconColorHover?: string
  ) =>
  (theme: TTheme) => {
    return {
      position: "relative",
      backgroundColor: `${bgColor} !important`,
      border: borderColor === "none" ? "none" : `1px solid ${borderColor} !important`,
      color: `${textColor} !important`,
      maxWidth: "100%",
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "4px",
      height: "22px",
      lineHeight: "22px",
      overflow: "hidden",
      svg: {
        zIndex: 2,
      },
      "&& .anticon-close": {
        display: "inline-flex",
        justifyContent: "center",
        paddingRight: "7px",
        color: closeIconColor,
        ":hover": {
          color: closeIconColorHover ?? theme.grey8Color,
        },
      },
    } as const;
  };

export const notClosableTagStyle = {
  ":hover": {
    opacity: 1,
  },
};

export const notColoredTagStyle = (theme: TTheme) => ({
  "&:hover": {
    color: `${theme.grey7Color} !important`,
  },
});

export const tagContentStyle = {
  position: "relative",
  overflow: "hidden",
  whiteSpace: "nowrap",
  userSelect: "none",
  textOverflow: "ellipsis",
} as const;
