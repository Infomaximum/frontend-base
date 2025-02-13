import type { TAccessRules } from "../../../../utils/access";

export const enum EFormFunctionalButtonsAlign {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
}

export type TFormButtonObject = {
  component: React.ReactElement | null;
  accessRules?: TAccessRules | TAccessRules[];
  priority?: number;
};

export type TFormButtonsConfig = {
  formButtonObjects: TFormButtonObject[];
  buttonsAlign?: EFormFunctionalButtonsAlign;
};

export interface IFormButtonsPanelProps {
  formButtonsConfig: TFormButtonsConfig;
}
