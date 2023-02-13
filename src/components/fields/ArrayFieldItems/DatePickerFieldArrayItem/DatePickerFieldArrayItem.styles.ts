export const datePickerStyle = {
  width: "100%",
};

export const removeButtonStyle = (theme: TTheme) => ({
  color: theme.grey6Color,
  padding: "0px",
  ":hover": {
    color: `${theme.red6Color}`,
  },
  ":focus": {
    color: theme.grey6Color,
    ":hover": {
      color: `${theme.red6Color}`,
    },
  },
});
