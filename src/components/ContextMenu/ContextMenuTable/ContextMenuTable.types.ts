import type { IContextMenuItem } from "../ContextMenu.types";

export interface IContextMenuTableProps {
  items: IContextMenuItem[];
  data: TDictionary;
  onSelect(action: string, data: any): void;
  isChecked?: boolean;
}
