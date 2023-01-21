export const popoverTitleRowStyle = (theme: TTheme) =>
  ({
    fontSize: `${theme.h4FontSize}px`,
    marginBottom: "12px",
  } as const);

export const popoverTitleIconStyle = (theme: TTheme) =>
  ({
    color: theme.orange6Color,
  } as const);

export const popoverPrimaryButtonStyle = (theme: TTheme) => ({
  " , :hover, :focus": {
    color: theme.grey1Color,
    background: theme.blue6Color,
  },
});
