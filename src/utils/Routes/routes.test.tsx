import type { NCore } from "@im/core";
import { RouteElement } from "../../components/routes/RouteElement/RouteElement";
import type { ReactElement } from "react";
import { moduleGroupPath } from "./paths";
import {
  getRelativeRoutePath,
  routesMap,
  breadcrumbsPacker,
  removeModulesLayer,
} from "./routes";

describe("Тесты методов работы с роутингом - routes", () => {
  describe("Удаления из роутов слоя для группировки модулей", () => {
    const routes = [
      { path: "/a" },
      {
        path: "/b",
        routes: [
          {
            path: moduleGroupPath,
            routes: [
              { path: "/b/a" },
              { path: "/b/b", routes: [{ path: "b/b/a" }] },
            ],
          },
        ],
      },
      {
        path: "/c",
        routes: [
          { path: "/c/a" },
          { path: "/c/b", routes: [{ path: "c/b/a" }] },
        ],
      },
    ];

    it("Структура роутов очищается", () => {
      expect(removeModulesLayer(routes)).toEqual([
        { path: "/a" },
        {
          path: "/b",
          routes: [
            { path: "/b/a" },
            { path: "/b/b", routes: [{ path: "b/b/a" }] },
          ],
        },
        {
          path: "/c",
          routes: [
            { path: "/c/a" },
            { path: "/c/b", routes: [{ path: "c/b/a" }] },
          ],
        },
      ]);
    });
  });

  describe(`Генерация "хлебных крошек"`, () => {
    const routes1 = [
      {
        loc: "a",
        path: "/a",
        routes: [
          { path: "/a/aa", routes: [{ loc: "aaa", path: "/a/aa/aaa" }] },
          {
            path: "/a/aa/:id/tab",
            routes: [{ loc: "tab", path: "/a/aa/:id/tab" }],
          },
        ],
      },
      {
        loc: "b",
        path: "/b",
        routes: [
          {
            loc: "ba",
            path: "/b/ba",
            routes: [{ loc: "baa", path: "/b/ba/baa" }, { path: "/b/ba/bab" }],
          },
        ],
      },
    ];

    function generateCrumbsLocs(routes: any, path: string) {
      return breadcrumbsPacker(routes, path, "loc").map(({ loc }) => loc);
    }

    it("Пустой путь", () => {
      expect(generateCrumbsLocs(routes1, "")).toEqual([]);
    });

    it("Для промежуточного роута нет локализации", () => {
      expect(generateCrumbsLocs(routes1, "/a/aa/aaa")).toEqual(["a", "aaa"]);
    });

    it("Выбор роута, имеющего наибольшую длину совпадения", () => {
      expect(generateCrumbsLocs(routes1, "/a/aa/1/tab")).toEqual(["a", "tab"]);
    });

    it("Для целевого роута нет локализации", () => {
      expect(generateCrumbsLocs(routes1, "/b/ba/bab")).toEqual(["b", "ba"]);
    });

    it("Для всех роутов есть локализации", () => {
      expect(generateCrumbsLocs(routes1, "/b/ba/baa")).toEqual([
        "b",
        "ba",
        "baa",
      ]);
    });

    const routes2 = [
      {
        loc: "a",
        path: "/a",
        routes: [
          {
            loc: "aa",
            path: "/a/aa",
            isLayoutRoute: true,
            routes: [
              {
                loc: "aaa",
                path: "/a/aa/aaa",
                routes: [{ loc: "aaaa", path: "/a/aa/aaa/aaaa" }],
              },
              {
                path: "/a/aa/aab",
                routes: [{ loc: "aaba", path: "/a/aa/aab/aaba" }],
              },
            ],
          },
          {
            loc: "ab",
            path: "/a/ab",
            isLayoutRoute: true,
            routes: [
              {
                loc: "aba",
                path: "/a/ab/aba",
                routes: [{ loc: "abaa", path: "/a/ab/aba/abaa" }],
              },
              {
                loc: "abb",
                path: "/a/ab/abb",
                routes: [{ loc: "abba", path: "/a/ab/aba/abba" }],
              },
            ],
          },
        ],
      },
    ];

    it(`Единственная локализованная вкладка профиля не попадает в "крошки"`, () => {
      expect(generateCrumbsLocs(routes2, "/a/aa/aaa/aaaa")).toEqual([
        "a",
        "aa",
        "aaaa",
      ]);
    });

    it(`При наличии нескольких локализованных вкладок, вкладка профиля попадает в "крошки"`, () => {
      expect(generateCrumbsLocs(routes2, "/a/ab/aba/abaa")).toEqual([
        "a",
        "ab",
        "aba",
        "abaa",
      ]);
    });
  });

  describe("Тесты метода getRelativePath", () => {
    it("Дочерний путь содержится в родительском", () => {
      expect(getRelativeRoutePath("a/b", "a")).toEqual("b");
    });

    it("Дочерний путь совпадает с родительским, exact не задан", () => {
      expect(getRelativeRoutePath("a/b", "a/b")).toEqual("/");
    });

    it("Дочерний путь совпадает с родительским, exact = true", () => {
      expect(getRelativeRoutePath("a/b", "a/b", { exact: true })).toEqual("/");
    });

    it("Дочерний путь совпадает с родительским, exact = false", () => {
      expect(getRelativeRoutePath("a/b", "a/b", { exact: false })).toEqual("*");
    });
  });

  describe("Тесты метода routesMap", () => {
    it("Плоский список", () => {
      const TestComponent = () => <>test</>;
      const routeConfig: NCore.IRoutes[] = [
        {
          key: "a",
          path: "a",
          originalPath: "a",
          element: <TestComponent />,
          exact: true,
        },
      ];

      expect(routesMap(routeConfig)).toEqual(routeConfig);
    });

    it("Преобразование параметра 'component' в 'element'", () => {
      const TestComponent = () => <>test</>;
      const route = {
        key: "a",
        path: "a",
        component: TestComponent,
        exact: true,
      };
      const routeConfig: NCore.IRoutes[] = [route];

      expect(
        ((routesMap(routeConfig)[0] as NCore.IRoutes).element as ReactElement)
          .type
      ).toBe(RouteElement);
      expect(
        ((routesMap(routeConfig)[0] as NCore.IRoutes).element as ReactElement)
          .props.route.key
      ).toEqual(route.key);
    });

    it("Роуты с типом layout на первом уровне вложенности", () => {
      const routeC = {
        key: "c",
        path: "a/b/c",
      };
      const routeB = {
        key: "b",
        path: "a/b",
        isLayoutRoute: true,
        routes: [routeC],
      };
      const routeA = {
        key: "a",
        path: "a",
        routes: [routeB],
      };

      const routeConfig: NCore.IRoutes[] = [routeA];

      expect(
        routesMap(routeConfig).find((route) => route.key === routeB.key)
      ).not.toBeUndefined();
    });

    it("Роуты с типом layout на первом уровне вложенности, когда layout вложен в layout", () => {
      const routeC = {
        key: "c",
        path: "a/b/c",
        isLayoutRoute: true,
      };
      const routeB = {
        key: "b",
        path: "a/b",
        isLayoutRoute: true,
        routes: [routeC],
      };
      const routeA = {
        key: "a",
        path: "a",
        routes: [routeB],
      };

      const routeConfig: NCore.IRoutes[] = [routeA];

      expect(
        routesMap(routeConfig).find((route) => route.key === routeB.key)
      ).not.toBeUndefined();
      expect(
        routesMap(routeConfig).find((route) => route.key === routeC.key)
      ).not.toBeUndefined();
    });

    it("Дочерние роуты не преобразуются в плоский список внутри layout, если layout на первом уровне вложенности", () => {
      const routeC = {
        key: "c",
        path: "a/b/c",
      };
      const routeB = {
        key: "b",
        path: "a/b",
        routes: [routeC],
      };
      const routeA = {
        key: "a",
        path: "a",
        routes: [routeB],
        isLayoutRoute: true,
      };

      const routeConfig: NCore.IRoutes[] = [routeA];

      expect(routesMap(routeConfig)[0]?.key).toEqual(routeA.key);
      expect(routesMap(routeConfig)[0]?.routes?.[0]?.key).toEqual(routeB.key);
      expect(routesMap(routeConfig)[0]?.routes?.[0]?.routes?.[0]?.key).toEqual(
        routeC.key
      );
    });

    it("Дочерние роуты не преобразуются в плоский список внутри layout, если layout на втором уровне вложенности", () => {
      const routeF = {
        key: "f",
        path: "f",
      };
      const routeE = {
        key: "e",
        path: "e",
        routes: [routeF],
      };
      const routeD = {
        key: "d",
        path: "a/b/c/d",
      };
      const routeC = {
        key: "c",
        path: "a/b/c",
        routes: [routeD],
      };
      const routeB = {
        key: "b",
        path: "a/b",
        routes: [routeC],
        isLayoutRoute: true,
      };
      const routeA = {
        key: "a",
        path: "a",
        routes: [routeB],
      };

      const routeConfig: NCore.IRoutes[] = [routeA, routeE];

      expect(routesMap(routeConfig)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: routeA.key,
          }),
          expect.objectContaining({
            key: routeB.key,
          }),
          expect.objectContaining({
            key: routeE.key,
          }),
          expect.objectContaining({
            key: routeF.key,
          }),
        ])
      );
      expect(
        routesMap(routeConfig).find((route) => route.key === routeB.key)?.routes
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: routeC.key,
          }),
        ])
      );
      expect(
        routesMap(routeConfig)
          .find((route) => route.key === routeB.key)
          ?.routes?.find((route) => route.key === routeC.key)?.routes
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: routeD.key,
          }),
        ])
      );
    });
  });
});
