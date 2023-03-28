import React, { useCallback, useEffect, useRef } from "react";
import { map, forEach, isArray, isFunction } from "lodash";
import type { TPropInjector } from "@infomaximum/utility";
import { FormCancelSymbol } from "@infomaximum/utility";
import type { IWithFormSubmitPromiseProps, TFormConfig } from "./withFormSubmitPromise.types";
import hoistNonReactStatics from "hoist-non-react-statics";
import {
  excludeArrayFieldWrapperNames,
  findErrorFieldName,
  getFormFieldsError,
} from "./withFormSubmitPromise.utils";
import type { SubmissionErrors } from "final-form";
import { useLocalization } from "../../hooks/useLocalization";
import { handleErrorInternal } from "../../../managers/Errors/Errors";
import type { IFormProvider } from "../../contexts/FormContext";
import { Message } from "../../../components/Message/Message";

const withFormSubmitPromise: TPropInjector<IWithFormSubmitPromiseProps> = (Component: any) => {
  const WithFormSubmitPromise: React.FC<any> = ({ onSubmit, notification, ...rest }) => {
    const localization = useLocalization();
    const formConfigRef = useRef<TFormConfig>({});

    useEffect(() => {
      const error = formConfigRef.current.error;
      const form = formConfigRef.current.form;
      const formValues = formConfigRef.current.formValues;
      const callback = formConfigRef.current.callback;

      if (form && formValues && error && callback) {
        const handledError = handleErrorInternal(error, localization);

        if (!handledError) {
          return;
        }

        const formFieldsError = getFormFieldsError(
          handledError,
          formValues,
          excludeArrayFieldWrapperNames(form.getRegisteredFields())
        );

        callback(formFieldsError);
      }
    }, [localization]);

    const handleFormSubmit = useCallback(
      async (
        formValues: any,
        form: IFormProvider,
        callback?: (errors?: SubmissionErrors) => void
      ) => {
        try {
          formConfigRef.current.formValues = formValues;
          formConfigRef.current.form = form;
          formConfigRef.current.callback = callback;

          await onSubmit(formValues, form, callback);

          if (notification) {
            const resultNotification = isArray(notification) ? notification : [notification];

            const notifications = map(resultNotification, (notification) =>
              isFunction(notification) ? notification(formValues, rest) : notification
            );

            forEach(notifications, (notification) => {
              if (notification) {
                Message.showMessage({
                  notification,
                });
              }
            });
          }
        } catch (error) {
          if (!error || error === FormCancelSymbol) {
            return;
          }

          formConfigRef.current.error = error;

          const handledError = handleErrorInternal(error, localization);

          if (!handledError) {
            return;
          }

          const formFieldsError = getFormFieldsError(
            handledError,
            formValues,
            excludeArrayFieldWrapperNames(form.getRegisteredFields())
          );

          const errorFieldName = findErrorFieldName(formFieldsError);

          if (errorFieldName) {
            const errorField = document.querySelector(`[data-name=${errorFieldName}]`);

            if (errorField) {
              errorField.scrollIntoView({ behavior: "smooth" });
            }
          }

          callback?.(formFieldsError);
        }
      },
      [localization, notification, onSubmit, rest]
    );

    return <Component key="connectedForm" {...rest} onSubmit={handleFormSubmit} />;
  };

  return hoistNonReactStatics(WithFormSubmitPromise, Component) as any;
};

export { withFormSubmitPromise };
