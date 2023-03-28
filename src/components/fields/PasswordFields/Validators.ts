import {
  notEmptyMemoize,
  type TFieldValidatorSelector,
  type TValidationError,
} from "@infomaximum/utility";
import { createSelector } from "reselect";
import {
  PASSWORDS_MUST_BE_EQUAL,
  YOU_NEED_SET_PASSWORD,
  PASSWORD_IS_NOT_SECURE,
} from "../../../utils/Localization/Localization";
import {
  passwordIsNotSecureTestId,
  passwordsMustBeEqualTestId,
  youNeedSetPasswordTestId,
} from "../../../utils/TestIds";
import { MIN_PASSWORD_LENGTH } from "../../../utils/const";
import type { Localization } from "@infomaximum/localization";
import type { IComplexPasswordModel } from "./PasswordFields.types";

const passwordsMustBeEqualLoc = PASSWORDS_MUST_BE_EQUAL;
const isValidPasswordLoc = PASSWORD_IS_NOT_SECURE;

const youNeedSetPasswordLoc = YOU_NEED_SET_PASSWORD;

/**
 * Валидатор, проверяющий значение текущего пароля
 * @param local - локализация
 * @param newPasswordFieldName - название поля нового пароля
 * @param currentPasswordFieldName - название поля текущего пароля
 * @param repeatPasswordFieldName - название поля повтора пароля
 * @param withNotEmptyValidation - проверять ли на "не пустоту"
 * @returns error | undefined
 */
export const isValidCurrentPasswordMemoize = createSelector(
  (local: Localization) => local,
  (local: Localization, newPasswordFieldName: string) => newPasswordFieldName,
  (local: Localization, newPasswordFieldName: string, currentPasswordFieldName: string) =>
    currentPasswordFieldName,
  (
    local: Localization,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string
  ) => repeatPasswordFieldName,
  (
    local: Localization,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) => withNotEmptyValidation,
  (
    local: Localization,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) =>
    isValidCurrentPassword(
      local,
      newPasswordFieldName,
      currentPasswordFieldName,
      repeatPasswordFieldName,
      withNotEmptyValidation
    )
);

const isValidCurrentPassword: TFieldValidatorSelector<string> =
  (
    local: Localization,
    newPasswordFieldNameName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: boolean
  ) =>
  (repeatPasswordValue, allValues: any) => {
    const isFilled = !!(
      allValues[newPasswordFieldNameName] ||
      allValues[currentPasswordFieldName] ||
      allValues[repeatPasswordFieldName]
    );

    if (withNotEmptyValidation || isFilled) {
      return notEmptyMemoize(local)(repeatPasswordValue, allValues);
    }

    return undefined;
  };

/**
 * Валидатор, проверяющий значение повторно введенного пароля значению поля нового пароля,
 * в случае, если значение не прошло валидацию возвращает соответствующий код ошибки с
 * сообщением о том, что введенные значения не эквивалентны
 * @param local - локализация
 * @param complexPassword - модель сложного пароля
 * @param newPasswordFieldName - название поля нового пароля
 * @param currentPasswordFieldName - название поля текущего пароля
 * @param repeatPasswordFieldName - название поля повтора пароля
 * @param withNotEmptyValidation - проверять ли на "не пустоту"
 * @returns error | undefined
 */
export const isValidRepeatPasswordMemoize = createSelector(
  (local: Localization) => local,
  (local: Localization, complexPassword: IComplexPasswordModel | null) => complexPassword,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string
  ) => newPasswordFieldName,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string
  ) => currentPasswordFieldName,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string
  ) => repeatPasswordFieldName,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) => withNotEmptyValidation,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) =>
    isValidRepeatPassword(
      local,
      complexPassword,
      newPasswordFieldName,
      currentPasswordFieldName,
      repeatPasswordFieldName,
      withNotEmptyValidation
    )
);

const sameAs: TFieldValidatorSelector<string> =
  (field: any, error: any) => (value: string, allValues: any) => {
    if (value !== allValues[field]) {
      return allValues[field] ? error : true;
    }

    return undefined;
  };

/**
 * Валидатор для проверки длины пароля
 * @param value - значение поля
 * @param complexPassword - модель сложного пароля со значением его минимальной длины
 * @returns boolean
 */
export const passwordHasValidLength = (
  value: string,
  complexPassword: IComplexPasswordModel | null
) => {
  if (
    complexPassword &&
    "getMinPasswordLength" in complexPassword &&
    typeof complexPassword.getMinPasswordLength === "function"
  ) {
    return value && value.length >= (complexPassword.getMinPasswordLength() || MIN_PASSWORD_LENGTH);
  }
  return value && value.length >= MIN_PASSWORD_LENGTH;
};

/**
 * Валидатор для проверки на соответствие пароля условию содержания в нем букв в верхнем регистре
 * @param value - значение поля
 * @returns boolean
 */
export const passwordHasUppercase = (value: string) => value && value.search(/[A-Z]/) !== -1;

/**
 * Валидатор для проверки на соответствие пароля условию содержания в нем букв в нижнем регистре
 * @param value - значение поля
 * @returns boolean
 */
export const passwordHasLowercase = (value: string) => value && value.search(/[a-z]/) !== -1;

/**
 * Валидатор для проверки на соответствие пароля условию содержания в нем цифр
 * @param value - значение поля
 * @returns boolean
 */
export const passwordHasNumbers = (value: string) => value && value.search(/\d/) !== -1;

/**
 * Валидатор для проверки на соответствие пароля условию содержания в неалфавитных символов
 * @param value - значение поля
 * @returns boolean
 */
export const passwordHasNonAlphabetic = (value: string) =>
  value && value.search(/[.,/#!$%^&*;:"'|{}@<>\\=\-_`~()\[\]?+]/) !== -1;

const isValidPassword: TFieldValidatorSelector<string> =
  (error: TValidationError, complexPassword: IComplexPasswordModel | null) => (value) =>
    passwordHasValidLength(value, complexPassword) &&
    passwordHasUppercase(value) &&
    passwordHasLowercase(value) &&
    passwordHasNumbers(value) &&
    passwordHasNonAlphabetic(value)
      ? undefined
      : error;

const isValidRepeatPassword: TFieldValidatorSelector<string> =
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldNameName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) =>
  (repeatPasswordValue, allValues: any) => {
    const newPasswordValue = allValues[newPasswordFieldNameName];
    const isFilled = !!(
      allValues[newPasswordFieldNameName] ||
      allValues[currentPasswordFieldName] ||
      allValues[repeatPasswordFieldName]
    );

    if (
      !!repeatPasswordValue &&
      repeatPasswordValue === newPasswordValue &&
      complexPassword &&
      isValidPassword(true, complexPassword)(newPasswordValue, allValues)
    ) {
      return true;
    }

    if ((withNotEmptyValidation || isFilled) && !repeatPasswordValue) {
      return notEmptyMemoize(local)(repeatPasswordValue, allValues);
    }

    return sameAs(newPasswordFieldNameName, {
      message: local.getLocalized(passwordsMustBeEqualLoc),
      code: passwordsMustBeEqualTestId,
    })(repeatPasswordValue, allValues);
  };

/**
 * Валидатор, проверяющий новый пароль на сложность в соответствии с критериями сложности пароля в системе
 * @param local - локализация
 * @param complexPassword - модель сложного пароля
 * @param newPasswordFieldName - название поля нового пароля
 * @param currentPasswordFieldName - название поля текущего пароля
 * @param repeatPasswordFieldName - название поля повтора пароля
 * @param withNotEmptyValidation - проверять ли валидатором на пустоту
 * @returns ошибка с текстом и кодом | undefined
 */
export const isValidNewPasswordMemoize = createSelector(
  (local: Localization) => local,
  (local: Localization, complexPassword: IComplexPasswordModel | null) => complexPassword,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string
  ) => newPasswordFieldName,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string
  ) => currentPasswordFieldName,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string
  ) => repeatPasswordFieldName,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) => withNotEmptyValidation,
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: string
  ) =>
    isValidNewPassword(
      local,
      complexPassword,
      newPasswordFieldName,
      currentPasswordFieldName,
      repeatPasswordFieldName,
      withNotEmptyValidation
    )
);

const isValidNewPassword: TFieldValidatorSelector<string> =
  (
    local: Localization,
    complexPassword: IComplexPasswordModel | null,
    newPasswordFieldNameName: string,
    currentPasswordFieldName: string,
    repeatPasswordFieldName: string,
    withNotEmptyValidation: boolean
  ) =>
  (newPasswordValue, allValues: any) => {
    const repeatPasswordValue = allValues[repeatPasswordFieldName];
    const isFilled = !!(
      allValues[newPasswordFieldNameName] ||
      allValues[currentPasswordFieldName] ||
      allValues[repeatPasswordFieldName]
    );

    if (!newPasswordValue && repeatPasswordValue) {
      return {
        message: local.getLocalized(youNeedSetPasswordLoc),
        code: youNeedSetPasswordTestId,
      };
    }

    if (!newPasswordValue && (withNotEmptyValidation || isFilled)) {
      return notEmptyMemoize(local)(repeatPasswordValue, allValues);
    }

    if (newPasswordValue && complexPassword) {
      return isValidPassword(
        {
          message: local.getLocalized(isValidPasswordLoc),
          code: passwordIsNotSecureTestId,
        },
        complexPassword
      )(newPasswordValue, allValues);
    }

    if (
      !passwordHasValidLength(newPasswordValue, complexPassword) &&
      (withNotEmptyValidation || isFilled)
    ) {
      return {
        message: local.getLocalized(isValidPasswordLoc),
        code: passwordIsNotSecureTestId,
      };
    }

    return undefined;
  };

/**
 * Валидатор, проверяющий пароль на сложность в соответствии с критериями сложности пароля в системе
 * и возвращающий сообщение по несоответствию "подвалидаторам" с кодом или undefined
 * @param local - локализация
 * @param complexPassword - модель сложного пароля
 * @returns undefined или error
 */
export const isValidPasswordMemoize = createSelector(
  (local: Localization) => local.getLocalized(isValidPasswordLoc),
  (local: Localization, complexPassword: IComplexPasswordModel | null) => complexPassword,
  (message, complexPassword) =>
    isValidPassword(
      {
        message,
        code: passwordIsNotSecureTestId,
      },
      complexPassword
    )
);
