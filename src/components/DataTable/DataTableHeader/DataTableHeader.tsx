import { TopPanel } from "../TopPanel/TopPanel";
import { SEARCH } from "../../../utils/Localization/Localization";
import { headerMarginStyle } from "./DataTableHeader.styles";
import type { IDataTableHeaderProps } from "./DataTableHeader.types";
import { dataTableHeaderInputSearchTestId } from "../../../utils/TestIds";
import { observer } from "mobx-react";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { Search } from "../../Search/Search";

const headerModes = {
  NONE: "none",
  SIMPLE_INPUT: "simple-input",
  LIST: "list",
  WITHOUT_SEARCH: "withoutsearch",
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

  const headerButtonsObjects = headerButtonsGetter?.(treeCounter, editingState);

  if (headerMode === headerModes.SIMPLE_INPUT) {
    return (
      <Search
        key="input-search"
        placeholder={searchPlaceholder || localization.getLocalized(SEARCH)}
        onChange={onSearchChange}
        test-id={dataTableHeaderInputSearchTestId}
        value={searchValue}
        css={headerMarginStyle}
        autoFocus={true}
        allowClear={allowClear}
      />
    );
  }

  if (headerMode === headerModes.LIST) {
    return (
      <TopPanel
        key="top-panel"
        onInputChange={onSearchChange}
        selectedItemsCount={treeCounter ? treeCounter.totalCheckedCount : 0}
        onSelectedItemsClear={clearCheck}
        headerMode={headerModes.LIST}
        headerButtonsObjects={headerButtonsObjects}
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
        selectedItemsCount={treeCounter ? treeCounter.totalCheckedCount : 0}
        onSelectedItemsClear={clearCheck}
        headerMode={headerModes.WITHOUT_SEARCH}
        headerButtonsObjects={headerButtonsObjects}
        allowClear={allowClear}
      />
    );
  }

  return null;
};

const DataTableHeader = observer(DataTableHeaderComponent);

export { DataTableHeader, headerModes };
