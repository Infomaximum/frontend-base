import { isMatch, find, isObject } from "lodash";
import type { Localization } from "@im/localization";
import type { NCore } from "@im/core";
import { Expander } from "@im/core";

export const isErrorMatchWithPreparer = function (
  error: NCore.TError,
  preparer: NCore.TErrorPreparer
) {
  return preparer.code === error.code && isMatch(error.params, preparer.params as any);
};

export const findErrorByCode = (error: NCore.TError) =>
  find(Expander.getInstance().getErrorsHandlers(), (preparer) =>
    isErrorMatchWithPreparer(error, preparer)
  );

export const handleErrorInternal = function (
  error: NCore.TError | undefined,
  localization: Localization
) {
  if (!error) {
    return;
  }

  let preparedError: NCore.TError | undefined;
  const preparer = findErrorByCode(error);

  if (preparer) {
    if (preparer.getError) {
      preparedError = preparer.getError({
        error,
        localization,
        handleError: handleErrorInternal,
      });
    } else if (preparer.description || preparer.title) {
      preparedError = {
        ...error,
        typeDisplayedComponent: preparer.typeDisplayedComponent ?? "error",
        message:
          localization && preparer.description
            ? (localization.getLocalized(preparer.description) as string)
            : "",
        title:
          localization && preparer.title
            ? (localization.getLocalized(preparer.title) as string)
            : "",
      };
    } else if (isObject(preparer) && "handle" in preparer) {
      /**
       * если нет description и title но есть handle, то эту ошибку отображать не нужно,
       * выполнится handle и ошибка будет обработана
       * */
      return undefined;
    } else {
      preparedError = {
        ...error,
        message: error.code,
      };
    }

    if (preparedError && preparer.reloadOnClose) {
      preparedError.reloadOnClose = preparer.reloadOnClose;
    }
  } else if (error.code) {
    preparedError = {
      ...error,
      message: error.message ?? error.code,
    };
  } else {
    preparedError = error;
  }

  return preparedError;
};
