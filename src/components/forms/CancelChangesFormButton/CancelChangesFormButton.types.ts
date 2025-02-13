import type { IFormProvider } from "../../../decorators/contexts/FormContext";
import type { IButtonProps } from "../../Button/Button.types";
import type { AntdIconProps } from "../../Icons/Icons";

export interface ICancelChangesFormButtonProps
  extends Pick<IButtonProps, "size" | "type" | "ghost" | "styles" | "key"> {
  /**
   *  Надпись на кнопке, локализованная строка
   */
  caption?: string;
  /**
   * Имя формы (нужно для формирования test-id) (обязательно, если кнопка находится вне формы)
   */
  formName?: string;
  /**
   * Провайдер формы (обязательно, если кнопка находится вне формы)
   */
  formProvider?: IFormProvider<any>;
  /**
   * Состояние loading для кнопки (имеет высший приоритет над submitting формы)
   */
  loading?: IButtonProps["loading"];
  /**
   * Дизейблить кнопку (имеет высший приоритет над disableOnInvalid)
   */
  disabled?: boolean;
  /**
   * Дизейблить кнопку, если в форме не было изменений
   */
  disableOnPristine?: boolean;
  /**
   * Иконка для кнопки
   */
  icon?: React.ComponentType<AntdIconProps>;

  className?: string;
}
