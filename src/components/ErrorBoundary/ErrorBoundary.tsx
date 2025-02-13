import { withModalError } from "../../decorators/hocs/withModalError/withModalError";
import type { ComponentType, ErrorInfo } from "react";
import { Component } from "react";
import { ErrorHandling } from "@infomaximum/utility";
import type {
  IAppErrorBoundaryProps,
  IErrorBoundaryProps,
  IErrorBoundaryState,
} from "./ErrorBoundary.types";
import { EErrorCode } from "../../utils/const";
import { historyStore } from "../../store/historyStore";

const AppErrorHandlingService = new ErrorHandling();

class ErrorBoundaryComponent extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  private disposer: (() => void) | null = null;

  public override readonly state = {
    hasError: false,
  };

  public override componentDidMount(): void {
    this.disposer = historyStore.listenLocationChange(() => {
      this.state.hasError &&
        this.setState({
          hasError: false,
        });
    });
  }

  public override componentDidUpdate(prevProps: IErrorBoundaryProps) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;
    const { hasError } = this.state;

    if (hasError && prevLocation?.pathname !== location?.pathname) {
      this.setState({ hasError: false });
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { showModalError, onError } = this.props;

    onError?.(error);

    showModalError(this.getPreparedError(error, errorInfo));

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(
        `Ошибка произошла по пути ${this.getPathName()} ошибка ${error} код: ${this.props.code}`
      );
    }
  }

  public override componentWillUnmount(): void {
    this.disposer?.();
  }

  private getPreparedError(error: Error, errorInfo: ErrorInfo) {
    const { extraParams, code } = this.props;

    const preparedError = {
      code,
      name: error.name,
      message: error.message,
      path: this.getPathName(),
      ...extraParams,
    };

    AppErrorHandlingService.registerError({ ...preparedError, errorInfo });

    switch (error.name) {
      case "ChunkLoadError":
        return {
          ...preparedError,
          code: EErrorCode.CONNECTION_ERROR,
        };
      default:
        return {
          message: JSON.stringify(preparedError),
        };
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

export const AppErrorBoundary = withModalError(
  ErrorBoundaryComponent
) as unknown as ComponentType<IAppErrorBoundaryProps>;

export const ErrorBoundary = withModalError(ErrorBoundaryComponent);
