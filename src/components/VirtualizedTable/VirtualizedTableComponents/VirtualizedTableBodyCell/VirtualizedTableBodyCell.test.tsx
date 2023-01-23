import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import VirtualizedTableBodyCell from "./VirtualizedTableBodyCell";
import {
  tableArrowRightTestId,
  tableArrowUpTestId,
  tableExpanderTestId,
} from "src/utils/TestIds";

describe("Тест компонента VirtualizedTableBodyCell", () => {
  it("Простое отображение значения", async () => {
    const handleExpanderChange = jest.fn();

    const {} = render(
      <VirtualizedTableBodyCell
        enableRowClick={false}
        hasExpander={false}
        indentLeft={4}
        index={1}
        isTree={false}
        onExpanderChange={handleExpanderChange}
        record={{
          name: "test",
          key: "test",
          testColumn: "Test caption",
        }}
        column={{
          dataIndex: "testColumn",
          key: "test",
        }}
        isExpanded={false}
      />
    );

    expect(screen.queryByText("Test caption")).toBeInTheDocument();
  });

  it("Отображение подготовленного значениея", () => {
    const handleExpanderChange = jest.fn();

    const {} = render(
      <VirtualizedTableBodyCell
        enableRowClick={false}
        hasExpander={false}
        indentLeft={4}
        index={1}
        isTree={false}
        onExpanderChange={handleExpanderChange}
        record={{
          name: "test",
          key: "test",
          testColumn: "Test caption",
        }}
        column={{
          dataIndex: "testColumn",
          key: "test",
          render: (v) => `Подготовленное значение - ${v}`,
        }}
        isExpanded={false}
      />
    );

    expect(
      screen.queryByText("Подготовленное значение - Test caption")
    ).toBeInTheDocument();
  });

  it("Отображение кнопки расскрытия", async () => {
    const user = userEvent.setup();
    const handleExpanderChange = jest.fn();

    const { rerender } = render(
      <VirtualizedTableBodyCell
        enableRowClick={false}
        hasExpander={true}
        indentLeft={4}
        index={0}
        isTree={true}
        onExpanderChange={handleExpanderChange}
        record={{
          name: "test",
          key: "test",
          testColumn: "Test caption",
        }}
        column={{
          dataIndex: "testColumn",
          key: "test",
        }}
        isExpanded={false}
      />
    );
    expect(screen.queryByTestId(tableArrowRightTestId)).toBeInTheDocument();

    await user.click(screen.getByTestId(tableExpanderTestId));
    expect(handleExpanderChange).toHaveBeenCalled();

    rerender(
      <VirtualizedTableBodyCell
        enableRowClick={false}
        hasExpander={true}
        indentLeft={4}
        index={0}
        isTree={true}
        onExpanderChange={handleExpanderChange}
        record={{
          name: "test",
          key: "test",
          testColumn: "Test caption",
        }}
        column={{
          dataIndex: "testColumn",
          key: "test",
        }}
        isExpanded={true}
      />
    );

    expect(screen.queryByTestId(tableArrowUpTestId)).toBeInTheDocument();
  });
});
