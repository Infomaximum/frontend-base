export const cardWidth = 264;
export const cardLeftPadding = 7;
export const getCardRightPadding = (hasContextMenu: boolean) => (hasContextMenu ? 40 : 16);

export const cardStyle = (theme: TTheme) =>
  ({
    display: "block",
    cursor: "default",
    position: "relative",
    width: `100%`,
    height: "86px",
    borderRadius: "2px",
    padding: `5px 7px 7px ${cardLeftPadding}px`,
    border: `1px solid ${theme.grey1Color}`,
    background: theme.grey1Color,
    transition: "300ms",
    ":hover": {
      border: `1px solid ${theme.thrust2Color}`,
      boxSizing: "border-box",
      borderRadius: "2px",
    },
  } as const);

export const pointerCardStyle = {
  cursor: "pointer",
};

export const cardWithContextMenuStyle = {
  padding: `5px 7px 7px ${cardLeftPadding}px`,
};

export const contextMenuStyle = (theme: TTheme) =>
  ({
    position: "absolute",
    right: "0",
    top: "0",
    button: {
      width: "24px",
      height: "24px",
      backgroundColor: theme.grey1Color,
      ":hover": {
        backgroundColor: theme.grey3Color,
      },
    },
  } as const);

export const contentStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
} as const;

export const focusStyle = (theme: TTheme) => ({
  border: `1px solid ${theme.thrust2Color}`,
});

/* Ограничивает абзац заданным количеством строк, добавляя многоточие при необходимости */
const getTextClampStyle = (numberOfLines: number) =>
  ({
    WebkitLineClamp: numberOfLines,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
  } as const);

export const titleStyle = (theme: TTheme) =>
  ({
    width: "calc(100% - 32px)",
    color: theme.grey9Color,
    fontWeight: 400,
    fontSize: theme.h4FontSize,
    lineHeight: "22px",
    ...getTextClampStyle(2),
  } as const);
