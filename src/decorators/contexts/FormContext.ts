import type { FormApi } from "final-form";
import { createContext } from "react";

export interface IFormProvider<TFormValues extends TDictionary = TDictionary>
  extends FormApi<TFormValues> {}

export interface IFormData<TFormValues extends TDictionary = TDictionary>
  extends IFormContextData<TFormValues> {}

export type TFormAccess = {
  hasReadAccess: boolean;
  hasWriteAccess: boolean;
  hasExecuteAccess: boolean;
};

export interface IFormContextData<TFormValues extends TDictionary = TDictionary> {
  access: TFormAccess;
  formProvider?: IFormProvider<TFormValues>;
  formName?: string;
}

export default createContext<IFormContextData>({
  access: {
    hasReadAccess: true,
    hasWriteAccess: true,
    hasExecuteAccess: true,
  },
});
