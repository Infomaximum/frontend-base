import type { DefaultOptionType, SelectProps, SelectValue } from "antd/lib/select";
import type { TXPlacement } from "../Dropdown/Dropdown.types";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";

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
   * Применять ли новое значение. Корректно работает, только если передан selectTextOnFocus
   */
  enableAddingNewOption?: boolean;
  /**
   * Отключение функции globalScrollBehavior
   */
  disableGlobalScrollBehavior?: boolean;
  /**
   * Применять ли пустое значение.
   * Корректно работает, только если передан selectTextOnFocus и enableAddingNewOption
   */
  submitEmptyValue?: boolean;
  /**
   * Значение в поле ввода
   */
  searchValue?: string;
  /**
   * Ref для ситуаций, когда нужен доступ к элементу из родительских компонентов
   */
  innerRef?: React.MutableRefObject<HTMLElement | null>;
  /**
   * Автофокус без автоматического скролла контейнера к элементу (Работает если autoFocus === false | undefined).
   */
  autoFocusWithPreventScroll?: boolean;
  readOnly?: boolean;
  /** Возвращает компонент, относительно которого высчитывается свободное пространство для дропдауна. */
  getBoundingContainer?: () => HTMLElement;
}

export interface ITagRenderProps extends Omit<CustomTagProps, "onClose"> {
  onClose: (event?: React.MouseEvent<Element, MouseEvent>) => void;
}
