import { convertHexToRgbaStyle } from "../../utils/colors";

export const cardWidth = 264;
export const cardLeftPadding = 7;
const lineHeight = 18;

// eslint-disable-next-line im/style-names
const cardHeight: Record<number, number> = {
  2: 76,
  4: 136,
};

export const getCardStyle = (numberOfTitleLines: number = 2, theme: TTheme) =>
  ({
    display: "block",
    cursor: "default",
    position: "relative",
    width: `100%`,
    height: `${cardHeight[numberOfTitleLines]}px`,
    borderRadius: "4px",
    padding: numberOfTitleLines === 2 ? `6px 7px 4px ${cardLeftPadding}px` : "8px",
    border: `1px solid ${theme.grey1Color}`,
    background: theme.grey1Color,
    transition: "300ms",
    ":hover": {
      border: `1px solid ${theme.thrust2Color}`,
      boxSizing: "border-box",
      borderRadius: "4px",
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

export const disabledStyle = (theme: TTheme) => ({
  background: convertHexToRgbaStyle(theme.grey1Color, 0.5),
  border: `1px solid ${convertHexToRgbaStyle(theme.grey1Color, 0.5)}`,
  "&&&:hover, &&&:active, &&&:focus": {
    border: `1px solid ${convertHexToRgbaStyle(theme.grey1Color, 0.5)}`,
  },
});

export const getTitleStyle = (numberOfTitleLines: number, isDisabled: boolean) => (theme: TTheme) =>
  ({
    color: isDisabled ? convertHexToRgbaStyle(theme.grey10Color, 0.5) : theme.grey10Color,
    fontWeight: 400,
    fontSize: theme.h4FontSize,
    lineHeight: `${lineHeight}px`,
    maxHeight: `${lineHeight * numberOfTitleLines}px`,
    position: "relative",
    overflow: "hidden",
    wordBreak: "break-word",
  }) as const;
