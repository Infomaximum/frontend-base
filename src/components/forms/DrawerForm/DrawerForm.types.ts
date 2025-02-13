import type { ButtonProps } from "antd/lib/button/button";
import type { IButtonProps } from "../../Button/Button.types";
import type { IFormProvider } from "../../../decorators/contexts/FormContext";
import type { IFormWrapperProps } from "../Form/FormWrapper.types";
import type { FormProps } from "react-final-form";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";
import type { EFormLayoutType } from "../BaseForm";
import type { IDrawerProps } from "../../drawers/Drawer/Drawer.types";

export interface IOkButtonProps extends Omit<ButtonProps, "icon"> {}

export interface IDrawerFormOwnProps
  extends Omit<IDrawerProps, "onOk" | "onCancel">,
    Pick<IFormWrapperProps, "form" | "initialValues" | "notification" | "setFormData"> {
  okText: string;
  cancelText: string;
  disableSubmitOnPristine?: boolean;
  disableSubmitOnInvalid?: boolean;
  onSubmit: FormProps<any>["onSubmit"];
  onCancel?(): void;
  afterSubmit?(submitResult?: unknown): void;
  okButtonProps?: IOkButtonProps;
  cancelButtonProps?: IButtonProps;
  disableSubmitFormButton?: boolean;
  isHasAccess?: boolean;
  formLayoutType?: EFormLayoutType;
  onStartClosing?(): void;
  additionalFooterButtons?: React.ReactNode;
}

export interface IDrawerFormProps extends IDrawerFormOwnProps, IWithLocProps {}

export interface IDrawerFormState {
  open: boolean;
  formProvider?: IFormProvider;
  formPristine: boolean;
}
