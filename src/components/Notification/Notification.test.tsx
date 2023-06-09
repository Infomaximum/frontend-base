import { Localization } from "@infomaximum/localization";
import enzyme from "enzyme";
import { Notification } from "./Notification";
import type { NCore } from "@infomaximum/module-expander";
import { ERROR, ERROR_404 } from "../../utils/Localization/Localization";

const localization = new Localization({ language: Localization.Language.ru });

const testError: NCore.TError = {
  title: localization.getLocalized(ERROR),
  message: localization.getLocalized(ERROR_404),
  code: "validation_error",
};

const renderComponent = (error: NCore.TError) => {
  return enzyme.mount(<Notification error={error} />);
};

describe("Тест компонента Notification", () => {
  it("Тест отрисовки компонента", () => {
    expect(renderComponent(testError).find("Alert").length).toEqual(1);
  });

  it("Тест отрисовки передаваемого title", () => {
    expect(renderComponent(testError).find("div[className='ant-alert-message']").text()).toEqual(
      localization.getLocalized(ERROR)
    );
  });

  it("Тест отрисовки передаваемого description", () => {
    expect(
      renderComponent(testError).find("div[className='ant-alert-description']").text()
    ).toEqual(localization.getLocalized(ERROR_404));
  });

  it("Тест реакции на отсутствие code у error", () => {
    const localeError: NCore.TError = {
      title: localization.getLocalized(ERROR),
      message: localization.getLocalized(ERROR_404),
    };
    expect(
      renderComponent(localeError).find("div[test-id='notification-error_validation-error']").length
    ).toEqual(0);
  });
});
