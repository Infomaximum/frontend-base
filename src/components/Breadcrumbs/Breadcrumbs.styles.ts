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

export const getSeparatorStyle = (width: number) => (theme: TTheme) =>
  ({
    width,
    color: theme.grey6Color,
    display: "flex",
    justifyContent: "center",
    userSelect: "none",
    flexShrink: 0,
  }) as const;

export const crumbStyle = (theme: TTheme) =>
  ({
    cursor: "pointer",
    borderRadius: "2px",
    height: "24px",
    background: "inherit",
    ":hover": {
      color: theme.grey9Color,
    },
    ":active": {
      color: theme.grey10Color,
    },
    color: theme.grey7Color,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    flexShrink: 0,
  }) as const;

export const lastCrumbTextStyle = (theme: TTheme) =>
  ({
    cursor: "default",
    color: theme.grey10Color,
  }) as const;

export const getMenuStyle = (maxHeight: number) => ({
  maxWidth: 400,
  maxHeight,
  overflow: "auto",
  // Для ellipsis
  li: { display: "block" },
});

// icons

export const homeIconStyle = (theme: TTheme) => ({
  fontSize: theme.h4FontSize,
});

export const threeDotsIconStyle = {
  transform: "rotate(90deg)",
};

export const dropdownWrapperStyle = {
  "&& .ant-dropdown-menu-item": {
    display: "list-item",
  },
};
