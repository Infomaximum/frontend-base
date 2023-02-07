export const wrapperAutoFillStyle = {
  width: "100%",
};

export const autoFillComponentArrowIconStyle = (theme: TTheme) => ({
  ".ant-select-selection-search": {
    paddingRight: "12px!important",
  },

  // для доступа к обертке ant над иконкой
  ".ant-select-arrow": {
    display: "flex",
    flexDirection: "column" as const,
    width: "20px",
    borderRadius: "0 3px 3px 0",
    color: theme.grey6Color,
    svg: {
      transform: "none!important",
    },
    position: "absolute" as const,
    fontSize: "14px",
  },

  ".ant-select-selection-search-input": {
    textOverflow: "ellipsis",
  },
});
