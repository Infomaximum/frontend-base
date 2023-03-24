import enzyme from "enzyme";
import { HeaderMenuPortal } from "./HeaderMenuPortal";
import { HeaderMenu } from "../HeaderMenu";
import { ERROR_404, LOG_OUT } from "../../../utils/Localization/Localization";
import { BrowserRouter } from "react-router-dom";
import { createRef } from "react";
import { HeaderMenuContext } from "../../../decorators/contexts/HeaderMenuContext";
import { Localization } from "@infomaximum/localization";

const noop = () => {};

const localization = new Localization({ language: Localization.Language.ru });

const renderComponent = () => {
  const headerRef = createRef<HTMLDivElement>();

  return enzyme
    .shallow(
      <BrowserRouter>
        <HeaderMenu ref={headerRef} userId={1} userName="test" onLogout={noop} />
        <HeaderMenuContext.Provider value={headerRef?.current}>
          <HeaderMenuPortal key="test_headerMenu">
            <HeaderMenuPortal.Title key="header-menu-title">
              {localization.getLocalized(ERROR_404)}
            </HeaderMenuPortal.Title>
            <HeaderMenuPortal.Body key="header-menu-body" align="right">
              {localization.getLocalized(LOG_OUT)}
            </HeaderMenuPortal.Body>
          </HeaderMenuPortal>
        </HeaderMenuContext.Provider>
      </BrowserRouter>
    )
    .dive();
};

// todo: Пименов Виктор: проверить правильность работы теста
describe("Тесты для HeaderMenuPortal", () => {
  it("Тест отрисовки HeaderMenuPortal", () => {
    expect(renderComponent().find(HeaderMenuPortal).length).toEqual(1);
  });
  it("Тест отрисовки HeaderMenuPortal.Title", () => {
    expect(renderComponent().find(HeaderMenuPortal.Title).length).toEqual(1);
  });
  it("Тест отрисовки HeaderMenuPortal.Body", () => {
    expect(renderComponent().find(HeaderMenuPortal.Body).length).toEqual(1);
  });
  it("Тест получения значения HeaderMenuPortal.Title", () => {
    expect(renderComponent().find(HeaderMenuPortal.Title).prop("children")).toEqual(
      localization.getLocalized(ERROR_404)
    );
  });
  it("Тест получения значения HeaderMenuPortal.Body", () => {
    expect(renderComponent().find(HeaderMenuPortal.Body).prop("children")).toEqual(
      localization.getLocalized(LOG_OUT)
    );
  });
});
