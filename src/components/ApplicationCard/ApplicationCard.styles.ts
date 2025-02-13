export const cardWidth = 264;
export const cardLeftPadding = 7;
export const getCardRightPadding = (hasContextMenu: boolean) => (hasContextMenu ? 40 : 16);
const lineHeight = 18;

export const cardStyle = (theme: TTheme) =>
  ({
    display: "block",
    cursor: "default",
    position: "relative",
    width: `100%`,
    height: "76px",
    borderRadius: "2px",
    padding: `6px 7px 4px ${cardLeftPadding}px`,
    border: `1px solid ${theme.grey1Color}`,
    background: theme.grey1Color,
    transition: "300ms",
    ":hover": {
      border: `1px solid ${theme.thrust2Color}`,
      boxSizing: "border-box",
      borderRadius: "2px",
    },
  }) as const;

export const pointerCardStyle = {
  cursor: "pointer",
};

export const contextMenuStyle = {
  width: "100%",
} as const;

export const contentStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflow: "hidden",
} as const;

export const focusStyle = (theme: TTheme) => ({
  border: `1px solid ${theme.thrust2Color}`,
});

export const titleStyle = (theme: TTheme) =>
  ({
    color: theme.grey10Color,
    fontWeight: 400,
    fontSize: theme.h4FontSize,
    lineHeight: `${lineHeight}px`,
    maxHeight: `${lineHeight * 2}px`,
    position: "relative",
    overflow: "hidden",
    wordBreak: "break-word",
  }) as const;
