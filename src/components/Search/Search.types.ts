import type { InputProps } from "antd/lib/input";

export interface ISearchProps extends Omit<InputProps, "onChange" | "value"> {
  onChange?: (searchValue: string) => void;
  /**
   * Свойство используется для задания начальных значений поля поиска,
   * а также для изменения значения извне (если свойство изменится,
   * то текст в поле поиска обновится)
   */
  value?: string | null;
  /** middle для дроверов (по умолчанию), small для вкладок списков */
  size: "middle" | "small";
}

export interface ISearchState {
  searchText?: string;
}
