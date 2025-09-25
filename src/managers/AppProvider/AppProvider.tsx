import { Global } from "@emotion/react";
import { type ELanguages, Localization } from "@infomaximum/localization";
import { type FC, memo, useEffect, useMemo } from "react";
import { DebugModeContext } from "@infomaximum/base/src/decorators/contexts/DebugModeContext";
import {
  FeatureContext,
  defaultFeatureChecker,
} from "@infomaximum/base/src/decorators/contexts/FeatureContext";
import { LocalizationContext } from "@infomaximum/base/src/decorators/contexts/LocalizationContext";
import { MainSystemPagePathContext } from "@infomaximum/base/src/decorators/contexts/MainSystemPagePathContext";
import { ThemeProvider } from "@infomaximum/base/src/decorators/contexts/ThemeContext";
import { globalStyles, theme } from "@infomaximum/base/src/styles";
import {
  componentsEnLocale,
  componentsRuLocale,
  EErrorBoundaryCodesBase,
  rootPath,
} from "@infomaximum/base/src/utils";
import { ErrorModalProvider } from "../ErrorModalProvider/ErrorModalProvider";
import { RouterProvider } from "../RouterProvider/RouterProvider";
import type { IRouterProviderProps } from "../RouterProvider/RouterProvider.types";
import { SystemInitializer } from "./SystemInitializer";
import enUS from "antd/es/locale/en_US";
import ruRu from "antd/es/locale/ru_RU";
import { ConfigProvider, type ThemeConfig } from "antd";
import { AppErrorBoundary } from "@infomaximum/base/src/components/ErrorBoundary/ErrorBoundary";
import { historyStore } from "@infomaximum/base/src/store/historyStore";
import { EDays, localeUpdate, type TFeatureEnabledChecker } from "@infomaximum/utility";
import { BrowserRouter } from "./BrowserRouter";
import { getThemeConfig } from "./antdTheme";
import {
  LicenseFeatureContext,
  defaultLicenseFeatureChecker,
} from "@infomaximum/base/src/decorators/contexts/LicenseFeatureContext";
import { StyleProvider } from "@ant-design/cssinjs";
import { messagesHolder, ConfigProvider as UiKitConfigProvider } from "@infomaximum/ui-kit";

export interface IAppProviderProps extends IRouterProviderProps {
  baseName?: string;
  language: ELanguages;
  featureChecker?: TFeatureEnabledChecker;
  licenseFeatureChecker?: TFeatureEnabledChecker;
  isDebugMode?: boolean;
  mainSystemPagePath?: string;
  theme?: TTheme;

  children?: (children: React.ReactNode) => React.ReactNode;
}

const AppProviderContainer: FC<IAppProviderProps> = (props) => {
  const {
    baseName,
    language,
    featureChecker = defaultFeatureChecker,
    licenseFeatureChecker = defaultLicenseFeatureChecker,
    isAuthorizedUser,
    isSystemInitialized,
    layout,
    routesConfig,
    unAuthorizedRoutes,
    unInitializeRoutes,
    isDebugMode,
    mainSystemPagePath,
    theme: themeProps,
    children: childrenProp,
  } = props;

  const localizationInstance = useMemo(() => new Localization({ language }), [language]);

  useEffect(() => {
    const currentLanguage = localizationInstance.getLanguage();

    document.documentElement.setAttribute("lang", currentLanguage);

    localeUpdate(currentLanguage, EDays.MONDAY);
  }, [localizationInstance]);

  const languageConfig = useMemo(() => {
    const { Language } = Localization;

    const currentLanguage = localizationInstance.getLanguage();

    return {
      currentLanguage,
      Language,
    };
  }, [localizationInstance]);

  const locale = useMemo(() => {
    const { currentLanguage, Language } = languageConfig;

    const locale = currentLanguage === Language.en ? enUS : ruRu;

    return locale;
  }, [languageConfig]);

  const uiKitLocale = useMemo(() => {
    const { currentLanguage, Language } = languageConfig;

    return currentLanguage === Language.en ? componentsEnLocale : componentsRuLocale;
  }, [languageConfig]);

  const _theme = themeProps ?? theme;

  const routerProvider = useMemo(
    () => (
      <RouterProvider
        layout={layout}
        isAuthorizedUser={isAuthorizedUser}
        isSystemInitialized={isSystemInitialized}
        unInitializeRoutes={unInitializeRoutes}
        routesConfig={routesConfig}
        unAuthorizedRoutes={unAuthorizedRoutes}
      />
    ),
    [
      isAuthorizedUser,
      isSystemInitialized,
      layout,
      routesConfig,
      unAuthorizedRoutes,
      unInitializeRoutes,
    ]
  );

  const children = useMemo(
    () => (
      <ErrorModalProvider isDebugMode={!!isDebugMode}>
        <SystemInitializer>
          {typeof childrenProp === "function" ? childrenProp(routerProvider) : routerProvider}
          {messagesHolder}
        </SystemInitializer>
      </ErrorModalProvider>
    ),
    [childrenProp, isDebugMode, routerProvider]
  );

  const antdTheme = useMemo(
    () => ({ ...getThemeConfig(), hashed: false }) satisfies ThemeConfig,
    []
  );

  return (
    <AppErrorBoundary code={EErrorBoundaryCodesBase.app}>
      <MainSystemPagePathContext.Provider value={mainSystemPagePath ?? rootPath}>
        <DebugModeContext.Provider value={!!isDebugMode}>
          <LocalizationContext.Provider value={localizationInstance}>
            <StyleProvider autoClear={true}>
              <ConfigProvider locale={locale} theme={antdTheme}>
                <UiKitConfigProvider locale={uiKitLocale}>
                  <ThemeProvider theme={_theme}>
                    <FeatureContext.Provider value={featureChecker}>
                      <LicenseFeatureContext.Provider value={licenseFeatureChecker}>
                        <Global styles={globalStyles(_theme)} />
                        <BrowserRouter basename={baseName ?? historyStore.basename}>
                          {children}
                        </BrowserRouter>
                      </LicenseFeatureContext.Provider>
                    </FeatureContext.Provider>
                  </ThemeProvider>
                </UiKitConfigProvider>
              </ConfigProvider>
            </StyleProvider>
          </LocalizationContext.Provider>
        </DebugModeContext.Provider>
      </MainSystemPagePathContext.Provider>
    </AppErrorBoundary>
  );
};

export const AppProvider = memo(AppProviderContainer);
