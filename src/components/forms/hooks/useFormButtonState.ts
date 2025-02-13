import { useEffect, useState } from "react";
import type { IFormProvider } from "../../../decorators/contexts/FormContext";

type TFormButtonState = {
  submitting: boolean;
  pristine: boolean;
  hasValidationErrors: boolean;
};

/**
 * Хук для работы с состояниями для кнопок формы
 * @param formProvider
 */
export const useFormButtonState = (formProvider: IFormProvider): TFormButtonState => {
  const [formState, setFormState] = useState<TFormButtonState>(() => {
    const { submitting, pristine, hasValidationErrors } = formProvider.getState();

    return { submitting, pristine, hasValidationErrors };
  });

  useEffect(() => {
    const unsubscribe = formProvider.subscribe(
      ({ submitting, pristine, hasValidationErrors }) => {
        setFormState({ submitting, pristine, hasValidationErrors });
      },
      {
        submitting: true,
        pristine: true,
        hasValidationErrors: true,
      }
    );

    return unsubscribe;
  }, [formProvider]);

  return formState;
};
