import enzyme from "enzyme";
import { Localization } from "@im/utils";
import { VirtualizedTableHeaderRow } from "./VirtualizedTableHeaderRow";
import type { ColumnType, SortOrder } from "antd/lib/table/interface";
import { ERROR_MESSAGE } from "../../../../utils/Localization/Localization";
import type { TBaseRow, TExtendColumns } from "../../../../managers/Tree";

const localization = new Localization({ language: Localization.Language.ru });
const sorterChange = jest.fn();
const selectChange = jest.fn();

const renderComponent = (isLoading: boolean) => {
  const columns: ColumnType<Partial<TExtendColumns<TBaseRow>>>[] = [
    { title: localization.getLocalized(ERROR_MESSAGE), sorter: true },
  ];
  const columnsOrders: TDictionary<SortOrder[]> = {};

  return enzyme.mount(
    <VirtualizedTableHeaderRow
      isTableEmpty={false}
      isCheckable={true}
      isSelectionEmpty={false}
      sorter={{ order: true }}
      onSorterChange={sorterChange}
      onSelectChange={selectChange}
      targetAll={true}
      columns={columns}
      columnsOrders={columnsOrders}
      loading={isLoading}
      isShowDivider={true}
    />
  );
};

describe("Тест компонента VirtualizedTableHeaderRow", () => {
  it("Проверка отрисовки компонента VirtualizedTableHeaderRow", () => {
    expect(
      renderComponent(false).find("VirtualizedTableHeaderRow").length
    ).toEqual(1);
  });
  it("Проверка loading у компонента VirtualizedTableHeaderRow", () => {
    expect(renderComponent(true).prop("loading")).toEqual(true);
  });
  it("Проверка title columns у компонента VirtualizedTableHeaderRow", () => {
    expect(
      renderComponent(false).find("div[test-id='virtualized-table_div']").text()
    ).toEqual(localization.getLocalized(ERROR_MESSAGE));
  });
  it("Проверка onSelectChange у компонента VirtualizedTableHeaderRow", () => {
    renderComponent(false)
      .find("Checkbox")
      .first()
      .find("input[type='checkbox']")
      .simulate("change", { target: { value: "52" } });
    expect(selectChange).toBeCalled();
  });
  it("Проверка onSorterChange у компонента VirtualizedTableHeaderRow", () => {
    renderComponent(false)
      .find("div[test-id='virtualized-table_div']")
      .simulate("click");
    expect(sorterChange).toBeCalled();
  });
});
