import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
import { ConfirmationModal } from "./ConfirmationModal";
import { Localization } from "@im/localization";
import { ModalAnimationInterval } from "../../../utils/const";
import {
  confirmationModalAdditionalButtonTestId,
  confirmationModalCancelButtonTestId,
  confirmationModalConfirmButtonTestId,
} from "../../../utils/TestIds";

describe("Тест компонента ConfirmationModal", () => {
  const props = {
    onAfterCancel: jest.fn(),
    confirmButtonLoading: false,
    title: "Тест",
    localization: new Localization({ language: Localization.Language.ru }),
    onConfirm: jest.fn(
      () =>
        new Promise<void>((res) => {
          res();
        })
    ),
  };

  const getTestComponent = () => mount(<ConfirmationModal {...props} />);
  const getModal = (component: ReactWrapper) => component.find("Modal").first();
  const getButton = (component: ReactWrapper, testId: string) =>
    component.find(`button[test-id="${testId}"]`);

  // TODO: тест не работает (jest не выполняет then после вызова "onConfirm" в методе "handleConfirm")
  xit("Тест кнопки 'ConfirmButton'", (done) => {
    const component = getTestComponent();
    component.setProps({ afterConfirm: jest.fn() });

    expect(getModal(component).prop("visible")).toEqual(true);

    getButton(component, confirmationModalConfirmButtonTestId).simulate("click");

    expect(component.props().onConfirm).toHaveBeenCalled();
    expect(getModal(component).prop("visible")).toEqual(false);

    setTimeout(() => {
      expect(component.props().afterConfirm).toHaveBeenCalled();
      done();
    }, ModalAnimationInterval);
  });

  xit("Тест кнопки 'CancelButton'", (done) => {
    const component = getTestComponent();
    expect(getModal(component).prop("visible")).toEqual(true);

    getButton(component, confirmationModalCancelButtonTestId).simulate("click");

    expect(getModal(component).prop("visible")).toEqual(false);

    setTimeout(() => {
      expect(component.props().afterCancel).toHaveBeenCalled();
      done();
    }, ModalAnimationInterval);
  });

  xit("Тест дополнительной кнопки", () => {
    const component = getTestComponent();
    component.setProps({
      withAdditionalButton: true,
      onAdditionalButtonClick: jest.fn(),
    });

    getButton(component, confirmationModalAdditionalButtonTestId).simulate("click");
    expect(component.props().onAdditionalButtonClick).toHaveBeenCalled();
    expect(getModal(component).prop("visible")).toEqual(true);
  });
});
