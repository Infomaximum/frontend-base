import type { EFormLayoutType } from "../BaseForm.types";

import type { TAccessRules } from "../../../../utils/access";

export type TFormFunctionalButtonObject = {
  component: React.ReactElement | null;
  accessRules?: TAccessRules | TAccessRules[];
  priority?: number;
};

export type TFormFunctionalButtons = TFormFunctionalButtonObject[];

export type TFormSubmitButtons = {
  customSubmitButton?: JSX.Element;
  isSubmitButtonInHeader?: boolean;
  isSubmitButtonDisabled?: boolean;
};

export type TFormFooterPanelConfig = {
  formSubmitButtons?: TFormSubmitButtons | null;
  formFunctionalButtons?: TFormFunctionalButtons;
};

export interface IFormFooterPanelProps {
  formFooterPanelConfig: TFormFooterPanelConfig;
  layoutType?: EFormLayoutType;
}
