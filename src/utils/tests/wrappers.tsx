/* eslint-disable react/jsx-no-bind */
import { ThemeContext } from "@emotion/react";
// eslint-disable-next-line im/ban-import-entity
import { theme } from "../../styles/theme";
import { Localization } from "@im/utils";
import { reduce } from "lodash";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LocalizationContext from "../../decorators/contexts/LocalizationContext";

export const testLocalization = new Localization({
  language: Localization.Language.ru,
});

type TWrapperKey = "theme" | "localization" | "router";

export const getThemeWrapper = (element: JSX.Element) => {
  return <ThemeContext.Provider value={theme}>{element}</ThemeContext.Provider>;
};

export const getLocalizationWrapper = (element: JSX.Element) => {
  return (
    <LocalizationContext.Provider value={testLocalization}>
      {element}
    </LocalizationContext.Provider>
  );
};

export const getRouterWrapper = (element: JSX.Element) => {
  return React.createElement((props: typeof element.props) => (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={React.cloneElement(element, props)} />
      </Routes>
    </BrowserRouter>
  ));
};

const wrappers: Record<TWrapperKey, (element: JSX.Element) => JSX.Element> = {
  // должен быть первым, чтобы скинуть пропсы именно самому компоненту а не обертке
  router: getRouterWrapper,
  theme: getThemeWrapper,
  localization: getLocalizationWrapper,
};

export const getDefaultWrappers = (
  wrapperKey: TWrapperKey[],
  element: JSX.Element
) =>
  reduce(
    wrappers,
    (acc, func, key) =>
      wrapperKey.includes(key as TWrapperKey) ? func(acc) : acc,
    element
  );
