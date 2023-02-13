import type { NCore } from "@im/core";
import type { FormApi, SubmissionErrors } from "final-form";

export interface IWithFormSubmitPromiseProps {
  formError?: {
    message: string;
    code: string;
  };
}

export type TRegisteredFields = string[];

export type TFormConfig = {
  error?: NCore.TError;
  callback?: (errors?: SubmissionErrors) => void;
  form?: FormApi<TDictionary, Partial<TDictionary>>;
  formValues?: TDictionary;
};
