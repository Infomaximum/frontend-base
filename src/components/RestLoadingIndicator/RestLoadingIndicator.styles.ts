export const containerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

export const labelStyle = (theme: TTheme) =>
  ({
    color: theme.grey7Color,
    fontSize: theme.h5FontSize,
  } as const);

export const spinStyle = {
  display: "flex",
  ".ant-spin-dot": {
    fontSize: "14px",
  },
};
