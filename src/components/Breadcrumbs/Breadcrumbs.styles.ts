export const containerStyle = {
  width: "100%",
  height: "24px",
  display: "flex",
  alignItems: "center",
};

export const labeledCrumbsContainerStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
  // Для сжимаемости
  minWidth: 0,
};

export const separatorStyle = (width: number) => (theme: TTheme) =>
  ({
    width,
    color: theme.grey7Color,
    display: "flex",
    justifyContent: "center",
    userSelect: "none",
    flexShrink: 0,
  } as const);

export const crumbStyle = (xPadding: number) => (theme: TTheme) =>
  ({
    paddingLeft: xPadding,
    paddingRight: xPadding,
    cursor: "pointer",
    borderRadius: "2px",
    height: "100%",
    background: theme.grey1Color,
    ":hover": {
      background: theme.grey3Color,
    },
    ":active": {
      background: theme.grey4Color,
    },
    color: theme.grey7Color,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    flexShrink: 0,
  } as const);

export const lastCrumbTextStyle = (theme: TTheme) =>
  ({
    color: theme.grey9Color,
  } as const);

export const menuStyle = {
  maxWidth: 400,
  // Для ellipsis
  li: { display: "block" },
};

// icons

export const homeIconStyle = (theme: TTheme) => ({
  fontSize: theme.h4FontSize,
});

export const threeDotsIconStyle = {
  transform: "rotate(90deg)",
};
