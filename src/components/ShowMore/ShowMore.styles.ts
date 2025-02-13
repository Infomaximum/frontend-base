export const buttonStyle = {
  padding: 0,
  height: "18px",
  lineHeight: 1,
};

export const ghostButtonStyle = (theme: TTheme) => ({
  ...buttonStyle,
  color: theme.grey7Color,
  ":hover": {
    color: theme.grey6Color,
  },
  ":focus": {
    color: theme.grey6Color,
  },
  ":active": {
    color: theme.grey10Color,
  },
});

export const spinContainerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ".ant-spin-sm .ant-spin-dot-holder": {
    fontSize: "16px",
  },
} as const;

export const spinStyle = {
  display: "flex",
  ".ant-spin-dot": {
    fontSize: "14px",
  },
};
