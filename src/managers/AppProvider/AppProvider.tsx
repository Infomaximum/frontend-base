import "dayjs/locale/ru";
import "dayjs/locale/en";
import { Global } from "@emotion/react";
import { type ELanguages, Localization } from "@infomaximum/localization";
import { type FC, memo, useEffect, useMemo } from "react";
import { DebugModeContext } from "../../decorators/contexts/DebugModeContext";
import { FeatureContext, defaultFeatureChecker } from "../../decorators/contexts/FeatureContext";
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
import { ConfigProvider, type ThemeConfig } from "antd";
import { AppErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import { historyStore } from "../../store/historyStore";
import { EDays, localeUpdate, type TFeatureEnabledChecker } from "@infomaximum/utility";
import { BrowserRouter } from "./BrowserRouter";
import { getThemeConfig } from "./antdTheme";
import {
  LicenseFeatureContext,
  defaultLicenseFeatureChecker,
} from "../../decorators/contexts/LicenseFeatureContext";
import { StyleProvider } from "@ant-design/cssinjs";

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

  const locale = useMemo(() => {
    const { Language } = Localization;

    const currentLanguage = localizationInstance.getLanguage();

    const locale = currentLanguage === Language.en ? enUS : ruRu;

    return locale;
  }, [localizationInstance]);

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
        <DataInitializer>
          {typeof childrenProp === "function" ? childrenProp(routerProvider) : routerProvider}
        </DataInitializer>
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
              </ConfigProvider>
            </StyleProvider>
          </LocalizationContext.Provider>
        </DebugModeContext.Provider>
      </MainSystemPagePathContext.Provider>
    </AppErrorBoundary>
  );
};

export const AppProvider = memo(AppProviderContainer);
