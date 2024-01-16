import type { NCore } from "@infomaximum/module-expander";
import type { IWithModalErrorProps } from "../../decorators/hocs/withModalError/withModalError.types";

export interface IAppErrorBoundaryProps extends IWithModalErrorProps {
  /**
   * Дополнительные параметры которые будут обработаны
   */
  extraParams?: TDictionary;
  /**
   * Код, который говорит какой ErrorBoundary перехватил ошибку
   */
  code: string;
  /** Обработчик, вызываемый при возникновении ошибки */
  onError?(error: Error): void;

  children: React.ReactNode;
}

export interface IErrorBoundaryProps
  extends Partial<NCore.TRouteComponentProps>,
    IAppErrorBoundaryProps {}

export interface IErrorBoundaryState {
  hasError?: boolean;
}
