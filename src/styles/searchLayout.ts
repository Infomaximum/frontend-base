// Все брекпоинты являются делителем числа 24, это, например, позволяет, отображать карточку
// приложения равной ширине поиска, распределяя колонки карточек по всей ширине контейнера.
export const searchBreakpoints = {
  xs: 12,
  sm: 8,
  md: 6,
  lg: 6,
  xl: 6,
  xxl: 4,
} as const;

export const reverseSearchBreakpoints = {
  xs: 14,
  sm: 9,
  md: 7,
  lg: 6,
  xl: 6,
  xxl: 4,
} as const;
