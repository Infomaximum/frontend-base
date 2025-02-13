import { type FC } from "react";
import type { IFilterItemTagProps } from "./FilterItemTag.types";
import { getFilterTagStyle } from "./FilterItemTag.styles";
import { useTagValue } from "./FilterItemTag.utils";
import { AlignedTooltip } from "../../../AlignedTooltip";
import { Tag } from "../../../Tag";

const FilterItemTag: FC<IFilterItemTagProps> = (props) => {
  const { caption, children, disabled, handleEditFilter, handleRemoveFilter, withOverflow } = props;
  const tagValue = useTagValue(caption, children);

  return (
    <div key="card-filter_wrapper">
      <Tag
        onClick={handleEditFilter}
        closable={true}
        onClose={handleRemoveFilter}
        css={getFilterTagStyle(disabled)}
      >
        {!withOverflow ? tagValue : <AlignedTooltip>{tagValue}</AlignedTooltip>}
      </Tag>
    </div>
  );
};

export default FilterItemTag;
