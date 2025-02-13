import type { ModalProps } from "antd";
import { formFieldsContainerWithoutPaddingStyle } from "../BaseForm/BaseForm.styles";

export const formStyle = {
  padding: "0px",
  borderRadius: "0px",
  ...formFieldsContainerWithoutPaddingStyle,
};

export const modalBodyStyle = {
  padding: "0 24px 16px",
};

export const modalComponentsStyle = {
  body: modalBodyStyle,
} satisfies ModalProps["styles"];

export const wrapperModalFormStyle = {
  position: "absolute",
} as const;
