import type { IBaseFormProps } from "../BaseForm/BaseForm.types";
import type { IFormOwnProps } from "./Form.types";
import type { FormProps } from "react-final-form";
import type { NCore } from "@im/core";

export interface IFormWrapperProps<T extends IBaseFormProps = IBaseFormProps>
  extends Omit<IFormOwnProps<T>, "formName">,
    Omit<TRemoveIndex<FormProps>, "component" | "form" | "onSubmit" | "children"> {
  /**
   * Имя формы (нужно для формирования "test-id" у элементов формы и правильной работы Prompt)
   */
  form: IFormOwnProps["formName"];

  /**
   * Указывает на то, что форма содержит ArrayField и следует добавлять mutators для ArrayField
   */
  withArrayField?: boolean;

  onSubmit?: FormProps<any>["onSubmit"];
  children: React.ReactNode;
}

export type TWrappedError = TDictionary<NCore.TError>;
