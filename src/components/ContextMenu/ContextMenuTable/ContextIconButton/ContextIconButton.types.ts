import type { EContextIconButtonColors } from "./ContextIconButton";
import type { Interpolation } from "@emotion/serialize";
import type { CSSObject } from "@emotion/react";

export interface IEditableRowButtonProps<T = unknown> {
  color?: EContextIconButtonColors;
  title?: string;
  clickHandlerData?: T;
  onClick?(data: T): void;
  disabled?: boolean;
  /** Размер иконки */
  size?: number;
  /** Отображаемая иконка */
  icon: JSX.Element;
  /** Функция для добавления кастомных стилей
   *
   * @example
   * const customStyle = gerCustomContextIconButtonStyle({
   *    color: "red",
   *    hoverBackgroundColor: "green",
   *    hoverColor: "black",
   * })(theme: TTheme)
   */
  customStyle?: TCustomContextIconButtonStyle;
}

/** Типы для стилей */
export type TCustomContextIconButton = {
  color: string | null;
  hoverColor: string | null;
  hoverBackgroundColor: string | null;
  additionalStyles?: CSSObject;
};

export type TCustomContextIconButtonFuncStyle = (
  params: TCustomContextIconButton
) => (size: number) => (theme: TTheme) => Interpolation<TTheme>;

export type TCustomContextIconButtonStyle = (
  theme: TTheme
) => (size: number) => Interpolation<TTheme>;
