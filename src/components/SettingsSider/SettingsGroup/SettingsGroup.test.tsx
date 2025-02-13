import enzyme from "enzyme";
import { settingsItemTitleTestId } from "../../../utils/TestIds";
import { Link } from "react-router-dom";
import { getRouterWrapper, testLocalization } from "../../../utils";
import { SettingsGroup } from "./SettingsGroup";

const title = "Модуль";
const path = "/Module";

const MODULE = {
  ru: "Модуль",
  en: "Module",
};

const MODULE_1 = {
  ru: "Модуль_1",
  en: "Module_1",
};

const MODULE_2 = {
  ru: "Модуль_2",
  en: "Module_2",
};

const routes = [
  {
    key: "1",
    path: path,
    loc: MODULE,
  },
  {
    key: "2",
    path: path,
    loc: MODULE_1,
  },
  {
    key: "3",
    path: path,
    loc: MODULE_2,
  },
];

const renderMountComponent = (title: string) => {
  return enzyme.mount(getRouterWrapper(<SettingsGroup title={title} routes={routes} />));
};

describe("Тест компонента SettingsGroup", () => {
  it("Тестирование title компонента SettingsGroup", () => {
    const component = renderMountComponent(title);

    expect(component.find(SettingsGroup).prop("title")).toEqual(title);
    expect(component.find(`div[test-id="${settingsItemTitleTestId}"]`).text()).toEqual(title);
  });

  it("Корректное отображение количества Link", () => {
    const componentFirst = renderMountComponent(title);

    expect(componentFirst.find(SettingsGroup).find(Link).length).toEqual(routes.length);
  });

  it("Тестирование локализации", () => {
    const component = renderMountComponent(title);

    expect(component.find(SettingsGroup).prop("title")).toEqual(
      testLocalization.getLocalized(MODULE)
    );
  });

  it("Тестирование содержимого to у Link", () => {
    const component = renderMountComponent(title);

    expect(component.find(SettingsGroup).find(Link).at(0).prop("to")).toEqual(path);
  });
});
