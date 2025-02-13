import { mount } from "enzyme";
import type { IDatePickerFormFieldProps } from "./DatePickerField.types";
import { BrowserRouter } from "react-router-dom";
import { DatePickerFormField } from "./DatePickerField";
import { Form } from "../../forms/Form/FormWrapper";

const props = {
  name: "Fake_name",
};

const setUp = (props: IDatePickerFormFieldProps) =>
  mount(
    <BrowserRouter>
      <Form form={"fake-form-name"}>
        <DatePickerFormField {...props} />
      </Form>
    </BrowserRouter>
  );

describe("Тест компонента", () => {
  it("Проверка отображения", () => {
    const component = setUp(props);
    expect(component.find(DatePickerFormField).exists()).toEqual(true);
  });

  it("Поменяли тип пикера на 'quarter'", () => {
    const nextProps = {
      ...props,
      picker: "quarter" as any,
    };
    const component = setUp(nextProps);
    expect(component.find(`DatePicker[picker="${nextProps.picker}"]`).exists()).toEqual(true);
  });
  it("Проверка на отображение инпута с disabled, если readOnly=true", () => {
    const nextProps = {
      ...props,
      readOnly: true,
    };
    const component = setUp(nextProps);
    expect(component.find(`input[disabled=${nextProps.readOnly}]`).exists()).toEqual(true);
  });
  it("Проверка кастомного displayFormat", () => {
    const nextProps = {
      ...props,
      displayFormat: "hh:mm:ss DD.MM.YYYY",
    };
    const component = setUp(nextProps);
    expect(component.find(`DatePicker[format="${nextProps.displayFormat}"]`).exists()).toEqual(
      true
    );
  });

  it("Проверка если showTime === true то displayFormat === DD.MM.YYYY, HH:mm", () => {
    const nextProps = {
      ...props,
      showTime: true,
    };
    const component = setUp(nextProps);

    expect(component.find(`DatePicker[format="DD.MM.YYYY, HH:mm"]`).exists()).toEqual(true);
  });
});
