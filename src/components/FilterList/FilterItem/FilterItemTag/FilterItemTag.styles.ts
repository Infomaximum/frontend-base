export const getFilterTagStyle = (disabled?: boolean) => (theme: TTheme) => ({
  cursor: disabled ? "not-allowed" : "pointer",
  backgroundColor: `${theme.grey1Color} !important`,
  border: `1px solid ${theme.grey5Color} !important`,
  borderRadius: "4px",
  paddingRight: "unset",
  ".anticon-close": {
    cursor: disabled ? "not-allowed" : "pointer",
    marginLeft: 0,
    height: "22px",
    width: "23px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      color: disabled ? theme.grey7Color : theme.grey8Color,
    },
  },
});
