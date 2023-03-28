export interface IDropdownPendingPlaceholderProps {
  /** Загружен ли контент (даже если был загружен заранее, необходимо передать true) */
  isDataLoaded: boolean;
  /** Происходит ли загрузка контента */
  loading: boolean;
  /** Поисковая строка (пока используется только факт ее наличия) */
  searchText?: TNullable<string>;
  /** Есть ли у пользователя доступ к контенту */
  hasAccess?: boolean;
  emptyText?: string;
}
