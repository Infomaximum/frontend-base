import type { ReactNode } from "react";
import type { Localization } from "@im/localization";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";
import type { IWithFormProviderProps } from "../../../decorators/hocs/withFormProvider/withFormProvider";
import type { Store } from "../../../utils";
import type { Model } from "@im/models";

export interface IComplexPasswordModel extends Model {
  getMinPasswordLength(): number | undefined;
}

interface IComplexPasswordStore extends Store<IComplexPasswordModel> {}

export declare interface IPasswordValidators {
  validator: (
    value: string | undefined,
    complexPassword: IComplexPasswordModel | null
  ) => boolean | "";
  getMessage: (
    localization: Localization,
    complexPassword: IComplexPasswordModel | null
  ) => string;
  "test-id"?: string;
}

export declare interface IPasswordFieldsProps
  extends IWithLocProps,
    IWithFormProviderProps {
  passwordFieldName: string;
  passwordFieldLabel?: string;
  passwordFieldPlaceholder?: string;
  currentPasswordFieldName?: string;
  currentPasswordFieldLabel?: string;
  currentPasswordFieldPlaceholder?: string;
  withRepeatPasswordField?: boolean;
  repeatPasswordFieldLabel?: string;
  repeatPasswordFieldPlaceholder?: string;
  withNotEmptyValidation?: boolean;
  readOnly?: boolean;
  withLabels?: boolean;
  disabled?: boolean;
  newPasswordIcon?: ReactNode;
  newPasswordInputType?: "text" | "password";

  complexPasswordStore: IComplexPasswordStore;
}

export declare interface IPasswordFieldsState {
  touchedWithError?: boolean;
  complexPassword?: IComplexPasswordModel;
  newPasswordValue?: string;
  repeatPasswordValue?: string;
  currentPasswordInputType: boolean;
  newPasswordInputType: boolean;
  repeatNewPasswordInputType: boolean;
  showPopover: boolean;
  newPasswordFieldFocus: boolean;
  repeatNewPasswordFocus: boolean;
}
