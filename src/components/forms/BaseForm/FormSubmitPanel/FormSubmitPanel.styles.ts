export const getFormSubmitPanelStyle = (isPristine: boolean) => (theme: TTheme) => ({
  display: isPristine ? "none" : "flex",
  flexWrap: "wrap" as const,
  gap: "8px",
  borderTop: `1px solid ${theme.grey4Color}`,
  padding: "12px 16px",
  zIndex: 150,
});

export const formSubmitButtonStyle = (theme: TTheme) => {
  const disabledStyle = { borderColor: theme.grey5Color };

  return {
    "&:disabled": {
      ...disabledStyle,
      ":hover": disabledStyle,
      ":focus": disabledStyle,
    },
  };
};

// Вспомогательный костыль на время перехода на новую навигацию
// Применяется в тех случаях, когда недоступен ни старый хедер, ни новый футер
export const auxiliaryFormSubmitStyle = (theme: TTheme) => ({
  position: "sticky" as const,
  bottom: 0,
  display: "none",
  gap: "8px",
  flexWrap: "wrap" as const,
  padding: "16px",
  background: theme.grey4Color,
  zIndex: 150,
});
