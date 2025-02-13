import { commonContentStyle } from "../../styles/common.styles";

export const contentStyle = (theme: TTheme) =>
  ({
    ...commonContentStyle(),
    background: theme.grey4Color,
    padding: "0px",
    overflowY: "hidden",
  }) as const;

export const scrollContainerStyle = {
  padding: "0 6px 0 16px",
  overflowY: "scroll",
} as const;

export const titleStyle = (theme: TTheme) =>
  ({
    alignItems: "center",
    display: "flex",
    padding: "15px 16px",
    position: "sticky",
    top: 0,
    zIndex: 150,
    background: theme.grey4Color,
    whiteSpace: "nowrap",
  }) as const;
