import type { ReactNode } from "react";
import type { ColProps } from "antd/lib/col";
import type { Interpolation } from "@emotion/react";
import type { NCore } from "@infomaximum/module-expander";
import type { FormLabelAlign } from "antd/lib/form/interface";

export interface IFormOptionProps {
  /**
   * Подпись слева от поля формы
   */
  label?: ReactNode;

  /**
   * Конфигурация колонок для label
   */
  labelCol?: ColProps;

  /**
   * Конфигурация колонок для содержимого
   */
  wrapperCol?: ColProps;

  /**
   * Расположение label относительно контента
   */
  labelAlign?: FormLabelAlign;

  /**
   * Отображать ли двоеточие после label
   */
  colon?: boolean;

  /**
   * Стили для FormItem
   */
  formItemStyle?: Interpolation<TTheme>;

  /**
   * Стили для label
   */
  labelStyle?: Interpolation<TTheme>;

  /**
   * test-id контейнера компонента
   */
  testId?: string;

  /**
   * test-id для иконки знака вопроса и текста внутри поповера
   */
  promptTestId?: string;

  /**
   * Подсвечивать ли рамку
   */
  highlightFieldWithError?: boolean;

  /**
   * Текст внутри всплывающей подсказки, при клике по иконке с вопросом.
   * Иконка появляется автоматически при добавлении текста
   */
  promptText?: ReactNode | string;

  /**
   * Дополнительный стиль к обертке всплывающей подсказки
   */
  promptWrapperStyle?: Interpolation<TTheme>;

  /**
   * Контейнер для всплывающей подсказки
   */
  getPromptPopupContainer?: (element: HTMLElement) => HTMLElement;

  /**
   * Подпись справа от field
   */
  rightLabel?: ReactNode;

  /**
   * Cтили которые применяются к компоненту обернутому в FormOption
   */
  wrapperComponentStyle?: Interpolation<TTheme>;

  /**
   * Описание ошибки поля
   */
  error?: NCore.TError;

  /**
   * Описание ошибки поля, после сохранения формы
   */
  submitError?: NCore.TError;

  /**
   * Состояние "тронутости" поля
   */
  touched?: boolean;

  /**
   * Состояние "валидности" поля
   */
  invalid?: boolean;

  /**
   * Описание, находится под полем
   */
  description?: string;

  /**
   * Приоритет расположения элемента в форме, чем выше приоритет, тем выше элемент в форме
   * (работает на первом уровне вложенности компонента формы со свойством sortByPriority)
   */
  priority?: number;
  children: React.ReactNode;
}
