import React, { memo, useMemo } from "react";
import type { IInlineTagsProps } from "./InlineTags.types";
import { Tooltip } from "../../../components/Tooltip/Tooltip";
import { map, last, join, take, drop } from "lodash";
import {
  containerStyle,
  ellipsisStyle,
  getTagContainerStyle,
  tagStyle,
} from "./InlineTags.styles";
import {
  getNumberOfPlacedTags,
  outerEllipsisText,
  tooltipSeparator,
} from "./InlineTags.utils";
import { Tag } from "../../../components/Tag/Tag";

const InlineTagsComponent: React.FC<IInlineTagsProps> = ({
  tags,
  measuredWidth,
}) => {
  const [placedTags, outsideTags] = useMemo(() => {
    const numberOfPlacedTags = getNumberOfPlacedTags(tags, measuredWidth);

    return [take(tags, numberOfPlacedTags), drop(tags, numberOfPlacedTags)];
  }, [tags, measuredWidth]);

  const renderedTags = useMemo(
    () =>
      map(placedTags, (tag) => {
        const flexShrink = tag === last(placedTags) ? 1 : 0;

        return (
          <span
            key={tag.getInnerName()}
            style={getTagContainerStyle(flexShrink)}
          >
            <Tag color={tag.color} style={tagStyle}>
              {tag.getName()}
            </Tag>
          </span>
        );
      }),
    [placedTags]
  );

  const outerEllipsis = useMemo(() => {
    if (outsideTags.length) {
      const tagNames = map(outsideTags, (tag) => tag.getName());

      return (
        <Tooltip
          placement="bottomLeft"
          title={join(tagNames, tooltipSeparator)}
        >
          <div css={ellipsisStyle}>{outerEllipsisText}</div>
        </Tooltip>
      );
    }
  }, [outsideTags]);

  return (
    <div style={containerStyle}>
      {renderedTags}
      {outerEllipsis}
    </div>
  );
};

export const InlineTags = memo(InlineTagsComponent);
