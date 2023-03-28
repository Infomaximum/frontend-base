import type { TreeCounter } from "../../../managers/TreeCounter";
import type { IDataTableProps } from "../DataTable.types";

export interface IDataTableHeaderProps<T>
  extends Pick<IDataTableProps<T>, "editingState" | "headerMode" | "headerButtonsGetter"> {
  onSearchChange(inputValue: string): void;
  clearCheck(): void;
  searchValue?: string | null;
  treeCounter: TreeCounter;
  allowClear?: boolean;
  searchPlaceholder?: string;
}
