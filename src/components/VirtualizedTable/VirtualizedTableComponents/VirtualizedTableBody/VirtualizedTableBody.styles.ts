export const virtualizedTableBodyListStyle = {
  outline: "none",
} as const;

/**
 * Отключение оптимизации, т.к. она приводит к следующим багам в Chromium:
 * - Может происходить размытие текста;
 * - Может неправильно синхронизироваться позиция прокрутки для шапки и тела таблицы.
 * Решение взято из https://github.com/bvaughn/react-virtualized/issues/453#issuecomment-260866854
 *
 * width: "100%" - для корректной работы без AutoSizer
 */
export const bugsFixStyle = {
  willChange: "auto",
  transform: "translate3d(0,0,0)",
  width: "100%",
};

export const vListContainerStyle = { width: "100%", maxWidth: "100%" };
