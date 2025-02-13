import type { ReactElement } from "react";
import type { TInlineFilterTagsConfig } from "./InlineFilterTags.types";
import { getTextWidth } from "../../../utils/textWidth";

export const tagConfig: TInlineFilterTagsConfig = {
  tagSidePadding: 8,
  tagsGutter: 8,
  tagFontSize: 12,
  tagBorderWidth: 1,
  tagHeight: 22,
  outerEllipsisFontSize: 12,
  outerEllipsisPaddingLeft: 8,
  closeIconWidth: 15,
};

const getTagWidth = (text: string) =>
  getTextWidth(text, { size: tagConfig.tagFontSize }) +
  tagConfig.closeIconWidth +
  (tagConfig.tagSidePadding + tagConfig.tagBorderWidth) * 2;

export const getNumberOfPlacedTags = (
  tags: { caption: string; element: (needOverflow: boolean) => ReactElement }[],
  containerWidth: number
) => {
  const isTagTooOutOfBounds = (leftBound: number, isLast: boolean, tagWidth: number) => {
    const freeSpace = isLast
      ? containerWidth - leftBound
      : containerWidth - leftBound - tagConfig.tagsGutter;

    return freeSpace <= tagWidth;
  };

  let tagLeftBound = 0;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    const tagWidth = (tag?.caption ? getTagWidth(tag?.caption) : 0) + tagConfig.tagsGutter;

    if (isTagTooOutOfBounds(tagLeftBound, tags.length - 1 === i, tagWidth)) {
      return i;
    }

    tagLeftBound += tagWidth;
  }

  return tags.length;
};
