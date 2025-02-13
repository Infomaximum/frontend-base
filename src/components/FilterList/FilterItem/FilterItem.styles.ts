const lineHeight = 16;
const paddingWrapper = 8;

export const getWrapperStyle = (disabled: boolean) => (theme: TTheme) =>
  ({
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    userSelect: "none",
    transition: "background-color 0.1s ease-out",
    "&: hover": {
      backgroundColor: disabled ? theme.graphite1Color : theme.grey13Color,
    },
    paddingRight: "2px",
  }) as const;

export const getFilterBodyStyle = (disabled: boolean) =>
  ({
    cursor: disabled ? "not-allowed" : "pointer",
    padding: `${paddingWrapper}px`,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
  }) as const;

export const filterNameStyle = (theme: TTheme) =>
  ({
    color: theme.grey6Color,
    fontSize: `${theme.h5FontSize}px`,
    fontWeight: 400,
    lineHeight: `${lineHeight}px`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  }) as const;

export const filterValuesStyle = (theme: TTheme) =>
  ({
    fontSize: `${theme.h5FontSize}px`,
    lineHeight: `${lineHeight}px`,
    color: theme.grey3Color,
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  }) as const;

export const closeIconStyle = (theme: TTheme) => ({
  fontSize: `${theme.h5FontSize}px`,
});

export const getFilterRemoveButtonStyle = (disabled: boolean) => (theme: TTheme) => {
  const defaultColor = theme.grey7Color;

  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "24px",
    height: `${theme.heightHeaderMenu}px`,
    flexShrink: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    color: defaultColor,
    ":hover": {
      "> *": {
        color: disabled ? defaultColor : theme.grey1Color,
      },
    },
  } as const;
};
