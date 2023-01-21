import ConfirmPopover from "./ConfirmPopover";
import type { IConfirmPopoverProps } from "./ConfirmPopover.types";
import { mount } from "enzyme";
import { Localization } from "@im/utils";
import {
  confirmPopoverOkButtonTestId,
  confirmPopoverCancelButtonTestId,
} from "@im/base/src/utils/TestIds";
import Button from "@im/base/src/components/Button/Button";

describe("Тест компонента ConfirmPopover", () => {
  const showPopoverButtonTestId = "show-popover";
  const bodyText = "body text";

  const getMountedComponent = (extraProps: Partial<IConfirmPopoverProps> = {}) => {
    const props = {
      text: bodyText,
      loading: false,
      onSubmit: () => {},
      localization: new Localization({ language: Localization.Language.ru }),
      ...extraProps,
    };

    return mount(
      <ConfirmPopover {...props}>
        <Button test-id={showPopoverButtonTestId}>Show ConfirmPopover</Button>
      </ConfirmPopover>
    );
  };

  type TComponentWrapper = ReturnType<typeof getMountedComponent>;

  const checkPopoverVisible = (component: TComponentWrapper) =>
    component.find("Popover").find("Row").find("Col").exists();

  const getOkButton = (component: TComponentWrapper) =>
    component.find(`button[test-id="${confirmPopoverOkButtonTestId}"]`);

  const getCancelButton = (component: TComponentWrapper) =>
    component.find(`button[test-id="${confirmPopoverCancelButtonTestId}"]`);

  const getShowPopoverButton = (component: TComponentWrapper) =>
    component.find(`button[test-id="${showPopoverButtonTestId}"]`);

  it("Переданный текст для кнопок и тела компонента отображается корректно", () => {
    const okText = "ok";
    const cancelText = "cancel";

    const component = getMountedComponent({ okText, cancelText, visible: true });

    expect(getOkButton(component).text()).toBe(okText);
    expect(getCancelButton(component).text()).toBe(cancelText);
    expect(component.find("Popover").find("Row").find("Col").at(1).text()).toBe(bodyText);
  });

  it("Видимость компонента управляется пропом visible", () => {
    const component = getMountedComponent({ visible: false });

    expect(checkPopoverVisible(component)).toEqual(false);

    component.setProps({ visible: true }).update();

    expect(checkPopoverVisible(component)).toEqual(true);
  });

  it("При нажатии на кнопку подтверждения срабатывает переданный callback onSubmit", () => {
    const component = getMountedComponent({ visible: true, onSubmit: jest.fn() });

    getOkButton(component).simulate("click");

    expect(component.props().onSubmit).toHaveBeenCalled();
  });

  it(
    "При нажатии на кнопку отмены срабатывает переданный callback onVisibleChange" +
      " с аргументом false",
    () => {
      const component = getMountedComponent({ visible: true, onVisibleChange: jest.fn() });

      getCancelButton(component).simulate("click");

      expect(component.props().onVisibleChange).toHaveBeenCalledWith(false);
    }
  );

  it(
    "При нажатии за пределами поповера срабатывает переданный callback onVisibleChange" +
      " с аргументом false",
    () => {
      const component = getMountedComponent({ visible: true, onVisibleChange: jest.fn() });

      getShowPopoverButton(component).simulate("click");

      expect(component.props().onVisibleChange).toHaveBeenCalledWith(false);
    }
  );

  it(
    "При нажатии по ребенку поповера, если поповер скрыт, срабатывает переданный" +
      " callback onVisibleChange с аргументом true",
    () => {
      const component = getMountedComponent({ visible: false, onVisibleChange: jest.fn() });

      getShowPopoverButton(component).simulate("click");

      expect(component.props().onVisibleChange).toHaveBeenCalledWith(true);
    }
  );
});
