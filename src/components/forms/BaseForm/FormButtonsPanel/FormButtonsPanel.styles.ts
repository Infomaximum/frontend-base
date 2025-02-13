import { EFormFunctionalButtonsAlign } from "./FormButtonsPanel.types";

export const getFormButtonsPanelStyle =
  (align?: EFormFunctionalButtonsAlign) => (theme: TTheme) => ({
    display: "flex",
    justifyContent: align === EFormFunctionalButtonsAlign.RIGHT ? "flex-end" : "flex-start",
    flexWrap: "wrap" as const,
    gap: "8px",
    borderTop: `1px solid ${theme.grey45Color}`,
    padding: "16px 16px",
  });
