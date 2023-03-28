import type { Interpolation, Theme } from "@emotion/react";
import type React from "react";

export interface IBannerAlertProps {
  children: React.ReactNode;

  /** нужна ли возможность закрывать алерт */
  closable: boolean;

  /** обработчик закрытия */
  onClose?(): void;

  /** иконка которая будет отображаться перед текстом */
  icon?: JSX.Element;

  /** цвет фона */
  backgroundColor?: string;
  wrapperContentStyle?: Interpolation<Theme>;
}
