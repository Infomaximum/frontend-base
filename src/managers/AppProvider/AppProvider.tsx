import { Global } from "@emotion/react";
import { ELanguages, Localization } from "@im/localization";
import moment from "moment";
import { FC, useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { DebugModeContext } from "../../decorators/contexts/DebugModeContext";
import { FeatureContext } from "../../decorators/contexts/FeatureContext";
import { LocalizationContext } from "../../decorators/contexts/LocalizationContext";
import { MainSystemPagePathContext } from "../../decorators/contexts/MainSystemPagePathContext";
import { ThemeProvider } from "../../decorators/contexts/ThemeContext";
import { globalStyles, theme } from "../../styles";
import { EErrorBoundaryCodesBase, rootPath } from "../../utils";
import { ErrorModalProvider } from "../ErrorModalProvider/ErrorModalProvider";
import { RouterProvider } from "../RouterProvider/RouterProvider";
import type { IRouterProviderProps } from "../RouterProvider/RouterProvider.types";
import { DataInitializer } from "./DataInitializer";
import enUS from "antd/es/locale/en_US";
import ruRu from "antd/es/locale/ru_RU";
import { ConfigProvider } from "antd";
import { AppErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import { historyStore } from "../../store/historyStore";
import type { TFeatureEnabledChecker } from "@im/utils";

export interface IAppProviderProps extends IRouterProviderProps {
  baseName?: string;
  language: ELanguages;
  featureChecker?: TFeatureEnabledChecker;

  isDebugMode?: boolean;
  mainSystemPagePath?: string;
  theme?: TTheme;

  children?: (children: React.ReactNode) => React.ReactNode;
}

const defaultChecker = () => true;

const AppProvider: FC<IAppProviderProps> = (props) => {
  const {
    baseName,
    language,
    featureChecker,
    isAuthorizedUser,
    isSystemInitialized,
    layout,
    routesConfig,
    unAuthorizedRoutes,
    unInitializeRoutes,
    isDebugMode,
    mainSystemPagePath,
    theme: themeProps,
    children,
  } = props;

  const localizationInstance = useMemo(() => new Localization({ language }), [language]);

  useEffect(() => {
    const currentLanguage = localizationInstance.getLanguage();

    moment.locale(currentLanguage);
  }, [localizationInstance]);

  const locale = useMemo(() => {
    const { Language } = Localization;

    const currentLanguage = localizationInstance.getLanguage();

    const locale = currentLanguage === Language.en ? enUS : ruRu;

    return locale;
  }, [localizationInstance]);

  const _theme = themeProps ?? theme;

  const routerProvider = (
    <RouterProvider
      layout={layout}
      isAuthorizedUser={isAuthorizedUser}
      isSystemInitialized={isSystemInitialized}
      unInitializeRoutes={unInitializeRoutes}
      routesConfig={routesConfig}
      unAuthorizedRoutes={unAuthorizedRoutes}
    />
  );

  return (
    <AppErrorBoundary code={EErrorBoundaryCodesBase.app}>
      <MainSystemPagePathContext.Provider value={mainSystemPagePath ?? rootPath}>
        <DebugModeContext.Provider value={!!isDebugMode}>
          <BrowserRouter basename={baseName ?? historyStore.basename}>
            <ThemeProvider theme={_theme}>
              <LocalizationContext.Provider value={localizationInstance}>
                <FeatureContext.Provider value={featureChecker ?? defaultChecker}>
                  <ErrorModalProvider isDebugMode={!!isDebugMode}>
                    <ConfigProvider locale={locale}>
                      <DataInitializer>
                        <Global styles={globalStyles(_theme)} />

                        {typeof children === "function" ? children(routerProvider) : routerProvider}
                      </DataInitializer>
                    </ConfigProvider>
                  </ErrorModalProvider>
                </FeatureContext.Provider>
              </LocalizationContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        </DebugModeContext.Provider>
      </MainSystemPagePathContext.Provider>
    </AppErrorBoundary>
  );
};

export { AppProvider };
