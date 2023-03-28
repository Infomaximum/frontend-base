/// <reference types="@emotion/react/types/css-prop" />

import type { Model } from "@infomaximum/graphql-model";
import type { theme } from "./styles/theme";
import type { Store } from "./utils/Store/Store";

type TFrontendConfigImage = {
  // id родительского элемента в который будет добавлена картинка
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type TFrontendConfigFont = {
  fontFamily: string;
  src: string;
  fontWeight: string | number;
  fontStyle: string;
};

declare global {
  type TDictionary<T = any> = Record<string, T>;

  type TNullable<T> = T | null | undefined;

  // eslint-disable-next-line im/naming-interfaces-and-types
  type valueof<T> = T[keyof T];

  /**
   * Создание брендированного типа
   */
  type TBrand<T, B extends string> = T & { readonly _brand: B };

  type TRemoveIndex<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
  };

  type TQueryVarModifierExt<S extends Store<Model> = Store<Model>> = (
    variables: TDictionary,
    queryParams: { store: S }
  ) => void;

  // eslint-disable-next-line im/naming-interfaces-and-types
  interface Window {
    activeRequests: number;
    isRejectionRequired: boolean;

    imFrontEndSystem: {
      /** Версии внутренних модулей */
      versions: TDictionary<string>;
      /** Префикс пути для загрузки ресурсов */
      apiPrefix: string;
      /** Префикс для разделения пути для загрузки данных */
      basePrefix: string;
      /** Подключаемые ресурсы */
      sources: {
        stylesheets: string[];
        scripts: string[];
        fonts: TFrontendConfigFont[];
        images: TFrontendConfigImage[];
      };
    };
  }

  type TTheme = typeof theme;
}

export {};
