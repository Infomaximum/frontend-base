import { withModalError } from "../../decorators/hocs/withModalError/withModalError";
import type { ComponentType, ErrorInfo } from "react";
import { Component } from "react";
import { ErrorHandling } from "@infomaximum/utility";
import type {
  IAppErrorBoundaryProps,
  IErrorBoundaryProps,
  IErrorBoundaryState,
} from "./ErrorBoundary.types";

const AppErrorHandlingService = new ErrorHandling();

class ErrorBoundaryComponent extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public override readonly state = {
    hasError: false,
  };

  public override componentDidUpdate(prevProps: IErrorBoundaryProps) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;
    const { hasError } = this.state;

    if (hasError && prevLocation?.pathname !== location?.pathname) {
      this.setState({ hasError: false });
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { code, showModalError, extraParams, onError } = this.props;

    onError?.(error);

    if (process.env.NODE_ENV === "production") {
      const preparedError = {
        code,
        name: error.name,
        message: error.message,
        path: this.getPathName(),
        ...extraParams,
      };

      AppErrorHandlingService.registerError({ ...preparedError, errorInfo });

      showModalError({
        message: JSON.stringify(preparedError),
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `ошибка произошла по пути ${this.getPathName()} ошибка ${error} код: ${this.props.code}`
      );
    }
  }

  public getPathName() {
    return this.props?.location?.pathname ?? window.location?.pathname ?? "app";
  }

  public override render() {
    if (this.state.hasError) {
      // тут нужно отображать заглушку об ошибке
      return null;
    }

    return this.props.children;
  }
}

export const AppErrorBoundary = withModalError(ErrorBoundaryComponent) as unknown as ComponentType<
  Omit<IAppErrorBoundaryProps, "showModalError">
>;

export const ErrorBoundary = withModalError(ErrorBoundaryComponent);
