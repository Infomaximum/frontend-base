/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, forwardRef, useImperativeHandle, useRef, useLayoutEffect, useId } from "react";
import { SystemLoaderContext } from "../../decorators/contexts/SystemLoaderContext";
import {
  backgroundSpinnerStyle,
  getSystemLoaderProviderStyle,
} from "./SystemLoaderProvider.styles";
import { GlobalSpinner } from "../../components/Spinner";
import type {
  ISystemLoaderProviderProps,
  TSystemLoaderProviderExternalHandlers,
} from "./SystemLoaderProvider.types";
import { useLoaderContextValue } from "./hooks/useLoaderContextValue";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { EErrorBoundaryCodesBase } from "../../utils/const";

/**
 * Провайдер системного лоадера(спиннера), позволяет централизованно управлять отображением
 * лоадеров в системе через контекст
 */
export const SystemLoaderProvider = forwardRef<
  TSystemLoaderProviderExternalHandlers,
  ISystemLoaderProviderProps
>((props, ref) => {
  const { children, wrapperStyle, onLoadingChange, debugKey, renderLoader, timeout } = props;

  const isMountedRef = useRef(false);
  const providerId = useId();

  const systemLoaderContext = useContext(SystemLoaderContext);

  const { isLoading, contextValue, handleComplete, externalControlHandlers } =
    useLoaderContextValue({
      debugKey,
      timeout,
      providerId,
    });

  useLayoutEffect(
    /** оповещение о смене состояния загрузки провайдера */
    () => {
      onLoadingChange?.(isLoading);
    },
    [isLoading, onLoadingChange, systemLoaderContext]
  );

  useLayoutEffect(() => {
    // защита от "фичи" react, двойное срабатывание эффектов в react strict dev режиме
    if (isMountedRef.current) {
      return;
    }

    if (systemLoaderContext.isLoading()) {
      /** сообщаем родительскому провайдеру о том что этот провайдер загружается только если
       * родитель находится в состоянии загрузки и уже перекрывает контент,
       * это необходимо для того, чтобы не переводить родителя в состояние загрузки с
       * перекрытием всего отображаемого контента
       */
      systemLoaderContext.showSystemLoader({ debugKey, id: providerId });
    }

    isMountedRef.current = true;

    // если по какой то причине провайдер размонтируется, то уведомляем родительский провайдер
    return () => {
      handleComplete();
    };
  }, []);

  useImperativeHandle(ref, () => externalControlHandlers, [externalControlHandlers]);

  const spinner = renderLoader ? (
    renderLoader()
  ) : (
    <GlobalSpinner wrapperStyle={props.backgroundSpinnerStyle ?? backgroundSpinnerStyle} />
  );

  return (
    <SystemLoaderContext.Provider value={contextValue}>
      <div
        css={[
          getSystemLoaderProviderStyle(
            isLoading ||
              /* не отображаем контент раньше родителя */
              systemLoaderContext.isLoading()
          ),
          wrapperStyle,
        ]}
      >
        <ErrorBoundary code={EErrorBoundaryCodesBase.loaderProvider} onError={handleComplete}>
          {typeof children === "function" ? children(externalControlHandlers) : children}
        </ErrorBoundary>
      </div>

      {/* не отображаем спиннер, если у родителя он уже отображается (перекрывает текущий) */}
      {isLoading && !systemLoaderContext.isLoading() && spinner}
    </SystemLoaderContext.Provider>
  );
});
