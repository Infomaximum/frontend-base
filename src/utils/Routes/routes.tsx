import {
  flatMap,
  uniq,
  compact,
  forEach,
  filter,
  map,
  flow,
  isEmpty,
  every,
  some,
  isArray,
  maxBy,
} from "lodash";
import { matchPath } from "react-router-dom";
import {
  changePasswordPath,
  initializePath,
  inviteSetPasswordPath,
  loginPath,
  moduleGroupPath,
  restorePath,
  rootPath,
  updatePasswordPath,
} from "./paths";

import { Expander } from "@infomaximum/module-expander";
import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import { RouteElement } from "../../components/routes/RouteElement/RouteElement";
import { assertSimple } from "@infomaximum/assert";
import { getPathToSessionStorage } from "../URI/URI";
import type { NCore } from "../../libs/core";

/**
 * @param items {NCore.IRoute[]} - конфиг роутов
 * @returns {NCore.IRoute[]} - линейный конфиг роутов
 */
export const routesMap = (
  items: NCore.IRoute[] | undefined,
  layoutWrapped: boolean = false
): NCore.IRoute[] =>
  flatMap(items, (item) => {
    const routes = [];

    if (item.routes && !item.isLayoutRoute && !layoutWrapped) {
      routes.push(...routesMap(item.routes));
    }

    const path = item.path ?? "/";
    const route = { ...item, exact: !!item.exact, originalPath: path };

    if (!item.exact) {
      route.path = path && path !== "*" ? `${path}/*` : "*";
    }

    if (item.component) {
      route.element = <RouteElement route={route} />;
    }

    if ((item.isLayoutRoute || layoutWrapped) && item.routes) {
      const childRoutes = routesMap(item.routes, true);
      route.routes = [];

      forEach(childRoutes, (childRoute) => {
        if (childRoute.isLayoutRoute) {
          routes.push(childRoute);
        } else {
          route.routes?.push({
            ...childRoute,
            path:
              childRoute.path &&
              item.path &&
              getRelativeRoutePath(childRoute.path, item.path, {
                exact: childRoute.exact,
              }),
          });
        }
      });
    }

    routes.push(route);

    return routes;
  });

/** Возвращает относительный путь */
export const getRelativeRoutePath = (
  childPath: string,
  parentPath: string,
  options?: { exact?: boolean }
) => {
  const exact = options?.exact ?? true;

  assertSimple(
    childPath.includes(parentPath),
    `Путь роута "${childPath}" должен содержать путь родителя "${parentPath}"`
  );

  if (childPath === parentPath) {
    return exact ? "/" : "*";
  }

  return childPath?.replace(`${parentPath}/`, "");
};

export const getRoutes = (items: NCore.IRoute[] | undefined): NCore.IRoute[] => {
  const routes = uniq(compact(routesMap(items)));

  // Важно: т.к. у вкладок могут быть компоненты-обертки над контентом, а дети отрисовываются
  // раньше родителей, нужно чтобы обертки отрисовывались раньше, чем контент,
  // иначе обертка не будет отрисована.
  return [
    ...filter(routes, (route) => !!route.isLayoutRoute),
    ...filter(routes, (route) => !route.isLayoutRoute),
  ];
};

export function sortByPriority<T extends { priority?: number }[]>(objects: T): T {
  if (!isArray(objects)) {
    return objects;
  }

  return objects.toSorted(({ priority: a = 0 }, { priority: b = 0 }) => b - a) as T;
}

/**
 * @param routes {IRoutes[]} - конфиг роутов
 * @returns {IRoutes[]} - отсортированный конфиг роутов
 */
export const sortPriority = (routes: NCore.IRoute[]): NCore.IRoute[] =>
  sortByPriority(
    map(routes, (route) =>
      route.routes ? { ...route, routes: sortPriority(route.routes) } : route
    )
  );

const hasOnlyRedirects = (routes: NCore.IRoute[]): boolean => {
  const routesCount: number = routes.length;
  let isOnlyRedirects: boolean = true;

  for (let i = 0; i < routesCount; i += 1) {
    if (!routes[i]?.isRedirectRoute) {
      isOnlyRedirects = false;
      break;
    }
  }

  return isOnlyRedirects && routesCount > 0;
};

/** Вырезает роуты к которым нет доступа */
export const resolveConstraintsInRoutes = (
  sourceRoutes: NCore.IRoute[] | undefined,
  isFeatureEnabled: TFeatureEnabledChecker,
  location: NCore.TRouteComponentProps["location"]
): NCore.IRoute[] => {
  if (!sourceRoutes) {
    return [];
  }

  const outputRoutes: NCore.IRoute[] = [];

  forEach(sourceRoutes, (sourceRoute) => {
    const { privileges, somePrivileges, childRoutesFilter } = sourceRoute;

    // Проверяет childRoutesFilter перед проверкой привилегий
    // todo: Рассмотреть возможность отказа от фильтрации роутов в других местах системы [PT-15971]
    if (childRoutesFilter && !childRoutesFilter(sourceRoute, isFeatureEnabled, location)) {
      return outputRoutes;
    }

    if (
      (!privileges ||
        (privileges &&
          every(privileges, (privilege) =>
            isFeatureEnabled.apply(null, isArray(privilege) ? privilege : [privilege])
          ))) &&
      (!somePrivileges ||
        (somePrivileges &&
          some(somePrivileges, (privilege) =>
            isFeatureEnabled.apply(null, isArray(privilege) ? privilege : [privilege])
          )))
    ) {
      if (!sourceRoute.routes) {
        outputRoutes.push({ ...sourceRoute });

        return;
      }

      const outputChildrenRoutes: NCore.IRoute[] = resolveConstraintsInRoutes(
        sourceRoute.routes,
        isFeatureEnabled,
        location
      );

      if (outputChildrenRoutes.length > 0 && !hasOnlyRedirects(outputChildrenRoutes)) {
        outputRoutes.push({ ...sourceRoute, routes: outputChildrenRoutes });
      }
    }
  });

  return outputRoutes;
};

/** Удалить из роутов слой для группировки модулей, мешающий обходу роутов с использованием path */
export function removeModulesLayer(routes: NCore.IRoute[]): NCore.IRoute[] {
  return routes.flatMap((route) => {
    if (route.path === moduleGroupPath) {
      return route.routes ? removeModulesLayer(route.routes) : [];
    }

    return [route.routes ? { ...route, routes: removeModulesLayer(route.routes) } : route];
  });
}

/**
 * Генерация "хлебных крошек"
 * @param routes - Массив иерархических роутов, по которым строить
 * @param fullPath - Путь, по которому необходимо построить "хлебные крошки"
 * @param locKey - Ключ к локализации
 * @param isHideLevel - Необходимо ли исключить уровень роутинга из "хлебных крошек"
 * @returns Плоский упорядоченный массив роутов, входящих в "хлебные крошки"
 */
export function breadcrumbsPacker(
  routes: NCore.IRoute[],
  fullPath: string,
  locKey: keyof NCore.IRoute,
  isHideLevel = false
): NCore.IRoute[] {
  if (isEmpty(routes) || !locKey) {
    return [];
  }

  const matchingRoute = maxBy(
    sortByPriority(routes),
    ({ path = "" }) => matchPath({ path, end: false }, fullPath)?.pathnameBase.length
  );

  if (!matchingRoute) {
    return [];
  }

  const { routes: childRoutes = [], isLayoutRoute } = matchingRoute;
  // Единственную локализованную вкладку не показываем в "крошках"
  const isHideNextLevel = isLayoutRoute && filter(childRoutes, locKey).length <= 1;

  const tail = breadcrumbsPacker(childRoutes, fullPath, locKey, isHideNextLevel);

  return matchingRoute[locKey] && !isHideLevel ? [matchingRoute, ...tail] : tail;
}

export const getBreadcrumbs = (
  currentPath: string,
  key: keyof NCore.IRoute = "loc"
): NCore.IRoute[] => {
  const routes = Expander.getInstance().getRoutes();

  // console.time("removing modules layer");
  const clearedRoutes = removeModulesLayer(routes);
  // console.timeEnd("removing modules layer");

  return breadcrumbsPacker(clearedRoutes, currentPath, key);
};

/**
 * Возвращает список ключей активных в данный момент роутов
 * @param {IRoutes[]} routes - конфигурация роутинга
 * @param {string} currentLocationPath - текущий pathname
 * @param {boolean} exact - точное соответствие
 */
export const getActiveRouteKeys = (
  routes: NCore.IRoute[],
  currentLocationPath: string,
  exact?: boolean
): string[] => {
  const selectedItems: string[] = [];
  const allRoutes = routesMap(routes);

  forEach(allRoutes, (item) => {
    if (item.path && matchPath({ path: item.path, end: exact }, currentLocationPath)) {
      selectedItems.push(String(item.key));
    }
  });

  return selectedItems;
};

/**
 * Пропускает неотображаемые роуты
 * @param {NCore.IRoute} - конфигурация роутинга
 */
const omitNonDisplayedChildren = ({ routes, ...rest }: NCore.IRoute) => ({
  routes: filter(routes, ({ loc }) => Boolean(loc)),
  ...rest,
});

/**
 * Возвращает подготовленные роуты основных настроек
 * @param {NCore.IRoute[]} - массив роутов
 */
export const getDisplayedSettingsRoutes = (
  routes: NCore.IRoute[] | undefined
): NCore.IRoute[] | undefined => {
  if (routes) {
    return flow([
      (routes) => map(routes, omitNonDisplayedChildren),
      (routes) => filter(routes, (route) => !isEmpty(route.routes)),
      sortPriority,
    ])(routes);
  }

  return undefined;
};

/** Проверяет, используется ли путь для авторизации или инициализации системы  */
export const isAuthorizationPath = (path: string) =>
  [
    loginPath,
    initializePath,
    restorePath,
    changePasswordPath,
    inviteSetPasswordPath,
    updatePasswordPath,
  ].some((routePath) => !!matchPath(routePath, path));

/**
 *
 * @returns Возвращает путь сохраненный в sessionStorage, если его нет, то rootPath
 */
export const getSavedSessionStoragePath = (): string => {
  const savedPath = getPathToSessionStorage();

  const pathname = !savedPath || savedPath === loginPath ? rootPath : savedPath;

  return pathname;
};
