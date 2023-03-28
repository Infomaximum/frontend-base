export const tableStyle = {
  overflowY: "auto" as const,
  overflowX: "hidden" as const,
};

export const drawerBodyStyle = {
  display: "flex" /* Fix для IE, нужен, чтобы у дочерних элементов работал maxHeight*/,
  flexDirection: "row",
  padding: "16px 24px 0",
  overflow: "hidden",
} as const;
