export const timeInputStyle = {
  width: "62px",
} as const;

export const timeInputWithSecondsStyle = {
  width: "72px",
} as const;

export const dashStyle = (theme: TTheme) =>
  ({
    fontSize: theme.h2FontSize,
    fontWeight: 400,
    color: theme.grey5Color,
  }) as const;
