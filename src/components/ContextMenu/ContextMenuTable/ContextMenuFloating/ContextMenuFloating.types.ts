import type { TRow } from "../../../VirtualizedTable/VirtualizedTable.types";
import type { IContextMenuItem } from "../../ContextMenu.types";

export type TPositionCoordinates = {
  x: number;
  y: number;
};

export type TFloatingContextMenuConfig = {
  getSingleRowMenuItems(record: TDictionary): IContextMenuItem[];
  getMultipleRowMenuItems?(record: TDictionary): IContextMenuItem[];
  isMultipleRowSelected: boolean;
  menuItemSelectHandler?(action: string, data: TDictionary): void;
};

export interface IContextMenuFloatingProps {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  isRowChecked?: boolean;
  floatingContextMenuConfig?: TFloatingContextMenuConfig;
  data?: TRow | null;
}

export type TDropdownSizes = {
  dropdownWidth: number;
  dropdownHeight: number;
};
