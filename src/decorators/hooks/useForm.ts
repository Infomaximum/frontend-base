import type { IFormData, IFormProvider, TFormAccess } from "../contexts/FormContext";
import type { FormSubscriber, FormSubscription } from "final-form";
import { isFunction, noop } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

/** Хук для удобной работы с провайдером формы */
export const useForm = <TFormValues extends TDictionary = TDictionary>(
  subscriber?: FormSubscriber<TFormValues>,
  subscription?: FormSubscription
) => {
  const [formData, _setFormData] = useState<IFormData<TFormValues> | undefined>();
  const [formProvider, _setFormProvider] = useState<IFormProvider<TFormValues> | undefined>();
  const [access, setAccess] = useState<TFormAccess>({
    hasReadAccess: true,
    hasWriteAccess: true,
    hasExecuteAccess: true,
  });

  const subscriberCB = useRef(subscriber as FormSubscriber<TDictionary>);
  const subscriptionParams = useRef(subscription);

  useEffect(() => {
    const unsubscribe =
      formProvider && isFunction(subscriberCB.current) && subscriptionParams.current
        ? formProvider.subscribe(subscriberCB.current, subscriptionParams.current)
        : noop;

    return unsubscribe;
  }, [formProvider]);

  const setFormData = useCallback((contextData: IFormData<TFormValues>) => {
    _setFormData(contextData);

    if (contextData.access) {
      setAccess(contextData.access);
    }

    if (contextData.formProvider) {
      _setFormProvider(contextData.formProvider);
    }
  }, []);

  return { formProvider, setFormData, access, formData };
};
