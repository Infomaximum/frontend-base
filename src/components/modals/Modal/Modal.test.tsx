import { mount } from "enzyme";
import { Modal } from "./Modal";
import { modalTitleTestId } from "../../../utils/TestIds";

describe("Тест компонента Modal", () => {
  it("Тестирование title компонента Modal", () => {
    const wrapper = mount(<Modal title="Modal" open={true} />);
    expect(wrapper.prop("title")).toEqual("Modal");
    expect(wrapper.find(`span[test-id="${modalTitleTestId}"]`).text()).toEqual("Modal");
  });
});
