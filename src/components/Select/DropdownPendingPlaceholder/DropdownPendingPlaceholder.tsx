import type { IDropdownPendingPlaceholderProps } from "./DropdownPendingPlaceholder.types";
import { useLastLoaded } from "./DropdownPendingPlaceholder.utils";
import { DropdownPlaceholder } from "../DropdownPlaceholder/DropdownPlaceholder";

/**
 * Placeholder выпадающего списка (данные запрашиваются при изменении стоки поиска).
 * Placeholder не меняется, пока идет загрузка и не отображается (null), если данные еще не загружены
 */
const DropdownPendingPlaceholderComponent: React.FC<IDropdownPendingPlaceholderProps> = ({
  isDataLoaded,
  loading,
  searchText,
  hasAccess = true,
  emptyText,
}) => {
  return useLastLoaded(loading, isDataLoaded, () => (
    <DropdownPlaceholder searchText={searchText} hasAccess={hasAccess} emptyText={emptyText} />
  ));
};

export const DropdownPendingPlaceholder = DropdownPendingPlaceholderComponent;
