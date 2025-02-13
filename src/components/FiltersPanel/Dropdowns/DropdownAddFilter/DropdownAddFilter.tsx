import React, { useState, memo, useMemo, useRef, useCallback } from "react";
import { trim, toLower, debounce, forEach, sortBy } from "lodash";
import { Empty, type DropDownProps } from "antd";
import {
  useLocalization,
  useMountEffect,
  usePrevious,
  useTheme,
  useUnmountEffect,
} from "../../../../decorators";
import {
  DropdownAnimationInterval,
  EMPTY_HERE,
  filterDropdownTestId,
  FILTERS_LIMIT,
  NOTHING_FOUND,
  SEARCH,
  type BaseFilter,
} from "../../../../utils";
import { Dropdown, mainBaseDropdownOverlayStyle } from "../../../Dropdown";
import { Input } from "../../../Input";
import { SearchOutlined } from "../../../Icons";
import { NothingFoundBoxDarkSVG } from "../../../../resources";
import type { IDropdownAddFilterProps } from "./DropdownAddFilter.types";
import {
  emptyStyle,
  emptyImageStyle,
  getWrapperStyle,
  getWrapperWithScrollStyle,
  headerFilterItemsWrapperStyle,
  getItemStyle,
  iconStyle,
  wrapperTopPanelStyle,
  headerSearchInputStyle,
  searchInputStyle,
  inputDefaultStyle,
  headerInputStyle,
  defaultFilterItemsWrapperStyle,
} from "./DropdownAddFilter.styles";
import { AddFilterButton } from "../../../FilterList/Buttons/AddFilterButton/AddFilterButton";

const trigger: DropDownProps["trigger"] = ["click"];

const DropdownAddFilterComponent: React.FC<IDropdownAddFilterProps> = (props) => {
  const { filterDescriptions, onFilterClick, disabled, isHeaderFilter = true } = props;
  const localization = useLocalization();
  const theme = useTheme();

  const [searchText, setSearchText] = useState<string>();
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowChildren, setIsShowChildren] = useState(true);
  const [isShowSearchInput, setIsShowSearchInput] = useState(true);

  const iconOutline = useMemo(() => {
    return <SearchOutlined css={iconStyle} />;
  }, []);

  const nothingFoundIcon = useMemo(() => {
    return <NothingFoundBoxDarkSVG />;
  }, []);

  const animationTimer = useRef<NodeJS.Timeout>();

  const debouncedSearchChange = useRef(
    debounce((value) => {
      setSearchText(trim(toLower(value)));
    }, 450)
  );

  const previousIsShowMenu = usePrevious(isShowMenu);

  useMountEffect(() => {
    isShowMenu && !previousIsShowMenu && changeIsCloseAnimation(true);
    !isShowMenu && previousIsShowMenu && changeIsCloseAnimation(false);
  });

  useUnmountEffect(() => {
    animationTimer.current && clearTimeout(animationTimer.current);
  });

  const changeIsCloseAnimation = (value: boolean) => {
    animationTimer.current && clearTimeout(animationTimer.current);

    animationTimer.current = setTimeout(() => {
      setIsShowChildren(value);
      setSearchText(undefined);
    }, DropdownAnimationInterval);
  };

  const handleClickFilter = useCallback(
    (item: BaseFilter) => {
      setIsShowMenu(false);
      onFilterClick(item);
    },
    [onFilterClick]
  );

  const handleShowMenu = useCallback(
    (open: boolean) => {
      if (searchText) {
        setSearchText("");
      }

      const displayedFilterList: BaseFilter[] = [];

      forEach(filterDescriptions, (filter) => {
        if (filter.isShowInAddFilterList()) {
          displayedFilterList.push(filter);
        }
      });

      if (displayedFilterList.length === 1) {
        handleClickFilter(displayedFilterList[0] as BaseFilter);

        return;
      }

      if (displayedFilterList.length > FILTERS_LIMIT) {
        setIsShowChildren(true);
      } else {
        setIsShowSearchInput(false);
      }

      setIsShowMenu(open);
    },
    [filterDescriptions, handleClickFilter, searchText]
  );

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    debouncedSearchChange.current(event.target.value);
  }, []);

  const getFilter = useCallback(
    (filter: BaseFilter) => {
      return (
        <div
          key={filter.getTypename()}
          css={getItemStyle(!!isHeaderFilter)}
          onClick={() => handleClickFilter(filter)}
          test-id={`${filterDropdownTestId}_${filter.getTypename()}`}
        >
          {filter.getIcon?.()}
          {filter.getCaption(localization)}
        </div>
      );
    },
    [handleClickFilter, isHeaderFilter, localization]
  );

  const sortedFilterList = useMemo(() => {
    const sortedFilterDescriptions = sortBy(
      filterDescriptions,
      [(description) => description.getCaption(localization)?.toLowerCase()],
      ["asc"]
    );
    const itemList: JSX.Element[] = [];

    if (searchText) {
      for (let i = 0; i < sortedFilterDescriptions?.length; i += 1) {
        if (!sortedFilterDescriptions[i]?.isShowInAddFilterList()) {
          continue;
        }

        const caption = toLower(sortedFilterDescriptions[i]?.getCaption(localization));

        const filterDescription = sortedFilterDescriptions[i];

        if (caption.indexOf(searchText) !== -1 && filterDescription) {
          itemList.push(getFilter(filterDescription));
        }
      }

      return itemList;
    }

    forEach(sortedFilterDescriptions, (filter) => {
      if (filter.isShowInAddFilterList()) {
        itemList.push(getFilter(filter));
      }
    });

    return itemList;
  }, [filterDescriptions, getFilter, localization, searchText]);

  const content = useMemo(() => {
    if (sortedFilterList?.length === 0) {
      return (
        <Empty
          image={nothingFoundIcon}
          imageStyle={emptyImageStyle}
          description={localization.getLocalized(searchText ? NOTHING_FOUND : EMPTY_HERE)}
          css={emptyStyle}
        />
      );
    }

    return sortedFilterList;
  }, [localization, nothingFoundIcon, searchText, sortedFilterList]);

  const dropdownRender = useCallback(() => {
    return (
      <div
        key="wrapper-menu"
        css={
          isShowSearchInput
            ? getWrapperWithScrollStyle(isHeaderFilter)
            : isHeaderFilter
              ? getWrapperStyle(theme, isHeaderFilter)
              : wrapperTopPanelStyle
        }
      >
        {isShowMenu || (!isShowMenu && isShowChildren) ? (
          <>
            {isShowSearchInput ? (
              <div css={isHeaderFilter ? headerInputStyle : inputDefaultStyle}>
                <Input
                  css={isHeaderFilter ? headerSearchInputStyle : searchInputStyle}
                  autoFocus={true}
                  onChange={handleSearchChange}
                  prefix={iconOutline}
                  placeholder={localization.getLocalized(SEARCH)}
                  allowClear={true}
                />
              </div>
            ) : null}

            <div
              css={
                isShowSearchInput
                  ? isHeaderFilter
                    ? headerFilterItemsWrapperStyle
                    : defaultFilterItemsWrapperStyle
                  : null
              }
            >
              {content}
            </div>
          </>
        ) : null}
      </div>
    );
  }, [
    content,
    handleSearchChange,
    iconOutline,
    isHeaderFilter,
    isShowChildren,
    isShowMenu,
    isShowSearchInput,
    localization,
  ]);

  return (
    <Dropdown
      open={isShowMenu}
      trigger={trigger}
      onOpenChange={handleShowMenu}
      overlayStyle={mainBaseDropdownOverlayStyle}
      dropdownRender={dropdownRender}
      disabled={disabled}
      autoFocus={true}
    >
      <AddFilterButton isHeaderFilter={isHeaderFilter} />
    </Dropdown>
  );
};

export const DropdownAddFilter = memo(DropdownAddFilterComponent);
