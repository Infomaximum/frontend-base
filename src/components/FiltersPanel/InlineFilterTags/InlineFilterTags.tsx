import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { IInlineFilterTagsProps } from "./InlineFilterTags.types";
import {
  map,
  join,
  take,
  drop,
  isUndefined,
  isNil,
  reverse,
  isBoolean,
  toLower,
  debounce,
} from "lodash";
import {
  dropdownStyle,
  dropdownWrapperStyle,
  getMenuStyle,
  getResetFilterTagsButtonStyle,
  getTagStyle,
  tagsWrapperStyle,
  wrapperStyle,
} from "./InlineFilterTags.styles";
import { Dropdown } from "../../Dropdown";
import { ErrorBoundary } from "../../ErrorBoundary";
import { Tag } from "../../Tag";
import { getTextWidth } from "../../../utils/textWidth";
import { tooltipSeparator } from "../../ApplicationCard/InlineTags/InlineTags.utils";
import { MORE, NOT, removeFiltersButtonTestId, RESET } from "../../../utils";
import {
  TopPanelContext,
  useLocalization,
  useMountEffect,
  useTheme,
  useUnmountEffect,
} from "../../../decorators";
import FilterItem from "../../FilterList/FilterItem/FilterItem";
import { Row } from "antd";
import { getDropdownMenuMaxHeight } from "../../Dropdown/Dropdown.utils";
import type { ItemType } from "antd/es/menu/interface";
import { getNumberOfPlacedTags, tagConfig } from "./InlineFilterTags.utils";

export const InlineFilterTags: React.FC<IInlineFilterTagsProps> = (props) => {
  const {
    filterClassByTypenameCache,
    filters,
    handleEditFilterClick,
    handleRemoveFilterClick,
    isDisabledByOpenFilter,
    handleRemoveFilters,
  } = props;
  const topPanelContainer = useContext(TopPanelContext);
  const localization = useLocalization();
  const theme = useTheme();

  const resetButtonText = localization.getLocalized(RESET);
  const resetButtonWidth = getTextWidth(resetButtonText, { size: tagConfig.tagFontSize });

  const [containerWidth, setWidth] = useState(
    topPanelContainer?.offsetWidth ? topPanelContainer?.offsetWidth : 0
  );
  const [moreTagWidth, setMoreTagWidth] = useState(0);

  /* Формирование набора конфигураций добавленных фильтров для расчетов и рендера */
  const getAddedFilters = () => {
    const filterItems: { caption: string; element: (needOverflow?: boolean) => ReactElement }[] =
      [];
    let index = 0;

    if (filterClassByTypenameCache) {
      filters.forEach((filter, filterName) => {
        if (!isUndefined(filter)) {
          const filterDescription = filterClassByTypenameCache[filter.typename];

          if (!isNil(filterDescription)) {
            index += 1;
            const filterValue = filter.value;

            const caption = filterDescription?.getCaption(localization, filterValue);
            const value = filterDescription?.getFilterSpoilerContent(filterValue, localization);

            const captionValue = isBoolean(value)
              ? value
                ? caption
                : `${localization.getLocalized(NOT)} ${toLower(caption)}`
              : `${caption}${caption && value && ": "}${value}`;

            filterItems.push({
              caption: captionValue,
              element: (needOverflow: boolean) => (
                <ErrorBoundary key={filterName} code="filter_item">
                  <FilterItem
                    key={filterName}
                    index={index}
                    caption={caption}
                    onClick={handleEditFilterClick}
                    filterName={filterName}
                    filterDescription={filterDescription}
                    onRemoveClick={handleRemoveFilterClick}
                    disabled={isDisabledByOpenFilter}
                    isHeaderFilter={false}
                    withOverflow={needOverflow}
                  >
                    {value}
                  </FilterItem>
                </ErrorBoundary>
              ),
            });
          }
        }
      });
    }

    return reverse(filterItems);
  };

  const addedFilters = getAddedFilters();

  /** свободная ширина контейнера (вычитаются ширина кнопки сброса и ширина тега-дропдауна не поместившихся в строку) */
  const freeContainerWidth = useMemo(
    () => containerWidth - resetButtonWidth - moreTagWidth,
    [containerWidth, moreTagWidth, resetButtonWidth]
  );

  const [placedTags, outsideTags] = useMemo(() => {
    const numberOfPlacedTags = getNumberOfPlacedTags(addedFilters, freeContainerWidth);

    return [take(addedFilters, numberOfPlacedTags), drop(addedFilters, numberOfPlacedTags)];
  }, [addedFilters, freeContainerWidth]);

  const outsideTagCaption = outsideTags.length
    ? `${localization.getLocalized(MORE)}: ${outsideTags.length}`
    : null;

  useEffect(() => {
    if (outsideTagCaption) {
      setMoreTagWidth(
        getTextWidth(outsideTagCaption, { size: tagConfig.tagFontSize }) +
          (tagConfig.tagSidePadding + tagConfig.tagBorderWidth) * 2
      );
    } else {
      setMoreTagWidth(0);
    }
  }, [outsideTagCaption]);

  const handleResize = () => {
    if (topPanelContainer) {
      setWidth(topPanelContainer.offsetWidth);
    }
  };

  useEffect(() => {
    handleResize();
  }, [resetButtonWidth, moreTagWidth, topPanelContainer]);

  const debouncedResizeHandler = useCallback(
    debounce(() => {
      handleResize();
    }, 500),
    []
  );

  useMountEffect(() => {
    handleResize();

    window.addEventListener("resize", debouncedResizeHandler);
  });

  useUnmountEffect(() => {
    window.removeEventListener("resize", debouncedResizeHandler);
  });

  const getMenu = useCallback(
    (menuItems: ItemType[], menuMaxHeight: number) => ({
      items: menuItems,
      style: getMenuStyle(menuMaxHeight),
    }),
    []
  );

  const dropdownRender = useCallback((menu: ReactNode) => {
    return (
      <div key="dropdown-wrapper" css={dropdownWrapperStyle}>
        {menu}
      </div>
    );
  }, []);

  const counterTag = useMemo(() => {
    const menuMaxHeight = getDropdownMenuMaxHeight({});

    const menuItems = outsideTags.map(({ caption, element }) => ({
      key: caption,
      label: element(true),
    }));

    const title = join(
      map(outsideTags, (tag) => {
        return tag.caption;
      }),
      tooltipSeparator
    );

    if (menuItems.length) {
      return (
        <Dropdown
          key="show-more"
          menu={getMenu(menuItems, menuMaxHeight)}
          dropdownRender={dropdownRender}
          css={dropdownStyle}
        >
          <span key="outside-tags">
            <Tag title={title} css={getTagStyle(tagConfig, theme)}>
              {outsideTagCaption}
            </Tag>
          </span>
        </Dropdown>
      );
    }
  }, [dropdownRender, getMenu, outsideTagCaption, outsideTags, theme]);

  const resetButton = useMemo(() => {
    if (addedFilters.length <= 1) {
      return null;
    }

    return (
      <div
        onClick={isDisabledByOpenFilter ? undefined : handleRemoveFilters}
        css={getResetFilterTagsButtonStyle(isDisabledByOpenFilter)}
        test-id={removeFiltersButtonTestId}
        key="button_remove-filters"
      >
        {localization.getLocalized(RESET)}
      </div>
    );
  }, [addedFilters.length, handleRemoveFilters, isDisabledByOpenFilter, localization]);

  if (!addedFilters.length) {
    return null;
  }

  return (
    <Row wrap={false} css={wrapperStyle}>
      <div style={tagsWrapperStyle}>
        {map(placedTags, (tag) => tag.element(false))}
        {counterTag}
        {resetButton}
      </div>
    </Row>
  );
};
