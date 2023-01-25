import * as enzyme from "enzyme";
import Search from "./Search";
import { inputSearchTestId } from "../../utils/TestIds";

const getFakeFunc = () => jest.fn();

const mountSearch = (mockFunction: jest.Mock<any, any>) => {
  return enzyme.mount(
    <Search
      key="input-search"
      placeholder="SEARCH"
      onChange={mockFunction}
      test-id={inputSearchTestId}
      value="initialValue"
      autoFocus={true}
    />
  );
};

describe("Search", () => {
  let mockFunction: jest.Mock<any, any>;

  beforeEach(() => {
    mockFunction = getFakeFunc();
  });

  afterEach(() => {
    mockFunction.mockReset();
  });

  it("Проверка на отображение компонента Search", () => {
    const component = mountSearch(mockFunction);

    expect(component.find(Search).exists()).toEqual(true);
  });

  it("Проверка свойств компонента Search", () => {
    const component = mountSearch(mockFunction);

    expect(component.find(Search).props().value).toEqual("initialValue");
    expect(component.find(Search).props().autoFocus).toEqual(true);
    expect(component.find(Search).props().placeholder).toEqual("SEARCH");
    expect(component.find(Search).props().onChange).toEqual(mockFunction);
  });

  it("Проверка изменения текста поля ввода и state Search, при изменении поля value", () => {
    const component = mountSearch(mockFunction);
    const newSearchValue = "newSearchValue";

    expect(component.find(Search).props().value).toEqual("initialValue");

    component.setProps({ value: newSearchValue });
    component.update();
    expect(component.find("input").props().value).toEqual(newSearchValue);
    expect(component.find(Search).state().searchText).toEqual(newSearchValue);
  });

  it("Проверка изменения текста поля ввода и state Search, при вводе значения в поля ввода", () => {
    const component = mountSearch(mockFunction);
    const newSearchValue = "newSearchValue";

    const inputComponent = component.find("input");
    inputComponent.simulate("change", { target: { value: newSearchValue } });

    component.update();
    expect(component.find("input").props().value).toEqual(newSearchValue);
    expect(component.find(Search).state().searchText).toEqual(newSearchValue);
  });
});
