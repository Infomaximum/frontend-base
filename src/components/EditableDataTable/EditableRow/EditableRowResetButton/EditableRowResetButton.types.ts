import type { ReactNode } from "react";
import type { IFormProvider } from "@infomaximum/base/src/decorators/contexts/FormContext";
import type { IControlPanelProps } from "../ControlPanel/ControlPanel.types";

export interface IEditableRowResetButtonProps {
  formProvider?: IFormProvider;
  formName?: string;
  disabled?: boolean;
  children?: ReactNode;
  onCancel: IControlPanelProps["onCancel"];
}
