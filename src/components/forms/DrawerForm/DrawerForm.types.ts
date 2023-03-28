import type { DrawerProps } from "antd/lib/drawer";
import type { ButtonProps } from "antd/lib/button/button";
import type { IButtonProps } from "../../Button/Button.types";
import type { IFormProvider } from "../../../decorators/contexts/FormContext";
import type { IFormWrapperProps } from "../Form/FormWrapper.types";
import type { FormProps } from "react-final-form";

export interface IOkButtonProps extends Omit<ButtonProps, "icon"> {}

export interface IDrawerFormProps
  extends Omit<DrawerProps, "onOk" | "onCancel" | "open">,
    Pick<IFormWrapperProps, "form" | "initialValues" | "notification" | "setFormData"> {
  okText: string;
  cancelText: string;
  disableSubmitOnPristine?: boolean;
  disableSubmitOnInvalid?: boolean;
  onSubmit: FormProps<any>["onSubmit"];
  bodyStyle?: React.CSSProperties;
  onCancel?(): void;
  afterSubmit?(submitResult?: unknown): void;
  okButtonProps?: IOkButtonProps;
  cancelButtonProps?: IButtonProps;
  disableSubmitFormButton?: boolean;
  isHasAccess?: boolean;
}

export interface IDrawerFormState {
  open: boolean;
  formProvider?: IFormProvider;
  formPristine?: boolean;
}
