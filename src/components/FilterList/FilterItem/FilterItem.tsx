import React, { useCallback } from "react";
import type { IFilterItemProps } from "./FilterItem.types";
import {
  closeIconStyle,
  getWrapperStyle,
  getFilterBodyStyle,
  getFilterRemoveButtonStyle,
  filterNameStyle,
  filterValuesStyle,
} from "./FilterItem.styles";
import { isFunction } from "lodash";
import FilterItemTag from "./FilterItemTag/FilterItemTag";
import { useLocalization } from "../../../decorators";
import { AlignedTooltip } from "../../AlignedTooltip";
import { Tooltip } from "../../Tooltip";
import { CloseOutlined } from "../../Icons";
import { CLOSE_FILTER, filterItemEditTestId, filterItemRemoveTestId } from "../../../utils";

const tooltipAlign = { targetOffset: [0, 2] };

const FilterItem: React.FC<IFilterItemProps> = (props) => {
  const {
    index,
    children,
    caption,
    filterName,
    onClick,
    onRemoveClick,
    filterDescription,
    disabled,
    isHeaderFilter,
    withOverflow,
  } = props;

  const localization = useLocalization();

  const handleEditFilter = useCallback(() => {
    if (!disabled && onClick && isFunction(onClick)) {
      onClick(filterDescription, filterName);
    }
  }, [disabled, filterDescription, filterName, onClick]);

  const handleRemoveFilter = useCallback(() => {
    if (!disabled && onRemoveClick && isFunction(onRemoveClick)) {
      onRemoveClick(filterName, index);
    }
  }, [disabled, filterName, index, onRemoveClick]);

  return isHeaderFilter ? (
    <div key="card-filter_wrapper" css={getWrapperStyle(disabled)}>
      <div
        key="card-filter_body"
        css={getFilterBodyStyle(disabled)}
        test-id={`${filterItemEditTestId}-${filterName}`}
        onClick={handleEditFilter}
      >
        <div key="card-filter_name" css={filterNameStyle}>
          <AlignedTooltip>{caption}</AlignedTooltip>
        </div>
        <div key="card-filter_values" css={filterValuesStyle}>
          <AlignedTooltip>{children}</AlignedTooltip>
        </div>
      </div>
      <Tooltip
        align={tooltipAlign}
        title={localization.getLocalized(CLOSE_FILTER)}
        placement={"bottom"}
      >
        <div
          key="card-filter_close-icon"
          css={getFilterRemoveButtonStyle(disabled)}
          test-id={`${filterItemRemoveTestId}-${filterName}`}
          onClick={handleRemoveFilter}
        >
          <CloseOutlined css={closeIconStyle} />
        </div>
      </Tooltip>
    </div>
  ) : (
    <FilterItemTag
      caption={caption}
      handleEditFilter={handleEditFilter}
      handleRemoveFilter={handleRemoveFilter}
      disabled={disabled}
      withOverflow={withOverflow}
    >
      {children}
    </FilterItemTag>
  );
};

export default FilterItem;
