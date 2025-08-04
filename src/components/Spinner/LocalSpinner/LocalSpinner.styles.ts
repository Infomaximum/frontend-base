export const localSpinnerWrapperStyle = {
  display: "flex",
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
} as const;

export const spinnerIndicatorDefaultStyle = (theme: TTheme) =>
  ({
    color: theme.thrust4Color,
  }) as const;

export const fullContainerStyle = {
  height: "100%",
  width: "100%",
};
