import type { ModalProps } from "antd/lib/modal";
import type React from "react";
import type { FormProps } from "react-final-form";
import type { IFormProvider } from "../../../decorators/contexts/FormContext";
import type { IFormWrapperProps } from "../Form/FormWrapper.types";

export interface IModalFormProps
  extends Omit<ModalProps, "onOk" | "onCancel">,
    Pick<IFormWrapperProps, "form" | "initialValues" | "notification" | "setFormData"> {
  okText: string;
  cancelText: string;
  disableSubmitOnPristine?: boolean;
  disableSubmitOnInvalid?: boolean;
  onSubmit: FormProps<any>["onSubmit"];
  bodyStyle?: React.CSSProperties;
  onCancel?(): void;
  afterSubmit?(submitResult?: unknown): void;
  sortByPriority?: boolean;
}

export interface IModalFormState {
  open: boolean;
  formProvider?: IFormProvider;
}
