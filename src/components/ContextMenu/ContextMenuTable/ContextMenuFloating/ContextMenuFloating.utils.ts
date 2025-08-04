import { reduce } from "lodash";
import type { TDropdownSizes, TPositionCoordinates } from "./ContextMenuFloating.types";

export const getDropdownPositionCoordinates = ({
  cursorPosition,
  dropdownSizes,
}: {
  cursorPosition: TPositionCoordinates;
  dropdownSizes: TDropdownSizes;
}) => {
  const horizontalObtainableSpace = window.innerWidth - cursorPosition.x - 6;
  const verticalObtainableSpace = document.body.clientHeight - cursorPosition.y - 6;

  const canDropdownFitIntoHorizontalObtainableSpace =
    horizontalObtainableSpace > dropdownSizes.dropdownWidth;

  const canDropdownFitIntoVerticalObtainableSpace =
    verticalObtainableSpace > dropdownSizes.dropdownHeight;

  return {
    x: canDropdownFitIntoHorizontalObtainableSpace
      ? cursorPosition.x + 2
      : cursorPosition.x - dropdownSizes.dropdownWidth - 1,
    y: canDropdownFitIntoVerticalObtainableSpace
      ? cursorPosition.y + 2
      : cursorPosition.y - dropdownSizes.dropdownHeight - 1,
  };
};

export const getIsCursorInsideTextSelection = ({
  cursorPosition,
  selectionRect,
}: {
  cursorPosition: TPositionCoordinates;
  selectionRect: DOMRect;
}) => {
  return (
    cursorPosition.x > selectionRect.left &&
    cursorPosition.x < selectionRect.right &&
    cursorPosition.y > selectionRect.top &&
    cursorPosition.y < selectionRect.bottom
  );
};

export const getSummaryDropdownHeight = (
  dropdownMenuItemHeights: number[],
  contextMenuItemSummaryVerticalPadding: number
) =>
  reduce(
    dropdownMenuItemHeights,
    (acc, curr) => acc + curr + contextMenuItemSummaryVerticalPadding,
    0
  );
