import enzyme from "enzyme";
import { Settings } from "./Settings";
import type { NCore } from "@im/core";

import {
  moduleGroupPath,
  getDisplayedSettingsRoutes,
} from "../../utils/Routes";
import { SettingsItem } from "./SettingsItem/SettingsItem";
import {
  getDefaultWrappers,
  testLocalization,
} from "../../utils/tests/wrappers";

const BASE_MODULE = {
  ru: "Base",
  en: "Base",
};

const MODULE_1 = {
  ru: "Модуль 1",
  en: "Module 1",
};
const MODULE_2 = {
  ru: "Модуль 2",
  en: "Module 2",
};
const TEST_PAGE = {
  ru: "Тестовая страница",
  en: "Test page",
};

const key1 = "1";
const key2 = "2";

const routes1: NCore.IRoutes = {
  key: "test1",
  path: moduleGroupPath,
  loc: BASE_MODULE,
  priority: 1000,
  routes: [
    {
      key: key1,
      priority: 100,
      loc: MODULE_1,
      routes: [
        {
          key: "test-page1",
          loc: TEST_PAGE,
          path: "/test-page1",
        },
      ],
    },
    {
      key: key2,
      priority: 400,
      loc: MODULE_2,
      routes: [
        {
          key: "test-page",
          loc: TEST_PAGE,
          path: "/test-page2",
        },
      ],
    },
  ],
};

const routes2: NCore.IRoutes = {
  key: "test2",
  path: moduleGroupPath,
  loc: BASE_MODULE,
  priority: 1000,
  routes: [
    {
      key: "111",
      loc: MODULE_1,
      routes: [
        {
          key: "test-page-1",
        },
        {
          key: "test-page-2",
          loc: TEST_PAGE,
        },
      ],
    },
    {
      key: "222",
      loc: MODULE_1,
      routes: [
        {
          key: "test-page",
        },
      ],
    },
  ],
};

const renderMountComponent = (route: NCore.IRoutes) => {
  return enzyme.mount(
    getDefaultWrappers(
      ["router", "theme", "localization"],
      <Settings routes={getDisplayedSettingsRoutes(route.routes ?? []) ?? []} />
    )
  );
};

const renderShallowComponent = (route: NCore.IRoutes) => {
  return enzyme.shallow(
    <Settings routes={getDisplayedSettingsRoutes(route.routes ?? []) ?? []} />
  );
};

describe("Тест компонента Settings", () => {
  test("Корректная фильтрация элементов подменю", () => {
    const component1 = renderShallowComponent(routes1);
    const component2 = renderShallowComponent(routes2);

    expect(component1.find(SettingsItem).length).toEqual(
      routes1.routes?.length
    );
    expect(component2.find(SettingsItem).length).toEqual(1);
  });

  test("Роуты сортируются по приоритету для отображения", () => {
    const component = renderMountComponent(routes1);

    expect(component.find(SettingsItem).at(0).prop("title")).toEqual(
      testLocalization.getLocalized(MODULE_2)
    );
    expect(component.find(SettingsItem).at(1).prop("title")).toEqual(
      testLocalization.getLocalized(MODULE_1)
    );
  });
});
