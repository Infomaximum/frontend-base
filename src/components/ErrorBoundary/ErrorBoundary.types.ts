import type { NCore } from "@im/core";
import type { IWithModalErrorProps } from "src/decorators/hocs/withModalError/withModalError.types";

export interface IAppErrorBoundaryProps extends IWithModalErrorProps {
  /**
   * Дополнительные параметры которые будут обработаны
   */
  extraParams?: TDictionary;
  /**
   * Код, который говорит какой ErrorBoundary перехватил ошибку
   */
  code: string;

  children: React.ReactNode;
}

export interface IErrorBoundaryProps
  extends Partial<NCore.TRouteComponentProps>,
    IAppErrorBoundaryProps {}

export interface IErrorBoundaryState {
  hasError?: boolean;
}
