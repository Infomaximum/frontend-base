import type { Interpolation } from "@emotion/react";

export interface IEmptyProps {
  isFiltersEmpty: boolean | undefined;
  isSearchEmpty: boolean | undefined;
  isHasAccess?: boolean;
  isTableComponent?: boolean;
  /** контент пустого компонента, если undefined, то отображается дефолтный */
  emptyContent?: JSX.Element | null;
  customEmptyTableStyle?: Interpolation<TTheme>;
  /**
   * Подсказка к основному описанию
   */
  hint?: string;
  /**
   * Основное описание
   */
  description?: string;
}
