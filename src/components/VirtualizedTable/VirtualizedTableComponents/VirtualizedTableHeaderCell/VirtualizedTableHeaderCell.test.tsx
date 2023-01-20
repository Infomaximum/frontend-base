import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import VirtualizedTableHeaderCell from "./VirtualizedTableHeaderCell";

it("Тест компонента VirtualizedTableHeaderCell", async () => {
  const user = userEvent.setup();
  const handleSorterChange = jest.fn();

  const { rerender } = render(
    <VirtualizedTableHeaderCell
      column={{
        dataIndex: "test",
        title: "VirtualizedTableHeaderCell",
        ellipsis: true,
        width: 50,
      }}
      columnsOrders={{}}
      isSorted={false}
      onSorterChange={handleSorterChange}
      sortOrder={"ascend"}
    />
  );

  expect(screen.queryByText(/VirtualizedTableHeaderCell/i)).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();

  rerender(
    <VirtualizedTableHeaderCell
      column={{
        dataIndex: "test",
        key: "test",
        title: "VirtualizedTableHeaderCell",
        ellipsis: true,
        sorter: true,
        width: 50,
      }}
      columnsOrders={{ test: ["ascend"] }}
      isSorted={true}
      onSorterChange={handleSorterChange}
      sortOrder={"ascend"}
    />
  );
  expect(screen.queryByRole("img")).toBeInTheDocument();
  let caret = screen.getByRole("img");
  expect(caret.getAttribute("aria-label")).toEqual("caret-up");

  await user.click(screen.getByText(/VirtualizedTableHeaderCell/i));
  expect(handleSorterChange).toHaveBeenCalled();

  rerender(
    <VirtualizedTableHeaderCell
      column={{
        dataIndex: "test",
        key: "test",
        title: "VirtualizedTableHeaderCell",
        ellipsis: true,
        sorter: true,
        width: 50,
      }}
      columnsOrders={{ test: ["descend"] }}
      isSorted={false}
      onSorterChange={handleSorterChange}
      sortOrder={"descend"}
    />
  );
  expect(screen.queryByRole("img")).toBeInTheDocument();
  caret = screen.getByRole("img");
  expect(caret.getAttribute("aria-label")).toEqual("caret-down");
});
