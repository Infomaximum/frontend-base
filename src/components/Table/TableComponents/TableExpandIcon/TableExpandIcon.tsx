import ArrowRightSVG from "../../../../resources/icons/ArrowRight.svg";
import ArrowUpSVG from "../../../../resources/icons/ArrowUp.svg";
import {
  tableArrowUpTestId,
  tableArrowRightTestId,
  tableExpanderTestId,
} from "../../../../utils/TestIds";
import type React from "react";
import { memo, useCallback } from "react";
import {
  tableExpandIconHiddenStyle,
  tableExpandIconStyle,
} from "./TableExpandIcon.styles";
import type { ITableExpandIconProps } from "./TableExpandIcon.types";

const TableExpandIcon = <T extends TDictionary>(
  props: ITableExpandIconProps<T | null>
) => {
  const { onExpand, record, expanded, expandable } = props;
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onExpand(record, e);
      e.stopPropagation();
    },
    [onExpand, record]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      css={[
        tableExpandIconStyle,
        !expandable ? tableExpandIconHiddenStyle : null,
      ]}
      test-id={tableExpanderTestId}
    >
      {expanded ? (
        <ArrowUpSVG test-id={tableArrowUpTestId} />
      ) : (
        <ArrowRightSVG test-id={tableArrowRightTestId} />
      )}
    </button>
  );
};

export default memo(TableExpandIcon);
