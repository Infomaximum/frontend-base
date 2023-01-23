import * as enzyme from "enzyme";
import ContextMenu from "./ContextMenu";
import { Menu } from "antd";
import Button from "src/components/Button/Button";
import type { IContextMenuProps } from "./ContextMenu.types";
import MenuItem from "antd/lib/menu/MenuItem";

const getContextMenuItems = (mockFunction: jest.Mock<any, any>) => [
  {
    title: "create",
    clickHandler: mockFunction,
    "test-id": "create-test_id",
  },
  {
    title: "remove",
    clickHandler: mockFunction,
    "test-id": "remove-test_id",
  },
];

const getFakeFunc = () => jest.fn();

const mountContextMenu = (props: IContextMenuProps) => {
  return enzyme.mount(
    <ContextMenu {...props}>
      <Button>Show ContextMenu</Button>
    </ContextMenu>
  );
};

describe("Тест компонента ContextMenu", () => {
  let mockFunction: jest.Mock<any, any>;

  beforeEach(() => {
    mockFunction = getFakeFunc();
  });

  afterEach(() => {
    mockFunction.mockReset();
  });

  it("Наличие ContextMenu c кнопкой внутри", () => {
    const props = {
      key: "context-menu",
      content: getContextMenuItems(mockFunction),
    };

    const component = mountContextMenu(props);

    expect(component.find(ContextMenu).find(Button).exists()).toEqual(true);
  });

  it("Наличие и отсутствие пунктов контекстного меню после и до клика", () => {
    const props = {
      key: "context-menu",
      content: getContextMenuItems(mockFunction),
    };

    const component = mountContextMenu(props);

    expect(component.find(Menu).exists()).toEqual(false);

    expect(component.find(Menu).find(MenuItem).length === 0).toEqual(true);

    component.find(ContextMenu).find(Button).simulate("click");

    expect(component.find(Menu).exists()).toEqual(true);

    expect(component.find(Menu).find(MenuItem).length > 0).toEqual(true);
  });

  it("Проверка на срабатывание клика по пункту Контекстного меню", () => {
    const props = {
      key: "context-menu",
      content: getContextMenuItems(mockFunction),
    };

    const component = mountContextMenu(props);

    component.find(ContextMenu).find(Button).simulate("click");

    expect(mockFunction.mock.calls.length).toEqual(0);

    component.find(Menu).find(MenuItem).first().simulate("click");

    expect(mockFunction.mock.calls.length).toEqual(1);
  });
});
