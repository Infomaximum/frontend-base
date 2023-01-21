import React from "react";
import { render, screen, getByText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";
import "@testing-library/jest-dom";
import type { ISelectProps } from "./Select.types";
import { mapChildrenToOptions } from "./Select.utils";
import Tooltip from "@im/base/src/components/Tooltip/Tooltip";
import { textWrapperStyle } from "./Select.styles";

enum EElement {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

const elementDisplayValue = {
  [EElement.FIRST]: "Первое значение",
  [EElement.SECOND]: "Второе значение",
  [EElement.THIRD]: "Третье значение",
};

const renderSelect = (props: ISelectProps) => {
  return (
    <Select {...props}>
      <Select.Option value={EElement.FIRST}>{elementDisplayValue[EElement.FIRST]}</Select.Option>
      <Select.Option value={EElement.SECOND}>{elementDisplayValue[EElement.SECOND]}</Select.Option>
      <Select.Option value={EElement.THIRD}>{elementDisplayValue[EElement.THIRD]}</Select.Option>
    </Select>
  );
};

const clientRect = (size: number) => ({
  width: size,
  height: size,
  top: size,
  left: 0,
  bottom: size,
  right: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn,
});

const simulateBoundingClientRect = (size: number) => {
  const getBoundingClientRectSpy = jest.fn(() => clientRect(size));
  Element.prototype.getBoundingClientRect = getBoundingClientRectSpy;
};

describe("Тест компонента Select", () => {
  beforeAll(() => {
    simulateBoundingClientRect(220);
  });

  it("Рендер компонента с элементами", async () => {
    const user = userEvent.setup();
    const clickFn = jest.fn();

    const { getByRole } = render(renderSelect({ onClick: clickFn }));
    const target = getByRole("combobox");
    expect(target).not.toBeNull();

    await user.click(target);
    expect(clickFn).toHaveBeenCalled();
    getByRole("listbox");

    expect(screen.getByText(elementDisplayValue[EElement.FIRST])).toBeInTheDocument();
    expect(screen.getByText(elementDisplayValue[EElement.SECOND])).toBeInTheDocument();
    expect(screen.getByText(elementDisplayValue[EElement.THIRD])).toBeInTheDocument();
  });

  it("Рендер пустого", async () => {
    const user = userEvent.setup();
    const clickFn = jest.fn();

    const { getByRole, rerender } = render(<Select onClick={clickFn} />);
    const target = getByRole("combobox");
    expect(target).not.toBeNull();

    await user.click(target);

    expect(clickFn).toHaveBeenCalled();
    expect(screen.getByText(/no data/i)).toBeInTheDocument();

    rerender(<Select onClick={clickFn} notFoundContent="Нет данных" />);
    expect(screen.getByText(/нет данных/i)).toBeInTheDocument();
  });

  xit("Выбор второго элемента", async () => {
    const user = userEvent.setup();
    const handleClickFn = jest.fn();

    const { getByRole, baseElement } = render(renderSelect({ onClick: handleClickFn }));
    const target = getByRole("combobox");
    expect(target).not.toBeNull();

    await user.click(target);
    expect(handleClickFn).toHaveBeenCalled();

    const options = baseElement.querySelectorAll(".ant-select-item");
    expect(options.length).toBe(3);

    await userEvent.click(screen.getByText(elementDisplayValue[EElement.SECOND]), {
      pointerEventsCheck: 0,
    });

    const selected = baseElement.querySelectorAll<HTMLSpanElement>(
      ".ant-select-selection-item"
    )?.[0];

    expect(selected).not.toBeUndefined();
    expect(selected).not.toBeNull();

    if (selected) {
      expect(getByText(selected, elementDisplayValue[EElement.SECOND])).toBeInTheDocument();
    }
  });

  it("Тестирование отрисовки элементов при небольшом размере контейнера", async () => {
    const user = userEvent.setup();
    const clickFn = jest.fn();
    simulateBoundingClientRect(44);
    const { rerender } = render(renderSelect({ onClick: clickFn, listItemHeight: 48 }));
    const target = screen.getByRole("combobox");
    expect(target).not.toBeNull();

    await user.click(target);
    expect(clickFn).toHaveBeenCalled();

    expect(screen.getByText(elementDisplayValue[EElement.FIRST])).toBeInTheDocument();
    expect(screen.getByText(elementDisplayValue[EElement.SECOND])).toBeInTheDocument();
    expect(screen.queryByText(elementDisplayValue[EElement.THIRD])).not.toBeInTheDocument();

    simulateBoundingClientRect(400);
    rerender(renderSelect({ onClick: clickFn }));

    expect(screen.getByText(elementDisplayValue[EElement.FIRST])).toBeInTheDocument();
    expect(screen.getByText(elementDisplayValue[EElement.SECOND])).toBeInTheDocument();
    expect(screen.getByText(elementDisplayValue[EElement.THIRD])).toBeInTheDocument();
  });
});

describe("Тестирование утилитных функций", () => {
  it("Тестирование mapChildrenToOptions с плоским списком строк, без test-id", () => {
    const testElementList = [
      <Select.Option key={1} value={"1v"}>
        1
      </Select.Option>,
      <Select.Option key={2} value={"2v"}>
        2
      </Select.Option>,
      <Select.Option key={3} value={"3v"}>
        3
      </Select.Option>,
    ];

    const mappingResult = mapChildrenToOptions(testElementList);
    const expectedResult = [
      { key: "1", value: "1v", label: <Tooltip title="1">1</Tooltip> },
      { key: "2", value: "2v", label: <Tooltip title="2">2</Tooltip> },
      { key: "3", value: "3v", label: <Tooltip title="3">3</Tooltip> },
    ];
    expect(mappingResult).toEqual(expectedResult);
  });
  it("Тестирование mapChildrenToOptions с плоским списком строк, с test-id", () => {
    const testElementList = [
      <Select.Option key={1} value={"1v"} test-id={"1-test-id"}>
        1
      </Select.Option>,
      <Select.Option key={2} value={"2v"} test-id={"2-test-id"}>
        2
      </Select.Option>,
      <Select.Option key={3} value={"3v"} test-id={"3-test-id"}>
        3
      </Select.Option>,
    ];

    const mappingResult = mapChildrenToOptions(testElementList);
    const expectedResult = [
      {
        key: "1",
        value: "1v",
        ["test-id"]: "1-test-id",
        label: (
          <Tooltip title="1">
            <span style={textWrapperStyle} test-id={"1-test-id"}>
              1
            </span>
          </Tooltip>
        ),
      },
      {
        key: "2",
        value: "2v",
        label: (
          <Tooltip title="2">
            <span style={textWrapperStyle} test-id={"2-test-id"}>
              2
            </span>
          </Tooltip>
        ),
        ["test-id"]: "2-test-id",
      },
      {
        key: "3",
        value: "3v",
        ["test-id"]: "3-test-id",
        label: (
          <Tooltip title="3">
            <span style={textWrapperStyle} test-id={"3-test-id"}>
              3
            </span>
          </Tooltip>
        ),
      },
    ];
    expect(mappingResult).toEqual(expectedResult);
  });
  it("Тестирование mapChildrenToOptions с группированным списком строк, с test-id", () => {
    const testElementList = [
      <Select.OptGroup key={"1-group"} label={"1 group"}>
        <Select.Option key={"1-1"} value={"1-1v"} test-id={"1-1-test-id"}>
          1-1
        </Select.Option>
        <Select.Option key={"1-2"} value={"1-2v"} test-id={"1-2-test-id"}>
          1-2
        </Select.Option>
      </Select.OptGroup>,
      <Select.OptGroup key={"2-group"} label={"2 group"}>
        <Select.Option key={"2-1"} value={"2-1v"} test-id={"2-1-test-id"}>
          2-1
        </Select.Option>
        <Select.Option key={"2-2"} value={"2-2v"} test-id={"2-2-test-id"}>
          2-2
        </Select.Option>
      </Select.OptGroup>,
    ];

    const mappingResult = mapChildrenToOptions(testElementList);
    const expectedResult = [
      {
        label: "1 group",
        options: [
          {
            key: "1-1",
            value: "1-1v",
            ["test-id"]: "1-1-test-id",
            label: (
              <Tooltip title="1-1">
                <span style={textWrapperStyle} test-id={"1-1-test-id"}>
                  1-1
                </span>
              </Tooltip>
            ),
          },
          {
            key: "1-2",
            value: "1-2v",
            label: (
              <Tooltip title="1-2">
                <span style={textWrapperStyle} test-id={"1-2-test-id"}>
                  1-2
                </span>
              </Tooltip>
            ),
            ["test-id"]: "1-2-test-id",
          },
        ],
      },
      {
        label: "2 group",
        options: [
          {
            key: "2-1",
            value: "2-1v",
            ["test-id"]: "2-1-test-id",
            label: (
              <Tooltip title="2-1">
                <span style={textWrapperStyle} test-id={"2-1-test-id"}>
                  2-1
                </span>
              </Tooltip>
            ),
          },
          {
            key: "2-2",
            value: "2-2v",
            label: (
              <Tooltip title="2-2">
                <span style={textWrapperStyle} test-id={"2-2-test-id"}>
                  2-2
                </span>
              </Tooltip>
            ),
            ["test-id"]: "2-2-test-id",
          },
        ],
      },
    ];

    expect(mappingResult).toEqual(expectedResult);
  });
});
