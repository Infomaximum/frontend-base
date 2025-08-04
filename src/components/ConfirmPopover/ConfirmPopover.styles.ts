export const popoverTitleRowStyle = (theme: TTheme) =>
  ({
    fontSize: `${theme.h4FontSize}px`,
    marginBottom: "12px",
  }) as const;

export const popoverTitleIconStyle = (theme: TTheme) =>
  ({
    color: theme.orange6Color,
    fontSize: "16px",
  }) as const;

export const popoverTitleColStyle = {
  display: "flex",
};
