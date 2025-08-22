import React, { memo, useMemo } from "react";
import type { IInlineTagsProps } from "@infomaximum/base/src/components/ApplicationCard/InlineTags/InlineTags.types";
import { map, last, join, take, drop } from "lodash";
import {
  containerStyle,
  ellipsisStyle,
  getTagContainerStyle,
  tagStyle,
} from "@infomaximum/base/src/components/ApplicationCard/InlineTags/InlineTags.styles";
import {
  getNumberOfPlacedTags,
  outerEllipsisText,
  tooltipSeparator,
} from "@infomaximum/base/src/components/ApplicationCard/InlineTags/InlineTags.utils";
import { Tag } from "@infomaximum/base/src/components/Tag/Tag";
import { useTheme } from "@infomaximum/base/src/decorators";
import { AlignedTooltip } from "@infomaximum/base/src/components/AlignedTooltip";
import { getTagPropsByColor } from "@infomaximum/base/src/components/Tag";

const InlineTagsComponent: React.FC<IInlineTagsProps> = ({ tags, measuredWidth }) => {
  const theme = useTheme();

  const [placedTags, outsideTags] = useMemo(() => {
    const numberOfPlacedTags = getNumberOfPlacedTags(tags, measuredWidth);

    return [take(tags, numberOfPlacedTags), drop(tags, numberOfPlacedTags)];
  }, [tags, measuredWidth]);

  const renderedTags = useMemo(
    () =>
      map(placedTags, (tag) => {
        const flexShrink = tag === last(placedTags) ? 1 : 0;

        return (
          <span key={tag.getInnerName()} style={getTagContainerStyle(flexShrink)}>
            <Tag {...getTagPropsByColor(tag.color)} style={tagStyle}>
              {tag.getName?.()}
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
        <div css={ellipsisStyle(theme)}>
          <AlignedTooltip title={join(tagNames, tooltipSeparator)}>
            {outerEllipsisText}
          </AlignedTooltip>
        </div>
      );
    }
  }, [outsideTags, theme]);

  return renderedTags.length ? (
    <div style={containerStyle}>
      {renderedTags}
      {outerEllipsis}
    </div>
  ) : null;
};

export const InlineTags = memo(InlineTagsComponent);
