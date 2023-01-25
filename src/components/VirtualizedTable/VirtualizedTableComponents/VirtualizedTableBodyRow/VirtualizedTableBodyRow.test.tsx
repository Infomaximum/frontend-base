import enzyme from "enzyme";
import { Localization } from "@im/utils";
import { VirtualizedTableBodyRow } from "./VirtualizedTableBodyRow";
import type { ColumnType } from "antd/lib/table";
import { ERROR_MESSAGE } from "../../../../utils/Localization/Localization";
import { tableExpanderTestId } from "../../../../utils/TestIds";
import type { TBaseRow, TExtendColumns } from "../../../../managers/Tree";

const localization = new Localization({ language: Localization.Language.ru });

const columns: ColumnType<Partial<TExtendColumns<TBaseRow>>>[] = [
  {
    dataIndex: "first",
    width: 420,
    render: () => {
      return (
        <div>
          <h6>{localization.getLocalized(ERROR_MESSAGE)}</h6>
        </div>
      );
    },
  },
];

const record: Partial<TExtendColumns<TBaseRow>> = {
  key: "test-records",
  name: "test-record",
};

const onSelectChange = jest.fn();
const onRowExpanderChange = jest.fn();

const renderComponent = (loading: boolean) => {
  return enzyme.mount(
    <VirtualizedTableBodyRow
      columns={columns}
      record={record}
      loading={loading}
      isCheckable={true}
      isChecked={false}
      onSelectChange={onSelectChange}
      selectionType={"checkbox"}
      indentLeft={20}
      hasExpander={true}
      isExpanded={true}
      isTree={true}
      onExpanderChange={onRowExpanderChange}
      key={"test-key"}
      isShowDivider={true}
    />
  );
};

describe("Тест компонента VirtualizedTableBodyRow", () => {
  it("Проверка отрисовки компонента VirtualizedTableBodyRow", () => {
    expect(
      renderComponent(false).find("VirtualizedTableBodyRow").length
    ).toEqual(1);
  });

  it("Проверка состояния loading", () => {
    expect(
      renderComponent(true).find("div[test-id='tableRow-test_loading']").length
    ).toEqual(1);
  });

  it("Проверка onSelectChange ", () => {
    renderComponent(false)
      .find("Checkbox[test-id='tableRow-test_checkbox']")
      .first()
      .find("input")
      .simulate("change", {
        target: { value: "test VirtualizedTableBodyRow" },
      });
    expect(onSelectChange).toHaveBeenCalled();
  });

  it("Проверка onRowExpanderChange", () => {
    renderComponent(false)
      .find(`button[test-id='${tableExpanderTestId}']`)
      .simulate("click");
    expect(onRowExpanderChange).toHaveBeenCalled();
  });

  it("Проверка отрисовки передаваемых компонентов", () => {
    expect(renderComponent(false).find("h6").text()).toEqual(
      localization.getLocalized(ERROR_MESSAGE)
    );
  });
});
