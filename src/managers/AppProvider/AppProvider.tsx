import { Global } from "@emotion/react";
import { ELanguages, Localization } from "@im/localization";
import { FC, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { FeatureContext } from "../../decorators/contexts/FeatureContext";
import { LocalizationContext } from "../../decorators/contexts/LocalizationContext";
import { ThemeProvider } from "../../decorators/contexts/ThemeContext";
import { globalStyles, theme } from "../../styles";
import { ErrorModalProvider } from "../ErrorModalProvider/ErrorModalProvider";
import { RouterProvider } from "../RouterProvider/RouterProvider";
import type { IRouterProviderProps } from "../RouterProvider/RouterProvider.types";
import { DataInitializer } from "./DataInitializer";

export interface IAppProviderProps extends IRouterProviderProps {
  baseName: string;
  language: ELanguages;
  featureChecker?: () => boolean;

  isDebugMode?: boolean;
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
  } = props;

  const localizationInstance = useMemo(
    () => new Localization({ language }),
    [language]
  );

  return (
    <BrowserRouter basename={baseName}>
      <ThemeProvider theme={theme}>
        <LocalizationContext.Provider value={localizationInstance}>
          <FeatureContext.Provider value={featureChecker ?? defaultChecker}>
            <ErrorModalProvider isDebugMode={!!isDebugMode}>
              <DataInitializer>
                <Global styles={globalStyles(theme)} />

                <RouterProvider
                  layout={layout}
                  isAuthorizedUser={isAuthorizedUser}
                  isSystemInitialized={isSystemInitialized}
                  unInitializeRoutes={unInitializeRoutes}
                  routesConfig={routesConfig}
                  unAuthorizedRoutes={unAuthorizedRoutes}
                />
              </DataInitializer>
            </ErrorModalProvider>
          </FeatureContext.Provider>
        </LocalizationContext.Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export { AppProvider };
