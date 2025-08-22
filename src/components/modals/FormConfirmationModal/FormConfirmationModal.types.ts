import type { IFormProvider } from "@infomaximum/base/src/decorators/contexts/FormContext";

export interface IFormConfirmationModalProps {
  formProvider: IFormProvider;
  when: boolean;
  blockUri: string;
}
