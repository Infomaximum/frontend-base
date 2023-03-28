import type { IFormProvider } from "../../../decorators/contexts/FormContext";

export interface IFormConfirmationModalProps {
  formProvider: IFormProvider;
  when: boolean;
  blockUri: string;
  disabledConfirmButton?: boolean;
}
