import enzyme from "enzyme";
import { Localization } from "@infomaximum/localization";
import { VirtualizedTableHeaderRow } from "./VirtualizedTableHeaderRow";
import type { SortOrder } from "antd/lib/table/interface";
import { ERROR } from "../../../../utils/Localization/Localization";
import type { TBaseRow, TExtendColumns } from "../../../../managers/Tree";
import type { IVirtualizedColumnConfig } from "../../VirtualizedTable.types";

const localization = new Localization({ language: Localization.Language.ru });
const sorterChange = jest.fn();
const selectChange = jest.fn();

const renderComponent = (isLoading: boolean) => {
  const columns: IVirtualizedColumnConfig<Partial<TExtendColumns<TBaseRow>>>[] = [
    { title: localization.getLocalized(ERROR), sorter: true },
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
      hideSelectAll={false}
    />
  );
};

describe("Тест компонента VirtualizedTableHeaderRow", () => {
  it("Проверка отрисовки компонента VirtualizedTableHeaderRow", () => {
    expect(renderComponent(false).find(VirtualizedTableHeaderRow).length).toEqual(1);
  });
  it("Проверка loading у компонента VirtualizedTableHeaderRow", () => {
    expect(renderComponent(true).prop("loading")).toEqual(true);
  });
  it("Проверка title columns у компонента VirtualizedTableHeaderRow", () => {
    expect(renderComponent(false).find("div[test-id='virtualized-table_div']").text()).toEqual(
      localization.getLocalized(ERROR)
    );
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
    renderComponent(false).find("div[test-id='virtualized-table_div']").simulate("click");
    expect(sorterChange).toBeCalled();
  });
});
