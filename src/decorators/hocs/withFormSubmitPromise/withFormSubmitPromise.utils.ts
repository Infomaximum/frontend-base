import { assertSilent } from "@im/asserts";
import type { NCore } from "@im/core";
import { FORM_ERROR } from "final-form";
import {
  difference,
  compact,
  filter,
  forEach,
  get,
  isArray,
  isEmpty,
  map,
  set,
  pick,
} from "lodash";
import { ERROR_FIELD_NAME, ERROR_FIELD_VALUE } from "../../../utils/const";
import type { TRegisteredFields } from "./withFormSubmitPromise.types";

/**
 * Метод возвращает объект c описанием ошибок формы для полей, значение которых совпадает со
 * значением, хранящимся в ошибке, полученной с сервера
 * @param error - ошибка сервера
 * @param formValues - значения формы
 * @param formRegisteredFields - список полей формы, которые отображены на данный момент
 */
const getFormFieldsErrorByValue = (
  error: NCore.TError,
  formValues: TDictionary,
  formRegisteredFields: TRegisteredFields
) => {
  const formFieldsError = {};

  map(formRegisteredFields, (formFieldPath) => {
    if (
      formFieldPath.toLowerCase().indexOf(error.params[ERROR_FIELD_NAME]) !==
        -1 &&
      get(formValues, formFieldPath).toString() ===
        error.params[ERROR_FIELD_VALUE].toString()
    ) {
      set(formFieldsError, formFieldPath, {
        code: error.code,
        message: error.message,
      });
    }
  });

  return formFieldsError;
};

/**
 * Метод возвращает нормализованную ошибку формы
 * @param error - ошибка сервера
 */
const getNormalizedError = (error: NCore.TError) =>
  pick(error, ["code", "message", "title", "traceId"]);

/**
 * Метод возвращает объект c описанием ошибок формы
 * @param error - ошибка сервера
 * @param formValues - значения формы
 * @param formRegisteredFields - список полей формы, которые отображены на данный момент
 */
export const getFormFieldsError = (
  error: NCore.TError,
  formValues: Record<string, unknown>,
  formRegisteredFields: TRegisteredFields
) => {
  if (error.params && error.params[ERROR_FIELD_NAME]) {
    const serverFieldName = error.params[
      ERROR_FIELD_NAME
    ].toUpperCase() as string;
    const snakeCaseFieldName = error.params[ERROR_FIELD_NAME].replace(
      /_([a-z])/g,
      (match: string) => match[1]?.toUpperCase()
    );

    if (
      formRegisteredFields.find((fieldName) => fieldName === serverFieldName)
    ) {
      return {
        [serverFieldName]: getNormalizedError(error),
      };
    }

    if (
      formRegisteredFields.find((fieldName) => fieldName === snakeCaseFieldName)
    ) {
      return {
        [snakeCaseFieldName]: getNormalizedError(error),
      };
    }

    const formFieldsErrorByValue = getFormFieldsErrorByValue(
      error,
      formValues,
      formRegisteredFields
    );

    if (!isEmpty(formFieldsErrorByValue)) {
      return formFieldsErrorByValue;
    }

    assertSilent(
      false,
      `В форме не найдено поле с именем, содержащим '${serverFieldName}', и значением - ${error.params[ERROR_FIELD_VALUE]}`
    );
  }

  const formError = getNormalizedError(error);

  return { [FORM_ERROR]: formError };
};

/**
 * Метод возвращает имя поля с ошибкой
 * @param errors
 */
export const findErrorFieldName = (
  errors: Record<string, any> | undefined
): string | undefined => {
  let errorFieldName: string | undefined;
  forEach(errors, (error, fieldName) => {
    if (error && !errorFieldName && fieldName !== FORM_ERROR) {
      if (!!error.code) {
        errorFieldName = fieldName;
      } else {
        let fieldNamePostfix = findErrorFieldName(error);

        if (fieldNamePostfix !== undefined) {
          if (!isArray(error)) {
            fieldNamePostfix = `.${fieldNamePostfix}`;
          }

          if (isArray(errors)) {
            errorFieldName = `[${fieldName}]${fieldNamePostfix}`;
          } else {
            errorFieldName = `${fieldName}${fieldNamePostfix}`;
          }
        }
      }
    }
  });

  return errorFieldName;
};

/** Исключение имени ArrayField-обертки, т.к. ошибка относится не к обертке, а к дочерним полям. См. тесты */
export const excludeArrayFieldWrapperNames = (fieldNames: string[]) => {
  const regExp = /^(.*)\[\d+\]$/;
  const arrayFieldNames = filter(fieldNames, (field) => regExp.test(field)).map(
    (item) => item.match(regExp)?.[1]
  );
  return difference(fieldNames, compact(arrayFieldNames));
};
