import { waitForComponentToPaint } from "../../../utils/tests/utils";
import { mount, type ReactWrapper } from "enzyme";
import { createForm } from "final-form";
import { SubmitFormButton } from "./SubmitFormButton";
import type { ISubmitFormButtonProps } from "./SubmitFormButton.types";
import type { IFormProvider } from "../../../decorators/contexts/FormContext";
import { Button } from "../../Button/Button";

const formName = "form";

const submit = jest.fn();
const onSubmit = jest.fn();

const getFormProvider = (isValid = true) =>
  ({
    ...createForm({
      onSubmit,
      validate: isValid ? undefined : () => ({ err: "Ошибка" }),
    }),
    submit,
  }) as IFormProvider<any>;

const getComponent = (formProvider = getFormProvider()) => {
  return mount(
    <SubmitFormButton
      caption="Сохранить"
      formName={formName}
      formProvider={formProvider}
      disabled={false}
    />
  );
};

const getComponentProps = (component: ReactWrapper<ISubmitFormButtonProps>) => {
  const getProps = () => component.find(Button).props() as unknown as ISubmitFormButtonProps;

  return {
    isDisabled: () => getProps().disabled,
  };
};

describe("Тест на SubmitFormButton", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();

    submit.mockReset();
    onSubmit.mockReset();
  });

  it("submit вызывается только один раз при попытке несколько раз кликнуть на SubmitFormButton", async () => {
    const component = getComponent();

    component.find("button").simulate("click");
    component.find("button").simulate("click");
    component.find("button").simulate("click");

    await waitForComponentToPaint(component, 105);

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("При клике устанавливается loading и disabled в true", async () => {
    const component = getComponent();

    const { isDisabled } = getComponentProps(component);

    expect(isDisabled()).toEqual(false);

    component.find("button").simulate("click");

    await waitForComponentToPaint(component);

    expect(isDisabled()).toEqual(true);
  });

  it("После таймаута кнопка разблокируется", async () => {
    const component = getComponent();

    component.find("button").simulate("click");

    const { isDisabled } = getComponentProps(component);

    expect(isDisabled()).toEqual(true);

    await waitForComponentToPaint<ISubmitFormButtonProps>(component, 110);

    expect(isDisabled()).toEqual(false);
  });

  it("После таймаута кнопка разблокируется и можно снова делать submit", async () => {
    const component = getComponent();

    component.find("button").simulate("click");
    await waitForComponentToPaint(component, 105);
    component.find("button").simulate("click");
    await waitForComponentToPaint(component);

    expect(submit).toHaveBeenCalledTimes(2);
  });

  it("Если в форме ошибка валидации, то submit происходит, disabled === true, а затем разблокируется", async () => {
    const formProvider = getFormProvider(false);

    const component = getComponent(formProvider);

    component.find("button").simulate("click");
    await waitForComponentToPaint(component);

    expect(submit).toHaveBeenCalledTimes(1);

    const { isDisabled } = getComponentProps(component);

    expect(isDisabled()).toEqual(true);

    await waitForComponentToPaint(component, 105);

    expect(isDisabled()).toEqual(false);
  });

  it("Если в форме возникла ошибка после мутации, то submit происходит", async () => {
    onSubmit.mockRejectedValue({ err: "error" });

    const component = getComponent();

    component.find("button").simulate("click");

    await waitForComponentToPaint(component);

    expect(submit).toHaveBeenCalledTimes(1);

    const { isDisabled } = getComponentProps(component);

    expect(isDisabled()).toEqual(true);

    // дожидаемся окончания сабмита
    await waitForComponentToPaint(component, 105);

    expect(isDisabled()).toEqual(false);

    // кликаем повторно, чтобы проверить что сабмит сработает
    component.find("button").simulate("click");

    await waitForComponentToPaint(component);
    expect(submit).toHaveBeenCalledTimes(2);

    expect(isDisabled()).toEqual(true);
  });
});
