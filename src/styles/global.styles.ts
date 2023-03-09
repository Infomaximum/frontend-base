import type { Interpolation } from "@emotion/react";
import { userAgent, EUserAgents } from "@im/utils";

export const SCROLLBAR_WIDTH = 6;
export const SCROLLBAR_HEIGHT = 6;

const scrollStyle = (theme: TTheme) => {
  const scrollbarWidthHover = "10px";
  const scrollbarHeightHover = "10px";

  return {
    "::-webkit-scrollbar": {
      position: "absolute",
      width: scrollbarWidthHover,
      height: scrollbarHeightHover,
    },
    "::-webkit-scrollbar-thumb": {
      position: "absolute",
      width: scrollbarWidthHover,
      height: "auto",
      border: "2px solid transparent",
      background: theme.grey5Color,
      borderRadius: "12px",
      backgroundClip: "content-box",
      ":hover": {
        backgroundClip: "unset",
      },
    },
    "::-webkit-scrollbar-corner": {
      background: theme.grey1Color,
    },
    "::-webkit-scrollbar-button": {
      height: "0px",
      width: "0px",
    },
    // Стили для Mozilla. scrollbarWidth: "auto" слишком широкий в Windows, "thin" слишком узкий в Linux и MacOS,
    // а в пикселях ширину скролла для мозиллы задать нельзя. В приоритете OS Windows
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.grey5Color} ${theme.grey1Color}`,

    ".rc-virtual-list-scrollbar": {
      width: `${SCROLLBAR_WIDTH}px !important`,
      ...scrollDefaultStyle(theme),
    },

    ".CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scroll, .rc-virtual-list-holder": {
      ...scrollDefaultStyle(theme),
    },

    ".ant-dropdown *": {
      ...scrollDefaultStyle(theme),
    },

    ".rc-virtual-list-scrollbar-thumb": {
      background: `${theme.grey5Color} !important`,
      ":hover": {
        background: `${theme.grey6Color} !important`,
      },
    },
  };
};

export const scrollDefaultStyle = (theme: TTheme) => {
  return {
    "::-webkit-scrollbar-track": {
      background: theme.grey1Color,
    },
    "::-webkit-scrollbar": {
      width: `${SCROLLBAR_WIDTH}px !important`,
      height: `${SCROLLBAR_HEIGHT}px !important`,
    },
    "::-webkit-scrollbar-thumb": {
      backgroundClip: "unset !important",
      ":hover": {
        background: theme.grey6Color,
      },
    },
  };
};

const rootStyle = () => ({
  "#root": {
    minHeight: "100vh",
    height: "100%",
  },
});

const allStyle = (theme: TTheme) => ({
  "*": {
    fontFamily: "Roboto",
    ...scrollStyle(theme),
  },
});

const htmlAndBodyStyle = () => ({
  "html,body": {
    height: "100%",
    minHeight: "100%",
    margin: 0,
    fontFamily: "Roboto",
    overflow: "hidden",
  },
});

const fixIEBugs = () => {
  const isIE = userAgent() === EUserAgents.MSIE;

  if (!isIE) {
    return {};
  }

  return {
    "@media only screen and (-ms-high-contrast: active), (-ms-high-contrast: none)": {
      /* Фикс для IE, чтобы теги внутри Select'а c mode = "tags" не растягивали контейнер вправо,
     а переходили на новую строку*/
      ".ant-form-item-control-input": {
        position: "relative",
        display: "block", // flex у анта
        alignItems: "center",
        minHeight: "28px",
      },

      // Фикс для IE, чтобы при открытии дропдауна не мерцал дропдаун
      ".ant-select-dropdown": {
        ".ant-select-item": {
          ":after": {
            content: "''",
            position: "fixed",
            display: "block",
          },
        },
      },

      // Фикс для IE, чтобы при открытии дропдауна не мерцала страница
      ".ant-layout": {
        ":after": {
          content: "''",
          position: "fixed",
          display: "block",
        },
      },
    },

    // Фикс высоты Picker'ов IE
    ".ant-picker-input > input": {
      minHeight: "22px",
      cursor: "text",
    },

    /** Фикс мерцания окна IE */
    ".ant-picker:after": {
      content: "''",
      position: "fixed",
      display: "block",
    },

    ".ant-input": {
      cursor: "text",
    },

    // Меню в хедере
    ".ant-layout-header ": {
      // чтобы элементы меню и кнопка выбора вкладок не сжимались
      ".ant-tabs-tab, .ant-tabs-nav-operations": {
        flexShrink: 0,
      },
      // чтобы кнопки справа не уходили за пределы окна
      ".ant-row-middle > .ant-col": {
        flexShrink: 1,
      },
    },

    // Фикс обрезания скролла при маленьком размере окна
    ".ant-layout-content": {
      height: "100%",
    },
  };
};

const fixSafariBugs = () => {
  const isSafari = userAgent() === EUserAgents.Safari;

  if (!isSafari) {
    return {};
  }

  return {
    ".ant-layout-content": {
      height: "100%",
    },
  };
};

const antGlobalStyle = (theme: TTheme) => ({
  ".ant-tooltip .ant-tooltip-arrow": {
    height: "16px",
    // Для корректной работы при разных масштабах окна браузера
    bottom: "1px",
    ".ant-tooltip-arrow-content": {
      // Фикс цвета в IE
      background: theme.grey9Color,
      // Фикс обводки в Mozilla Firefox
      overflow: "hidden",
    },
  },

  ".ant-select-disabled .ant-select-selection-placeholder": {
    color: theme.grey7Color,
  },
  ".ant-select-item": {
    color: theme.grey9Color,
    "&.ant-select-item-option-selected": {
      color: theme.thrust5Color,
      background: "none",
      fontWeight: 400,
    },
    "&.ant-select-item-option-active": {
      background: theme.grey3Color,
    },
    "&.ant-select-item-option-disabled": {
      color: theme.grey7Color,
      background: "none",
    },
    ".anticon": {
      paddingLeft: "2px",
      fontSize: "14px",
      color: theme.thrust5Color,
    },
  },

  ".ant-select-dropdown, .ant-dropdown-menu": {
    "&:not(.ant-dropdown-menu-submenu-popup)": {
      boxShadow: "0 2px 8px 0 rgba(71, 71, 71, 0.2)",
      border: `1px solid ${theme.grey4Color}`,
    },
    ".ant-dropdown-menu-item-divider": {
      background: theme.grey4Color,
    },
  },

  ".ant-tabs-nav": {
    ":before": {
      borderBottom: "none !important",
    },
  },

  ".ant-tabs-tab + .ant-tabs-tab": {
    margin: 0,
  },

  ".ant-select-item-option-grouped": {
    paddingLeft: "24px",
  },

  ".ant-select-item-group": {
    cursor: "default",
    fontSize: "12px",
    color: theme.grey7Color,
  },
  // для фикса съезжания кнопки Ок на строку ниже
  ".ant-picker-ok": {
    marginLeft: "6px !important",
  },

  ".ant-table-fixed-header .ant-table-container .ant-table-body": {
    overflowY: "auto !important",
  },

  // Важно, чтобы стиль был глобальным, т.к. строка рендерится в body
  ".row-dragging": {
    backgroundColor: "none", //@table-body-sort-bg
    border: `1px solid ${theme.grey5Color}`,
    zIndex: `${theme.drawerZIndex + 1} !important`, // Фикс для дроверов
  },

  ".ant-message": {
    top: "inherit",
    bottom: 0,
    zIndex: 2000,

    "& .ant-message-custom-content": {
      display: "flex",
    },
  },

  ".ant-picker-suffix": {
    pointerEvents: "unset",
    cursor: "pointer",
  },
});

export const forceDisabledAnimationClassName = "force-disabled-animation";

/**
 * не нужно использовать `!important` это ломает поведение некоторых компонентов
 * (например, список страниц отчета).
 * */
const forceDisabledAnimationStyle = {
  [`.${forceDisabledAnimationClassName}`]: {
    animation: 0,
  },
};

export const globalStyles = (theme: TTheme) => {
  return {
    ...allStyle(theme),
    ...htmlAndBodyStyle(),
    ...rootStyle(),
    ...fixIEBugs(),
    ...fixSafariBugs(),
    ...antGlobalStyle(theme),
    ...forceDisabledAnimationStyle,
  } as unknown as Interpolation<TTheme>;
};
