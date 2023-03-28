import { includes, replace } from "lodash";

export const getBasePrefix = () => window.imFrontEndSystem.basePrefix;

/** Сохраняет текущий путь если выкидывает на страницу с логином */
export const savePathToLocalStorage = (): void => {
  setPathToLocalStorage(
    replace(window.location.pathname, new RegExp(`(\/[\w \.-]*)*${getBasePrefix()}`), "")
  );
};

/** Изменяет путь для возврата на страницу с которой выкинуло */
export const setPathToLocalStorage = (path: string): void => {
  localStorage.setItem("currentPath", path);
};

/**
 * Получает текущий путь для возвращения на страницу с которой выкинуло
 * @returns {string}
 */
export const getPathToLocalStorage = (): string | null => localStorage.getItem("currentPath");

/**
 * Удаляет путь для возвращения на страницу с которой выкинуло
 */
export const removePathToLocalStorage = (): void => {
  localStorage.removeItem("currentPath");
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
export const getApiPrefix = () => window.imFrontEndSystem.apiPrefix;

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
