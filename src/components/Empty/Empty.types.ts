import type { Interpolation } from "@emotion/react";

export interface IEmptyProps {
  isFiltersEmpty: boolean | undefined;
  isSearchEmpty: boolean | undefined;
  isHasAccess?: boolean;
  isLoading?: boolean;
  isVirtualized?: boolean;
  isTableComponent?: boolean;
  /** контент пустого компонента, если undefined, то отображается дефолтный */
  emptyContent?: JSX.Element | null;
  customEmptyTableStyle?: Interpolation<TTheme>;
  /**
   * Подсказка к основному описанию
   */
  hint?: React.ReactNode;
  /**
   * Основное описание
   */
  description?: string | JSX.Element;
  /**
   * Иконка для исключений из общей логики определения emptyImage
   */
  emptyImage?: React.ReactNode;
}
