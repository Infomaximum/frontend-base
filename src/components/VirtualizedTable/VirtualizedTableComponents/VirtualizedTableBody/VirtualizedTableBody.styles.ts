import { LOADING_ON_SCROLL_SPINNER_ID } from "../../../../utils";

export const virtualizedTableBodyListWithPaddingStyle = {
  paddingBottom: "8px",
  // стилизация скролла и спиннера динамической подгрузки
  "&::-webkit-scrollbar-track": {
    marginBottom: "8px",
  },
  [`&:has(div#${LOADING_ON_SCROLL_SPINNER_ID})`]: {
    paddingBottom: "12px",
    "&::-webkit-scrollbar-track": {
      marginBottom: "12px",
    },
  },
};

export const getVirtualizedTableBodyListStyle = (isWithoutWrapperStyles?: boolean) => {
  const withPaddingStyle = isWithoutWrapperStyles ? {} : virtualizedTableBodyListWithPaddingStyle;

  return {
    outline: "none",
    ...withPaddingStyle,
  };
};

/**
 * Отключение оптимизации, т.к. она приводит к следующим багам в Chromium:
 * - Может происходить размытие текста;
 * - Может неправильно синхронизироваться позиция прокрутки для шапки и тела таблицы.
 * Решение взято из https://github.com/bvaughn/react-virtualized/issues/453#issuecomment-260866854
 *
 * width: "100%" - для корректной работы без AutoSizer
 */
export const getBugsFixStyle = (isWithoutWrapperStyles?: boolean) =>
  ({
    willChange: "auto",
    transform: "translate3d(0,0,0)",
    overflowY: isWithoutWrapperStyles ? "auto" : "scroll",
    width: "100%",
  }) as const;

export const vListContainerStyle = { width: "100%", maxWidth: "100%" };
