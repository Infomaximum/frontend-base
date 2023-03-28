import type { Interpolation, Theme } from "@emotion/react";
import type { IBannerAlertProps } from "./components/BannerAlert/BannerAlert.types";

type TBannerALertProps = Pick<IBannerAlertProps, "icon" | "backgroundColor">;

export interface IBannerProps extends TBannerALertProps {
  /** отображаемый контент (поддерживает markdown) */
  content: string | undefined;
  /** отображать чекбокс кнопку закрытия и чекбокс "Больше не показывать" */
  showDontShowAgain: boolean;
  /** обработчик закрытия банера */
  onClose?(): void;
  /** обработчик переключения состояния чекбокса "Больше не показывать" */
  setDontShowAgain?(value: boolean): void;
  /**  нужно ли возможность закрывать баннер */
  closable: boolean;
  "test-id"?: string;
  className?: string;
  wrapperContentStyle?: Interpolation<Theme>;
}
