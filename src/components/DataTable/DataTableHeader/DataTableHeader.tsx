import { SEARCH } from "../../../utils/Localization/Localization";
import { headerMarginStyle } from "./DataTableHeader.styles";
import type { IDataTableHeaderProps } from "./DataTableHeader.types";
import { dataTableHeaderInputSearchTestId } from "../../../utils/TestIds";
import { observer } from "mobx-react";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { Search } from "../../Search/Search";
import { TopPanel } from "../../TopPanel";
import { topPanelModes } from "../../TopPanel/TopPanel";

const headerModes = {
  NONE: "none",
  SIMPLE_INPUT: "simple-input",
  ...topPanelModes,
} as const;

const DataTableHeaderComponent = <T,>(props: IDataTableHeaderProps<T>) => {
  const {
    headerMode,
    treeCounter,
    onSearchChange,
    clearCheck,
    headerButtonsGetter,
    editingState,
    searchValue,
    allowClear,
    searchPlaceholder,
  } = props;

  const localization = useLocalization();

  const buttonObjects = headerButtonsGetter?.(treeCounter, editingState);

  if (headerMode === headerModes.NONE) {
    return null;
  }

  if (headerMode === headerModes.SIMPLE_INPUT) {
    return (
      <div css={headerMarginStyle}>
        <Search
          key="input-search"
          placeholder={searchPlaceholder || localization.getLocalized(SEARCH)}
          onChange={onSearchChange}
          test-id={dataTableHeaderInputSearchTestId}
          value={searchValue}
          autoFocus={true}
          allowClear={allowClear}
        />
      </div>
    );
  }

  if (headerMode === headerModes.LIST) {
    return (
      <TopPanel
        key="top-panel"
        onInputChange={onSearchChange}
        onSelectedItemsClear={clearCheck}
        mode={topPanelModes.LIST}
        buttonObjects={buttonObjects}
        searchValue={searchValue}
        allowClear={allowClear}
        searchPlaceholder={searchPlaceholder}
      />
    );
  }

  if (headerMode === headerModes.WITHOUT_SEARCH) {
    return (
      <TopPanel
        key="top-panel"
        onSelectedItemsClear={clearCheck}
        mode={topPanelModes.WITHOUT_SEARCH}
        buttonObjects={buttonObjects}
        allowClear={allowClear}
      />
    );
  }

  return null;
};

const DataTableHeader = observer(DataTableHeaderComponent);

export { DataTableHeader, headerModes };
