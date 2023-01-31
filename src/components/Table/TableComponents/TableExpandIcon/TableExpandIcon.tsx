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
import { useTheme } from "../../../../decorators/hooks/useTheme";

const TableExpandIconComponent = <T extends TDictionary>(
  props: ITableExpandIconProps<T | null>
) => {
  const { onExpand, record, expanded, expandable } = props;

  const theme = useTheme();

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
        tableExpandIconStyle(theme),
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

export const TableExpandIcon = memo(TableExpandIconComponent);
