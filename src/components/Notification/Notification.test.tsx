import { Localization } from "@infomaximum/localization";
import { Notification } from "./Notification";
import { ERROR, ERROR_404 } from "@infomaximum/base/src/utils/Localization/Localization";
import type { NCore } from "@infomaximum/base/src/libs/core";
import { render, screen } from "@testing-library/react";
import { notificationErrorTestId } from "@infomaximum/base/src/utils/TestIds";

const localization = new Localization({ language: Localization.Language.ru });

const testError: NCore.TError = {
  title: localization.getLocalized(ERROR),
  message: localization.getLocalized(ERROR_404),
  code: "validation-error",
};

const renderComponent = (error: NCore.TError) => {
  return render(<Notification error={error} />);
};

describe("Тест компонента Notification", () => {
  it("Тест отрисовки обертки Notification в соответствии с кодом ошибки", () => {
    renderComponent(testError);
    const notificationWrapper = screen.getByTestId(`${notificationErrorTestId}_${testError.code}`);
    expect(notificationWrapper).toBeInTheDocument();
  });

  it("Тест отрисовки компонента", () => {
    renderComponent(testError);
    const alertDiv = screen.getByRole("alert");
    expect(alertDiv).toBeInTheDocument();
  });

  it("Тест отрисовки передаваемой ошибки", () => {
    renderComponent(testError);
    const alertDiv = screen.getByRole("alert");

    const errorSpan = Array.from(alertDiv.querySelectorAll("span")).find(
      (span) =>
        span.textContent ===
        `${localization.getLocalized(ERROR)}${localization.getLocalized(ERROR_404)}`
    );

    expect(errorSpan).toBeInTheDocument();
  });

  it("Тест реакции на отсутствие code у error", () => {
    const localeError: NCore.TError = {
      title: localization.getLocalized(ERROR),
      message: localization.getLocalized(ERROR_404),
    };

    const { queryByTestId } = renderComponent(localeError);
    const notificationWrapper = queryByTestId(`${notificationErrorTestId}_${testError.code}`);
    expect(notificationWrapper).not.toBeInTheDocument();
  });
});
