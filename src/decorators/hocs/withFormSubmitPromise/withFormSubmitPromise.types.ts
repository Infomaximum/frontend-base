import type { FormApi, SubmissionErrors } from "final-form";
import type { NCore } from "../../../libs/core";

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
