import { includes, replace } from "lodash";

export const getBasePrefix = () => window.im.system.basePrefix;

/** Сохраняет текущий путь если выкидывает на страницу с логином */
export const savePathToSessionStorage = (): void => {
  setPathToSessionStorage(
    replace(window.location.pathname, new RegExp(`(\/[\w \.-]*)*${getBasePrefix()}`), "")
  );
};

/** Изменяет путь для возврата на страницу с которой выкинуло */
export const setPathToSessionStorage = (path: string): void => {
  sessionStorage.setItem("currentPath", path);
};

/**
 * Получает текущий путь для возвращения на страницу с которой выкинуло
 * @returns {string}
 */
export const getPathToSessionStorage = (): string | null => sessionStorage.getItem("currentPath");

/**
 * Удаляет путь для возвращения на страницу с которой выкинуло
 */
export const removePathToSessionStorage = (): void => {
  sessionStorage.removeItem("currentPath");
};

/**
 * Проверяет является ли childURI вложенным в rootURI
 * @param {string} rootURI - базовая строка
 * @param {string} childURI - строка, проверяемая на содержание в rootURI
 * @returns {boolean}
 */
export function contains(rootURI: string, childURI: string): boolean {
  return includes(rootURI, childURI);
}

/** Путь для выполнения запросов, учитывает saas */
export const getApiPrefix = () => window.im.system.apiPrefix;

/** Путь для graphql запросов, учитывает saas */
export const getGraphqlURL = () => `${getApiPrefix()}/graphql`;

/**
 * Текущий хост без протокола
 */
export const getCurrentHostWithoutProtocol = () => `${window.location.host}${getApiPrefix()}/`;

/**
 * Текущий хост c протоколом
 */
export const getCurrentHost = () =>
  `${window.location.protocol}//${getCurrentHostWithoutProtocol()}`;

/**
 * Проверка на https
 */
export const isHttps = () => window.location.protocol === "https:";
