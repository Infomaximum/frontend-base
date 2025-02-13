import type { DrawerStyles } from "antd/lib/drawer/DrawerPanel";

export const tableStyle = {
  overflowY: "auto" as const,
  overflowX: "hidden" as const,
};

export const drawerStyle = {
  body: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
} satisfies DrawerStyles;
