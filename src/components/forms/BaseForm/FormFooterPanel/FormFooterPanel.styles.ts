import { EFormLayoutType } from "../BaseForm.types";

export const getFormFooterStyle = (layoutType?: EFormLayoutType) => (theme: TTheme) =>
  ({
    position: "sticky",
    bottom: 0,
    padding: 0,
    background: layoutType === EFormLayoutType.TableType ? "transparent" : theme.grey4Color,
    zIndex: 150,
    "& > div": {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "8px",
      borderTop: `1px solid ${theme.grey4Color}`,
      borderRadius: "0 0 6px 6px",
      padding: `16px`,
      background: theme.grey1Color,
      zIndex: 160,
    },
  }) as const;

export const submitButtonsStyle = {
  display: "flex",
  gap: "8px",
};

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

export const formFunctionalButtonsContainerStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "8px",
};
