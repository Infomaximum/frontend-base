import { getTextWidth } from "../../../utils/textWidth";
import {
  tagSidePadding,
  tagsGutter,
  tagFontSize,
  outerEllipsisFontSize,
  outerEllipsisPaddingLeft,
  tagBorderWidth,
} from "./InlineTags.styles";
import type { ITagProps } from "./InlineTags.types";

const getTagWidth = (text: string) =>
  getTextWidth(text, tagFontSize) + (tagSidePadding + tagBorderWidth) * 2;

export const outerEllipsisText = "...";
export const tooltipSeparator = "; ";

const minTagWidth = getTagWidth(`Aa...`);
const outerEllipsisWidth =
  getTextWidth(outerEllipsisText, outerEllipsisFontSize) + outerEllipsisPaddingLeft;

/* Из переданных тегов возвращает количество поместившихся в контейнер */
export const getNumberOfPlacedTags = (tags: ITagProps[], containerWidth: number) => {
  const isTagTooOutOfBounds = (leftBound: number, isLast: boolean) => {
    const freeSpace = isLast
      ? containerWidth - leftBound
      : containerWidth - leftBound - (outerEllipsisWidth + tagsGutter);

    return freeSpace <= minTagWidth;
  };

  let tagLeftBound = 0;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    if (isTagTooOutOfBounds(tagLeftBound, tags.length - 1 === i)) {
      return i;
    }

    tagLeftBound += getTagWidth(tag?.getName() ?? "") + tagsGutter;
  }

  return tags.length;
};
