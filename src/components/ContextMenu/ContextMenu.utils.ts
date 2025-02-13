import { get, sortedUniqBy } from "lodash";
import type { TContextMenuParamItem } from "./ContextMenu.types";

/** Удалить дублирующиеся разделители, которые могут неявно возникать при исключении элементов по условию */
export function removeDuplicateDividers(items: TContextMenuParamItem[]) {
  return sortedUniqBy(items, (item) => (get(item, "type") === "divider" ? null : item));
}
