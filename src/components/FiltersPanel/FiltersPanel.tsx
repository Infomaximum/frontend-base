import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { isFunction, reverse, isUndefined, keyBy, isNil, size } from "lodash";
import { type BaseFilter, CLEAR_FILTER, removeFiltersButtonTestId } from "../../utils";
import type {
  TFilterClassByTypenameCache,
  IFiltersPanelProps,
  IFiltersPanelContext,
} from "./FiltersPanel.types";
import FilterItem from "../FilterList/FilterItem/FilterItem";
import FilterList from "../FilterList/FilterList/FilterList";
import { Divider } from "antd";
import {
  addTopPanelFilterButtonStyle,
  getButtonRemoveFilterStyle,
  wrapperPanelStyle,
} from "./FiltersPanel.styles";
import { DropdownAddFilter } from "./Dropdowns/DropdownAddFilter/DropdownAddFilter";
import { observer } from "mobx-react";
import { dividerVerticalStyle } from "../FilterList/FilterList/FilterList.styles";
import { InlineFilterTags } from "./InlineFilterTags/InlineFilterTags";
import { useLocalization, useMountEffect, useUrlFilters } from "../../decorators";
import type { NFiltersStore } from "../../utils/Store/FiltersStore/FiltersStore.types";
import type { IPositionConfig } from "../../utils/filters/BaseFilter/BaseFilter.types";
import { RemoveFiltersSVG } from "../../resources";
import { EFilteringMethods } from "@infomaximum/base-filter";
import { ErrorBoundary } from "../ErrorBoundary";
import { Tooltip } from "../Tooltip";
import { Button } from "../Button";
import { TopPanelPortal } from "../TopPanel";

export const filtersPanelContextDefaultValue: IFiltersPanelContext = {
  showFilterAddComponent: () => {},
  showFilterEditComponent: () => {},
};

export const FiltersPanelContext = React.createContext<IFiltersPanelContext>(
  filtersPanelContextDefaultValue
);

const tooltipAlign = { targetOffset: [0, 2] };

const FiltersPanelComponent: React.FC<IFiltersPanelProps> = ({
  filterStore,
  filterDescriptions: filterDescriptionsProp,
  filtersPanelProviderGetter,
  isVisibleAddFilterButton = true,
  addingDropdown,
  isHeaderFilter = true,
}) => {
  /**
   * Механизм сохранения фильтров в адресной строке
   */
  useUrlFilters(filterStore);
  const { setFilterDescriptions, resetFilterByName, filters, filterDescriptions } = filterStore;

  const localization = useLocalization();
  /**
   * Описание фильтра, используемого в компоненте добавления или редактирования
   */
  const [filterDescription, setFilterDescription] = useState<NFiltersStore.TFilterDescription>();

  /**
   * Имя редактируемого фильтра
   */
  const [filterName, setFilterName] = useState<NFiltersStore.TFilterName>();

  /**
   * initialValues для компонента добавления или редактирования. Можно передать,
   * когда нужно отрендерить компонент фильтра через контекст
   */
  const [initialFilterValue, setInitialFilterValue] = useState<NFiltersStore.TFilterValue>();
  const [initialPosition, setInitialPosition] = useState<TNullable<IPositionConfig>>();

  /**
   * Отображается ли компонент добавления фильтра
   */
  const [showAddFilterComponent, setShowAddFilterComponent] = useState<boolean>(false);

  /**
   * Отображается ли компонент редактирования фильтра
   */
  const [showEditFilterComponent, setShowEditFilterComponent] = useState<boolean>(false);

  /**
   * Индекс удаляемого фильтра
   */
  const [removeFilterIndex, setRemoveFilterIndex] = useState<number>();

  /** Кэш классов-описаний фильтров по typename */
  const [filterClassByTypenameCache, setFilterClassByTypenameCache] =
    useState<TFilterClassByTypenameCache>();

  const afterConfirmCallbackRef = useRef<() => void>();

  useLayoutEffect(() => {
    if (filterDescriptionsProp) {
      setFilterDescriptions(filterDescriptionsProp);
    }
  }, [filterDescriptionsProp, setFilterDescriptions]);

  useMountEffect(() => {
    if (isFunction(filtersPanelProviderGetter)) {
      filtersPanelProviderGetter({
        showFilterAddComponent,
        showFilterEditComponent,
      });
    }
  });

  useEffect(() => {
    setFilterClassByTypenameCache(
      keyBy(filterDescriptions, (filterDescription) => filterDescription.getTypename())
    );
  }, [filterDescriptions]);

  const isDisabledByOpenFilter = showAddFilterComponent || showEditFilterComponent;

  /**
   * Обработчик клика на элемент списка добавления фильтра
   * @param filterDescription
   */
  const handleAddFilterClick = useCallback((filterDescription: BaseFilter) => {
    setFilterDescription(filterDescription);
    setShowAddFilterComponent(true);
    setInitialFilterValue(null);
    setInitialPosition(null);
  }, []);

  /**
   * Обработчик клика на элемент списка добавленных фильтров
   * @param filterDescription - описание фильтра
   * @param filterName - имя фильтра
   */
  const handleEditFilterClick = useCallback(
    (filterDescription: BaseFilter, filterName: NFiltersStore.TFilterName) => {
      setFilterDescription(filterDescription);
      setFilterName(filterName);
      setShowEditFilterComponent(true);

      let filterValue: TNullable<NFiltersStore.TFilterValue>;
      filters.forEach((filter, innerFilterName) => {
        if (innerFilterName === filterName) {
          filterValue = filter.value;

          return false;
        }
      });

      setInitialFilterValue(filterValue);
    },
    [filters]
  );

  /**
   * Обработчик удаления, ранее добавленного фильтра
   * @param filterName - имя фильтра
   * @param index - индекс фильтра
   */
  const handleRemoveFilterClick = useCallback(
    (filterName: NFiltersStore.TFilterName, index: number) => {
      resetFilterByName(filterName);
      setRemoveFilterIndex(index);
    },
    [resetFilterByName]
  );

  /**
   * Обработчик закрытия компонента добавления фильтра
   */
  const handleAddComponentClose = useCallback(() => {
    setFilterDescription(undefined);
    setShowAddFilterComponent(false);
  }, []);

  /**
   * Обработчик закрытия компонента редактирования фильтра
   */
  const handleEditComponentClose = useCallback(() => {
    setFilterDescription(undefined);
    setShowEditFilterComponent(false);
  }, []);

  /**
   * Обработчик удаления всех фильтров
   */
  const handleRemoveFilters = useCallback(() => {
    filterStore.resetAllFilters();
  }, [filterStore]);

  const showFilterAddComponent = useCallback(
    (
      filterDescription: BaseFilter,
      filterValue: NFiltersStore.TFilterValue,
      afterConfirmCallback: () => void,
      config: IPositionConfig
    ) => {
      setShowAddFilterComponent(true);
      setFilterDescription(filterDescription);
      setInitialFilterValue(filterValue);
      setInitialPosition(config);

      if (isFunction(afterConfirmCallback)) {
        afterConfirmCallbackRef.current = afterConfirmCallback;
      }
    },
    []
  );

  const showFilterEditComponent = useCallback(
    (
      filterDescription: BaseFilter,
      filterValue: NFiltersStore.TFilterValue,
      filterName: NFiltersStore.TFilterName,
      afterConfirmCallback: () => void
    ) => {
      setFilterDescription(filterDescription);
      setFilterName(filterName);
      setShowEditFilterComponent(true);

      if (isFunction(afterConfirmCallback)) {
        afterConfirmCallbackRef.current = afterConfirmCallback;
      }
    },
    []
  );

  /**
   * Обработчик успешного сохранения компонента фильтров
   */
  const handleSaveModalSuccess = useCallback(() => {
    if (afterConfirmCallbackRef.current) {
      afterConfirmCallbackRef.current();
      afterConfirmCallbackRef.current = undefined;
    }
  }, []);

  /**
   * Список добавленных фильтров
   */
  const getAddedFilters = () => {
    const filterItems: ReactElement[] = [];
    let index = 0;

    if (filterClassByTypenameCache) {
      filters.forEach((filter, filterName) => {
        if (!isUndefined(filter)) {
          const filterDescription = filterClassByTypenameCache[filter.typename];

          if (!isNil(filterDescription)) {
            index += 1;
            const filterValue = filter.value;
            filterItems.push(
              <ErrorBoundary key={filterName} code="filter_item">
                <FilterItem
                  key={filterName}
                  index={index}
                  caption={filterDescription?.getCaption(localization, filterValue)}
                  onClick={handleEditFilterClick}
                  filterName={filterName}
                  filterDescription={filterDescription}
                  onRemoveClick={handleRemoveFilterClick}
                  disabled={isDisabledByOpenFilter}
                  isHeaderFilter={isHeaderFilter}
                >
                  {filterDescription?.getFilterSpoilerContent(filterValue, localization)}
                </FilterItem>
              </ErrorBoundary>
            );
          }
        }
      });
    }

    return reverse(filterItems);
  };

  const addedFilters = getAddedFilters();

  const AddFilterComponent = useMemo(
    () => filterDescription?.getAddFilterComponent(),
    [filterDescription]
  );

  /**
   * Геттер компонента добавления фильтра
   */
  const getAddFilterComponent = () => {
    if (!filterDescription || !AddFilterComponent) {
      return null;
    }

    return (
      <AddFilterComponent
        key="add-filter-component"
        mode={EFilteringMethods.adding}
        filterDescription={filterDescription}
        onCancel={handleAddComponentClose}
        filtersStore={filterStore}
        onSaveSuccess={handleSaveModalSuccess}
        filterValue={initialFilterValue}
        open={showAddFilterComponent}
        positionConfig={initialPosition}
      />
    );
  };

  const EditFilterComponent = useMemo(
    () => filterDescription?.getEditFilterComponent(initialFilterValue),
    [filterDescription, initialFilterValue]
  );

  /**
   * Геттер компонента редактирования фильтра
   */
  const getEditFilterComponent = () => {
    if (!filterDescription || !filterName || !EditFilterComponent) {
      return null;
    }

    return (
      <EditFilterComponent
        key="edit-filter-component"
        mode={EFilteringMethods.editing}
        filterDescription={filterDescription}
        open={showEditFilterComponent}
        onCancel={handleEditComponentClose}
        filtersStore={filterStore}
        filterName={filterName}
      />
    );
  };

  if (size(filterDescriptions) === 0) {
    return null;
  }

  return (
    <div key="wrapper_filter-panel" css={wrapperPanelStyle}>
      {isHeaderFilter ? (
        <>
          {isVisibleAddFilterButton && (
            <>
              <Divider css={dividerVerticalStyle} type="vertical" />
              {addingDropdown ? (
                addingDropdown
              ) : (
                <DropdownAddFilter
                  filterDescriptions={filterDescriptions}
                  onFilterClick={handleAddFilterClick}
                  disabled={isDisabledByOpenFilter}
                />
              )}
              <Divider css={dividerVerticalStyle} type="vertical" />
            </>
          )}
          {!!addedFilters.length && (
            <>
              {!isVisibleAddFilterButton && <Divider css={dividerVerticalStyle} type="vertical" />}
              <Tooltip
                align={tooltipAlign}
                title={localization.getLocalized(CLEAR_FILTER)}
                placement="bottom"
              >
                <Button
                  key="button_remove-filters"
                  type="text"
                  css={getButtonRemoveFilterStyle(isDisabledByOpenFilter)}
                  test-id={removeFiltersButtonTestId}
                  onClick={handleRemoveFilters}
                  disabled={isDisabledByOpenFilter}
                >
                  <RemoveFiltersSVG />
                </Button>
              </Tooltip>
              <Divider key="divider" css={dividerVerticalStyle} type="vertical" />
            </>
          )}
          <FilterList removeFilterIndex={removeFilterIndex}>{addedFilters}</FilterList>
        </>
      ) : (
        <div css={addTopPanelFilterButtonStyle}>
          <DropdownAddFilter
            filterDescriptions={filterDescriptions}
            onFilterClick={handleAddFilterClick}
            isHeaderFilter={isHeaderFilter}
          />
          <TopPanelPortal>
            <InlineFilterTags
              filterClassByTypenameCache={filterClassByTypenameCache}
              filters={filters}
              handleEditFilterClick={handleEditFilterClick}
              handleRemoveFilterClick={handleRemoveFilterClick}
              isDisabledByOpenFilter={isDisabledByOpenFilter}
              handleRemoveFilters={handleRemoveFilters}
            />
          </TopPanelPortal>
        </div>
      )}
      {showAddFilterComponent ? getAddFilterComponent() : null}
      {showEditFilterComponent ? getEditFilterComponent() : null}
    </div>
  );
};

export const FiltersPanel = observer(FiltersPanelComponent);
