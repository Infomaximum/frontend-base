export const checkedSwitchStyle = (theme: TTheme) => ({
  backgroundColor: theme.blue6Color,
});

export const uncheckedSwitchStyle = (theme: TTheme) => ({
  backgroundColor: theme.grey6Color,
  backgroundImage: `linear-gradient(to right, ${theme.grey6Color}, ${theme.grey6Color}), linear-gradient(to right, ${theme.grey1Color}, ${theme.grey1Color})`,
});
