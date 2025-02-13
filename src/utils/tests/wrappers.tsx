import { ThemeContext } from "../../decorators/contexts/ThemeContext";
// eslint-disable-next-line im/ban-import-entity
import { theme } from "../../styles/theme";
import { Localization } from "@infomaximum/localization";
import { reduce } from "lodash";
import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import { LocalizationContext } from "../../decorators/contexts/LocalizationContext";

export const testLocalization = new Localization({
  language: Localization.Language.ru,
});

type TWrapperKey = "theme" | "localization" | "router";

export const getThemeWrapper = (element: JSX.Element) => {
  return <ThemeContext.Provider value={theme}>{element}</ThemeContext.Provider>;
};

export const getLocalizationWrapper = (element: JSX.Element) => {
  return (
    <LocalizationContext.Provider value={testLocalization}>{element}</LocalizationContext.Provider>
  );
};

export const getRouterWrapper = (element: JSX.Element) => {
  const future = { v7_startTransition: true };
  const getBrowserRouter = (props: any) =>
    createBrowserRouter(
      createRoutesFromChildren(<Route path="*" element={React.cloneElement(element, props)} />)
    );

  return React.createElement((props: typeof element.props) => (
    <RouterProvider router={getBrowserRouter(props)} future={future} />
  ));
};

const wrappers: Record<TWrapperKey, (element: JSX.Element) => JSX.Element> = {
  // должен быть первым, чтобы скинуть пропсы именно самому компоненту а не обертке
  router: getRouterWrapper,
  theme: getThemeWrapper,
  localization: getLocalizationWrapper,
};

export const getDefaultWrappers = (wrapperKey: TWrapperKey[], element: JSX.Element) =>
  reduce(
    wrappers,
    (acc, func, key) => (wrapperKey.includes(key as TWrapperKey) ? func(acc) : acc),
    element
  );
