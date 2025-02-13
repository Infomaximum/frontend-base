export const loaderWrapperStyle = {
  position: "absolute",
  zIndex: 1,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
} as const;

export const getEmptyContentStyle = (maxHeight: number, loading: boolean) =>
  ({
    padding: "9px 0px 27px 0px",
    height: "fit-content",
    maxHeight: `${maxHeight}px`,
    overflowY: "auto",
    opacity: loading ? 0.3 : 1,
  }) as const;

export const withoutDividerStyle = { borderColor: "transparent" };

export const getTableWrapperStyle = (
  theme: TTheme,
  opacity: number,
  isWithoutWrapperStyles?: boolean
) => {
  const commonStyle = {
    opacity,
  };

  return isWithoutWrapperStyles
    ? commonStyle
    : {
        ...commonStyle,
        padding: "4px 8px 0px 8px",
        background: theme.grey1Color,
        borderRadius: "6px",
      };
};
