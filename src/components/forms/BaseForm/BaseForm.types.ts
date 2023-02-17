import type { Interpolation } from "@emotion/react";
import type { FormProps } from "antd/lib/form/Form";
import type { ColProps } from "antd/lib/grid";
import type { TestIdAttr } from "@im/utils";
import type { NCore } from "@im/core";

/**
 * Типы размеров сеток
 *
 * TypeS: до 143px
 *
 * TypeM: до 221px
 *
 * TypeL: до 280px
 */
export enum EFormLayoutType {
  TypeS = "type_s",
  TypeM = "type_m",
  TypeL = "type_l",
  ModalType = "modal_type",
}

type TAntFormProps = Pick<FormProps, "layout" | "colon" | "labelAlign" | "labelCol" | "wrapperCol">;

/**
 * Интерфейс для описание пропсов которые можно передавать извне в компонент
 */
export interface IBaseFormProps extends TAntFormProps {
  /**
   * Элемент хэдера
   *
   * Если не передаем явно или передаем `undefined`, то будет использован хэдер по умолчанию,
   * если передаем `null`, то хэдер не будет отображаться
   */
  header?: JSX.Element | JSX.Element[] | null;
  /**
   * Элемент футера
   *
   * Отображается, только если передаём явно
   */
  footer?: JSX.Element;
  /**
   * от него зависит размер labelCol, wrapperCol на разных брекпоинтах
   * по умолчанию используется `EFormLayoutType.TypeS`
   */
  customFooterStyle?: Interpolation<TTheme>;
  layoutType?: EFormLayoutType;
  notificationCol?: ColProps;
  attributes?: {
    [TestIdAttr]: string;
    ref: React.RefObject<HTMLDivElement | HTMLTableRowElement>;
    form: string;
  };
  // Стили контента формы
  formStyles?: Interpolation<TTheme>;
  originalError?: NCore.TError;
  showNotification?: boolean;
  "test-id"?: string;
  error?: NCore.TError;
  submitError?: NCore.TError;
}
