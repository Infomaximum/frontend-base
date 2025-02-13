import type { DefaultOptionType, SelectProps, SelectValue } from "antd/lib/select";
import type { TXPlacement } from "../Dropdown/Dropdown.types";

export interface ISelectProps<T extends SelectValue = SelectValue>
  extends Omit<SelectProps<T>, "dropdownAlign" | "searchValue" | "bordered"> {
  /** Какой край select считать начальной точкой отсчёта для dropdown (default = "left") */
  dropdownPlacement?: TXPlacement;
  visibleMaxCount?: number;
  /**
   * Функция получения текста для поиска из выбранной опции
   */
  prepareOptionForSearch?: (option: DefaultOptionType) => string;
  /** Отображать ли иконку очистки поля над суффиксом */
  isClearIconOverSuffix?: boolean;
  selectTextOnFocus?: boolean;
  /**
   * Значение в поле ввода
   */
  searchValue?: string;
  bordered?: boolean;
  /**
   * Ref для ситуаций, когда нужен доступ к элементу из родительских компонентов
   */
  innerRef?: React.MutableRefObject<HTMLElement | null>;
  /**
   * Автофокус без автоматического скролла контейнера к элементу (Работает если autoFocus === false | undefined).
   */
  autoFocusWithPreventScroll?: boolean;
  readOnly?: boolean;
}
