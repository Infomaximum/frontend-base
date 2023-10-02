import type { DefaultOptionType, SelectProps, SelectValue } from "antd/lib/select";
import type { TXPlacement } from "../Dropdown/Dropdown.types";

export interface ISelectProps<T extends SelectValue = SelectValue>
  extends Omit<SelectProps<T>, "listHeight" | "dropdownAlign" | "showAction"> {
  /** Какой край select считать начальной точкой отсчёта для dropdown (default = "left") */
  dropdownPlacement?: TXPlacement;
  visibleMaxCount?: number;
  /**
   * Функция получения текста для поиска из выбранной опции
   */
  prepareOptionForSearch?: (option: DefaultOptionType) => string;
  /** Отображать ли иконку очистки поля над суффиксом */
  isClearIconOverSuffix?: boolean;
}
