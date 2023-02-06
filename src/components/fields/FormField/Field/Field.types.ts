import type { ComponentType } from "react";
import type { FieldProps, FieldRenderProps } from "react-final-form";
import type { Interpolation } from "@emotion/react";

export interface IFieldProps<V, T extends FieldRenderProps<V> = FieldRenderProps<V>>
  extends FieldProps<V, T> {
  /**
   * Имя поля формы
   */
  name: string;
  /**
   * Переводит поле в режим "Только для чтения". Имеет более высокий приоритет, чем соответствующий параметр
   * генерируемый формой.
   */
  readOnly?: boolean;

  /**
   * Ключи привилегий, наличие которых необходимо для отображения поля формы. Если ключи не указаны, то проверка и
   * модификация не производится. Поле формы будет отображено в разных состояниях, как то полный доступ или режим только
   * для чтения, либо будет полностью скрыто, если не будет доступно ни одной операции по указанным привилегиям. Имеет
   * более высокий приоритет, чем ключи привилегй от формы.
   */
  accessKeys?: string[];

  /**
   * Cтили которые применяются к обертке data-name
   */
  fieldWrapperStyle?: Interpolation<TTheme>;

  /** Будут ли очищаться submitErrors, если значение у поля поменялось? В ArrayFieldItem в некоторых местах нужно отключать
   * @default true
   */
  isClearSubmitErrorsOnValueChange?: boolean;
}

export type TFieldProvider<V> = Pick<FieldRenderProps<V>, "meta">;

export interface IWrappedFieldProps<V> extends FieldRenderProps<V> {
  /**
   * Компонент, который необходимо подключить к react-final-form
   */
  fieldComponent?: ComponentType<FieldRenderProps<V>>;
  /**
   * Callback-функция для прокидывания свойств поля к компоненту на уровень выше
   */
  setFieldProvider?: (fieldProvider: TFieldProvider<V>) => void;
}
