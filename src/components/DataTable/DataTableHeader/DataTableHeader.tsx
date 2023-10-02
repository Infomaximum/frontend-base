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
  REVERSE_SEARCH: "reverse-search",
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
    isExpandedTopPanel,
  } = props;

  const localization = useLocalization();

  const headerButtonsObjects = headerButtonsGetter?.(treeCounter, editingState);

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
        isExpandedTopPanel={isExpandedTopPanel}
      />
    );
  }

  if (headerMode === headerModes.REVERSE_SEARCH) {
    return (
      <TopPanel
        key="top-panel"
        onInputChange={onSearchChange}
        selectedItemsCount={treeCounter ? treeCounter.totalCheckedCount : 0}
        onSelectedItemsClear={clearCheck}
        headerMode={headerModes.REVERSE_SEARCH}
        headerButtonsObjects={headerButtonsObjects}
        searchValue={searchValue}
        allowClear={allowClear}
        searchPlaceholder={searchPlaceholder}
        isExpandedTopPanel={isExpandedTopPanel}
      />
    );
  }

  return null;
};

const DataTableHeader = observer(DataTableHeaderComponent);

export { DataTableHeader, headerModes };
