import type { IBaseFormProps } from "../BaseForm/BaseForm.types";

export interface IUnAuthorizedFormProps extends Omit<IBaseFormProps, "footer"> {
  children: React.ReactNode;
}
