import type React from "react";
import type { TLocalizationDescription } from "@im/localization";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";

export interface IRemoveConfirmationModalProps extends IWithLocProps {
  /**
   * Отобразить/скрыть модальное окно
   */
  visible?: boolean;
  /**
   * Обработчик кнопки подтверждения
   */
  onConfirm: () => Promise<any>;
  /**
   * Заголовок модального окна (если отсутствует, то заголовок будет "Удаление")
   */
  title?: React.ReactNode;
  "test-id"?: string;
  /**
   * Обработчик, который вызывается после скрытия модального окна
   */
  onAfterCancel: () => void;
  /**
   * Обработчик, который вызывается после подтверждения удаления
   */
  onAfterConfirm?: () => void;
  children?: React.ReactNode;
  /**
   * Локализация кнопки удаления, по умолчанию DELETE
   */
  buttonRemoveText: TLocalizationDescription;
}

export interface IRemoveConfirmationModalState {
  isVisible: boolean;
  isLoading: boolean;
}
