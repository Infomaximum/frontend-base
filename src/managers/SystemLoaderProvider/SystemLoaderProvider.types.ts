import type { Interpolation } from "@emotion/react";
import type { ReactNode } from "react";
import type { ISystemLoaderCallbackOptions } from "../../decorators/contexts/SystemLoaderContext";

export type TSystemLoaderCallbackExternalControlOptions = Omit<ISystemLoaderCallbackOptions, "id">;

export type TSystemLoaderProviderExternalHandlers = {
  showSystemLoader: (options?: TSystemLoaderCallbackExternalControlOptions) => void;
  hideSystemLoader: (options?: TSystemLoaderCallbackExternalControlOptions) => void;
  isLoading: () => boolean;
};

export interface ISystemLoaderProviderProps {
  children: ReactNode | ((params: TSystemLoaderProviderExternalHandlers) => ReactNode);
  /** стили для обертки */
  wrapperStyle?: Interpolation<TTheme>;
  /** стили для спиннера */
  backgroundSpinnerStyle?: Interpolation<TTheme>;
  /** вызывается при смене состояния загрузки провайдера */
  onLoadingChange?: (isLoading: boolean) => void;
  /**
   * Ключ для отладки провайдера
   */
  debugKey?: string;
  /** Функция рендеринга кастомного лоадера */
  renderLoader?: () => ReactNode;
  /** Задержка (ms), после которой лоадер скрывается принудительно */
  timeout?: number;
}
