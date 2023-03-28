import type { IFormProvider } from "../../../../decorators/contexts/FormContext";

export interface IEditableRowSubmitButtonProps {
  /**
   * Имя формы (нужно для формирования test-id)
   */
  formName?: string;
  /**
   * Провайдер формы
   */
  formProvider?: IFormProvider;
  disabled?: boolean;
  /**
   * Дизейблить ли кнопку если в форме есть ошибки
   */
  disableOnInvalid?: boolean;
  /**
   * Дизейблить ли кнопку если в форме не было изменений
   */
  disableOnPristine?: boolean;

  children: React.ReactNode;
}
