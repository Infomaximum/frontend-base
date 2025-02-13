export const textAreaFieldStyle = {
  lineHeight: "22px",
  cursor: "auto",
};

export const textAreaWrapperStyle = (theme: TTheme) => ({
  ".ant-input[disabled]": {
    borderColor: `${theme.transparentColor} !important`,
  },
});
