import { formFieldsContainerWithoutPaddingStyle } from "../BaseForm/BaseForm.styles";

export const formStyle = {
  padding: "0px",
  height: "100%",
  ...formFieldsContainerWithoutPaddingStyle,
};

export const formContentStyle = { height: "100%" };

export const cancelButtonStyle = { marginLeft: "8px" };

export const noAccessStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "center",
} as const;

export const drawerFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
