export const boldTitleStyle = {
  fontWeight: 500,
  lineHeight: "24px",
  display: "block",
};

export const titleStyle = (theme: TTheme) =>
  ({
    ...boldTitleStyle,
    fontSize: theme.subtitleFontSize,
    userSelect: "none",
  } as const);

export const modalStyle = {
  ".ant-modal": {
    margin: "0 auto",
  },

  ".ant-modal-header": {
    padding: "20px 54px 12px 28px",
    border: "none",
    borderRadius: "4px 4px 0 0",
  },

  ".ant-modal-footer": {
    borderTop: "none",
    padding: "0 28px 20px",
  },

  ".ant-modal-close": {
    width: "22px",
    height: "22px",
    top: "20px",
    right: "28px",
  },

  ".ant-modal-close-x": {
    width: "100%",
    height: "100%",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ".ant-modal-close-icon": {
      display: "block",
    },
  },

  ".ant-modal-content": {
    borderRadius: "4px",
  },
};
