import type { ReactNode } from "react";
import type { Interpolation } from "@emotion/react";
import type { TLocalizationDescription } from "@im/utils";
import type { AntdIconProps } from "@im/base/src/components/Icons/Icons";
import type { TButtonType } from "@im/base/src/components/Button/Button.types";

export interface IConfirmationModalProps {
  /**
   * Обработчик кнопки подтверждения
   */
  onConfirm: () => Promise<any>;
  /**
   * Заголовок модального окна
   */
  title: ReactNode | string;
  /**
   * Тип Иконки
   */
  iconType?: string;
  /**
   * Стиль иконки (можно заменять одно или несколько css свойств)
   */
  iconStyle?: Interpolation<TTheme>;
  /**
   * Тип кнопки (если нет то будет "primary")
   */
  buttonOkType?: TButtonType;
  /**
   * Текст кнопки (если нет то текст будет "ок")
   */
  buttonOkText?: TLocalizationDescription;
  /**
   * Обработчик клика дополнительной кнопки
   */
  onAdditionalButtonClick?(): void;
  /**
   * Показать/скрыть дополнительную кнопку
   */
  withAdditionalButton?: boolean;
  /**
   * Если true, то кнопка "Применить" будет заблокирована
   */
  disabledConfirmButton?: boolean;
  /**
   * Текст дополнительной кнопки
   */
  additionalButtonCaption?: TLocalizationDescription;
  /**
   * z-index
   */
  zIndex?: number;
  /**
   * Обработчик, который вызывается после скрытия модального окна
   */
  onAfterCancel(): void;
  /**
   * Обработчик, который вызывается после подтверждения
   */
  onAfterConfirm?(): void;
  /**
   * Иконка
   */
  icon?: React.ComponentType<AntdIconProps>;

  children?: React.ReactNode;
}
