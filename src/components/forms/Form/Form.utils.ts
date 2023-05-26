import type { Mutator } from "final-form";
import type { NCore } from "../../../libs/core";
import { forEach } from "lodash";
import type { TWrappedError } from "./FormWrapper.types";

export type TOmittedConnectedFormProps<T extends Record<string, any>> = Omit<
  T,
  (typeof omittedPropsConnectedForm)[number]
>;

export const omittedPropsConnectedForm = [
  "component",
  "onKeyDown",
  "isFeatureEnabled",
  "localization",
  "form",
  "formName",
  "onFormUnmount",
  "setFormData",
  "sortByPriority",
  "userConfirmationProvider",
  "blockUri",
  "accessKeys",

  "active",
  "dirty",
  "dirtyFields",
  "dirtyFieldsSinceLastSubmit",
  "dirtySinceLastSubmit",
  "errors",
  "hasSubmitErrors",
  "hasValidationErrors",
  "initialValues",
  "invalid",
  "modified",
  "modifiedSinceLastSubmit",
  "pristine",
  "submitErrors",
  "submitFailed",
  "submitSucceeded",
  "submitting",
  "touched",
  "valid",
  "validating",
  "values",
  "visited",
  "handleSubmit",
  "__versions",
] as const;

// -------------------------------------------МУТАТОРЫ----------------------------------------------

/**
 * Мутатор изменения состояния touched полей формы
 * @param fieldNames
 */
const touch: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  [fieldNames]: [string[]],
  state
) => {
  forEach(fieldNames, (fieldName) => {
    const field = state.fields[fieldName];
    if (field) {
      field.touched = true;
    }
  });
};

/**
 * Мутатор очистки полей формы
 * @param fieldNames
 */
const clearFields: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  [fieldNames]: [string[]],
  state,
  { changeValue }
) => {
  forEach(fieldNames, (fieldName) => {
    const field = state.fields[fieldName];
    if (field) {
      changeValue(state, fieldName, () => undefined);
    }
  });
};

/**
 * Мутатор ошибки формы
 */
const setSubmitError: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  [error]: [NCore.TError],
  state
) => {
  state.formState.submitError = error;
};

/**
 * Очистка ошибки формы
 * @param _
 * @param state
 */
const clearSubmitError: Mutator<unknown, Partial<Record<string, any>> | undefined> = (_, state) => {
  state.formState.submitError = null;
};

/**
 * Мутатор ошибок формы
 */
const setSubmitErrors: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  [fieldName, error]: [string, NCore.TError | TWrappedError[]],
  state
) => {
  state.formState.submitErrors = {
    ...state.formState.submitErrors,
    [fieldName]: error,
  };
};

/**
 * Очистка ошибок формы
 * @param _
 * @param state
 */
const clearSubmitErrors: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  _,
  state
) => {
  state.formState.submitErrors = undefined;
};

/**
 * Мутатор ошибки поля
 * @param fieldName
 */
const setFieldError: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  [fieldName, error]: [string, NCore.TError],
  state
) => {
  if (fieldName && state?.formState?.errors) {
    state.formState.errors[fieldName] = error;
  }
};

/**
 * Мутатор добавления элемента в начало массива
 * @param fieldName
 * @param value
 */
const unshift: Mutator<unknown, Partial<Record<string, any>> | undefined> = (
  [fieldName, value]: [string, unknown],
  state,
  { changeValue }
) => {
  changeValue(state, fieldName, (lastValue = []) => {
    return [value, ...lastValue];
  });
};

export const formMutators = {
  unshift,
  touch,
  clearFields,
  setFieldError,
  setSubmitError,
  clearSubmitError,
  setSubmitErrors,
  clearSubmitErrors,
};
