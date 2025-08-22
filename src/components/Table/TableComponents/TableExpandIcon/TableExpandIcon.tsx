import {
  tableArrowUpTestId,
  tableArrowRightTestId,
  tableExpanderTestId,
} from "@infomaximum/base/src/utils/TestIds";
import { memo, useCallback } from "react";
import { tableExpandIconHiddenStyle, tableExpandIconStyle } from "./TableExpandIcon.styles";
import type { ITableExpandIconProps } from "./TableExpandIcon.types";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { RightOutlined, UpOutlined } from "@infomaximum/base/src/components/Icons";

const TableExpandIconComponent = <T extends TDictionary>(
  props: ITableExpandIconProps<T | null>
) => {
  const { onExpand, record, expanded, expandable, expandIconStyle } = props;

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
        expandIconStyle,
        !expandable ? tableExpandIconHiddenStyle : null,
      ]}
      test-id={tableExpanderTestId}
    >
      {expanded ? (
        <UpOutlined test-id={tableArrowUpTestId} />
      ) : (
        <RightOutlined test-id={tableArrowRightTestId} />
      )}
    </button>
  );
};

export const TableExpandIcon = memo(TableExpandIconComponent);
