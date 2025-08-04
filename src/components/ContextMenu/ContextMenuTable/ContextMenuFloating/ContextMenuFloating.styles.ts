import type { TPositionCoordinates } from "./ContextMenuFloating.types";

export const getDropdownOverlayStyle = (dropdownPosition: TPositionCoordinates) =>
  ({
    position: "absolute",
    top: dropdownPosition.y,
    left: dropdownPosition.x,
    minWidth: "unset",
    width: "fit-content",
    whiteSpace: "nowrap",
  }) as const;
