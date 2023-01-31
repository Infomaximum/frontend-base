import type { InputProps } from "antd/lib/input";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";

export interface ISearchProps
  extends Omit<InputProps, "onChange" | "value">,
    IWithThemeProps<TTheme> {
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
