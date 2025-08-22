import type { Interpolation } from "@emotion/react";
import type { FormProps } from "antd/lib/form/Form";
import type { TestIdAttr } from "@infomaximum/utility";
import type { UIEventHandler } from "react";
import type { TFormFooterPanelConfig } from "./FormFooterPanel/FormFooterPanel.types";
import type { NCore } from "@infomaximum/base/src/libs/core";

/**
 * Типы отличных от стандартной таблиц
 */
export enum EFormLayoutType {
  TableType = "table_type", // форма во всю ширину экрана
  LargeType = "large_type",
  ModalType = "modal_type",
  ModalExtensiveType = "modal_extensive_type",
}

type TAntFormProps = Pick<FormProps, "layout" | "colon" | "labelAlign" | "component">;

/**
 * Интерфейс для описание пропсов которые можно передавать извне в компонент
 */
export interface IBaseFormProps extends TAntFormProps {
  /**
   * Элемент хэдера
   * ! Не используется в новой навигации
   * ! Чтобы отобразить кнопки в header необходимо использовать formSubmitPanelConfig с ключом isSubmitButtonInHeader
   *
   * Если не передаем явно или передаем `undefined`, то будет использован хэдер по умолчанию,
   * если передаем `null`, то хэдер не будет отображаться
   */
  /* header?: JSX.Element | JSX.Element[] | null; */
  /**
   * Элемент футера
   *
   * Отображается, только если передаём явно
   */
  footer?: JSX.Element;
  /**
   * Конфиг футера формы.
   */
  formFooterPanelConfig?: TFormFooterPanelConfig;
  // Временный пропс, пока в системе есть header старой навигации
  isFormSubmitButtonInHeader?: boolean;
  customFooterStyle?: Interpolation<TTheme>;
  layoutType?: EFormLayoutType;
  attributes?: {
    [TestIdAttr]: string;
    ref: React.RefObject<HTMLDivElement | HTMLTableRowElement>;
    form: string;
  };
  // Стили контента формы
  formStyles?: Interpolation<TTheme>;
  connectedFormStyles?: Interpolation<TTheme>;
  originalError?: NCore.TError;
  showNotification?: boolean;
  "test-id"?: string;
  error?: NCore.TError;
  submitError?: NCore.TError;
  handleScrollContent?: UIEventHandler<HTMLDivElement>;
}
