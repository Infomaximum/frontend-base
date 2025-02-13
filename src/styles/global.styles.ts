import { css, type Interpolation } from "@emotion/react";
import { userAgent, EUserAgents } from "@infomaximum/utility";
import { SYSTEM_FONT } from "../utils";

export const SCROLLBAR_WIDTH = 6;
export const SCROLLBAR_HEIGHT = 6;

const fireFoxScrollbarStyle = (theme: TTheme) => ({
  "@supports not selector(::-webkit-scrollbar)": {
    // Стили для Mozilla FireFox. scrollbarWidth: "auto" слишком широкий в Windows, "thin" слишком узкий в Linux и MacOS,
    // а в пикселях ширину скролла для мозиллы задать нельзя. В приоритете OS Windows
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.grey5Color} ${theme.grey1Color}`,
  },
});

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

    ...fireFoxScrollbarStyle(theme),

    ".rc-virtual-list-scrollbar": {
      width: `${SCROLLBAR_WIDTH}px !important`,
      ...scrollDefaultStyle(theme),
    },

    ".CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scroll, .rc-virtual-list-holder": {
      ...scrollDefaultStyle(theme),
      ...fireFoxScrollbarStyle(theme),
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
  "#root": css`
    height: 100vh;
    height: 100dvh;
  `,
});

const allStyle = (theme: TTheme) => ({
  "*": {
    fontFamily: SYSTEM_FONT,
    ...scrollStyle(theme),
  },
});

const htmlAndBodyStyle = () => ({
  "html,body": [
    css`
      height: 100vh;
      height: 100dvh;
    `,
    {
      margin: 0,
      fontFamily: SYSTEM_FONT,
      overflow: "hidden",
    },
  ],
});

const fixSafariBugsStyle = () => {
  const isSafari = userAgent() === EUserAgents.Safari;

  if (!isSafari) {
    return {};
  }

  return {
    ".ant-layout-content": {
      height: "100%",
    },
    "*::-webkit-contacts-auto-fill-button": {
      width: 0,
      height: 0,
      margin: 0,
    },
  };
};

const antGlobalStyle = (theme: TTheme) => {
  return {
    ".ant-popover .ant-popover-inner": {
      padding: "12px 16px",
    },
    ".ant-tooltip .ant-tooltip-arrow": {
      height: "16px",
      // Для корректной работы при разных масштабах окна браузера
      bottom: "1px",
      ".ant-tooltip-arrow-content": {
        // Фикс обводки в Mozilla Firefox
        overflow: "hidden",
      },
      "::before": {
        height: "5px",
      },
    },
    ".ant-upload-wrapper .ant-upload-list::before": {
      content: "none",
    },
    ".ant-upload-wrapper .ant-upload-list::after": {
      content: "none",
    },
    ".ant-upload-wrapper .ant-upload-list .ant-upload-list-item-container::before": {
      content: "none",
    },
    ".ant-upload-wrapper .ant-upload-list .ant-upload-list-item-container": {
      transition: "opacity 0.1s, height 0.1s",
    },
    ".ant-select-disabled .ant-select-selection-placeholder": {
      color: theme.grey7Color,
    },
    ".ant-select-item-option-content": {
      textOverflow: "unset",
    },
    ".ant-select-selector": {
      color: theme.grey10Color,
      "& .ant-select-selection-item": {
        color: theme.grey10Color,
      },
    },
    ".ant-dropdown-menu-inline-collapsed-tooltip": { display: "none" },
    ".ant-select-item": {
      color: theme.grey10Color,
      padding: "3px 8px !important",
      "&.ant-select-item-option-active": {
        background: theme.grey3Color,
        "&.ant-select-item-option-selected": {
          "&:hover": {
            background: theme.grey3Color,
          },
        },
      },
      "&.ant-select-item-option-disabled": {
        color: theme.grey6Color,
        background: "none",
      },
      ".anticon": {
        paddingLeft: "2px",
        fontSize: "14px",
        color: theme.thrust5Color,
      },
    },
    // При layout = vertical у формы создаётся этот selector, который имеет большую специфичность,
    // по сравнению с обычными селекторами label. Приходится перезаписывать некоторые свойства.
    ".ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-form-item-label": {
      paddingBottom: 0,
      "&>label": {
        height: "28px",
      },
    },

    ".ant-select-item-option.ant-select-item-option-disabled": {
      "::after": {
        content: "none",
      },
    },
    ".ant-select-item-option.ant-select-item-option-active": {
      "::after": {
        background: "none",
      },
    },
    ".ant-select-item-option-state": {
      zIndex: 10,
    },
    ".ant-select-dropdown, .ant-dropdown-menu": {
      "&:not(.ant-dropdown-menu-submenu-popup)": {
        boxShadow: "0px 2px 8px 0px rgba(113, 113, 113, 0.2)",
        border: `1px solid ${theme.grey4Color}`,
        padding: "4px 0",
      },
      ".ant-dropdown-menu-item-divider": {
        background: theme.grey4Color,
      },
      ".ant-select-item-empty": {
        padding: "3px 7px",
      },
    },
    ".ant-dropdown-menu-submenu-title": {
      paddingRight: "28px !important",
    },

    ".ant-tabs-nav": {
      ":before": {
        borderBottom: "none !important",
      },
    },

    ".ant-tabs-tab + .ant-tabs-tab": {
      margin: "0 !important",
    },

    ".ant-select-item-option-grouped": {
      paddingLeft: "16px !important",
    },

    ".ant-select-dropdown .ant-select-item-group": {
      cursor: "default",
      fontSize: "12px",
      color: `${theme.grey7Color} !important`,
      lineHeight: "22px",
    },

    ".ant-table-fixed-header .ant-table-container .ant-table-body": {
      overflowY: "auto !important",
    },

    ".ant-table-wrapper ": {
      ".ant-table": { scrollbarColor: "unset" },
      ".ant-table-column-sorter-up, .ant-table-column-sorter-down": {
        fontSize: "11px",
        color: theme.grey6Color,
      },
    },
    ".ant-empty .ant-empty-description": {
      color: theme.grey6Color,
    },
    // Важно, чтобы стиль был глобальным, т.к. строка рендерится в body
    ".row-dragging": {
      backgroundColor: "none", // @table-body-sort-bg
      border: `1px solid ${theme.grey5Color}`,
      zIndex: `${theme.drawerZIndex + 1} !important`, // Фикс для дроверов
    },

    ".ant-message": {
      top: "inherit !important",
      padding: "0px 16px 16px 0px",
      bottom: 0,
      zIndex: 2000,

      "& .ant-message-custom-content": {
        display: "flex",
        alignItems: "flex-start",
        "& > .anticon": {
          paddingTop: "2px",
        },
      },
      " .ant-message-notice-wrapper .ant-message-notice-content": {
        borderRadius: "4px",
      },
    },

    ".ant-picker-suffix": {
      pointerEvents: "unset",
      cursor: "pointer",
    },

    ".ant-picker-input": {
      input: {
        "::placeholder": {
          textOverflow: "unset",
        },
      },
    },

    ".ant-select-focused.ant-select-outlined:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-select-status-error) .ant-select-selector":
      {
        boxShadow: "0px 0px 4px 0px rgba(117, 170, 235, 0.5) !important",
        borderRadius: "2px",
      },

    ".ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title": {
      color: `${theme.grey10Color}`,

      svg: {
        color: `${theme.grey7Color} !important`,
      },
    },

    ".ant-dropdown-menu-submenu-arrow-icon": {
      fontSize: "10px !important",
    },

    ".ant-drawer": {
      ":focus-visible": {
        outline: "none",
      },
    },

    ".ant-checkbox": {
      ".ant-checkbox-input, .ant-checkbox-inner": {
        width: "16px",
        height: "16px",
      },
    },
    ".ant-checkbox-checked .ant-checkbox-inner:after": {
      width: "6px",
      height: "10px",
    },
    ".ant-switch:focus-visible, .ant-btn:not(:disabled):focus-visible": {
      outline: "none",
    },
    ".ant-picker-dropdown .ant-picker-time-panel-column": {
      scrollbarWidth: "unset",
      scrollbarColor: "unset",
      ...scrollStyle(theme),
    },
  };
};

export const forceDisabledAnimationClassName = "force-disabled-animation";

/**
 * не нужно использовать `!important` это ломает поведение некоторых компонентов
 * (например, список страниц отчета).
 */
const forceDisabledAnimationStyle = {
  [`.${forceDisabledAnimationClassName}`]: {
    animationDuration: "0.00001s",
  },
};

export const globalStyles = (theme: TTheme) => {
  return {
    ...allStyle(theme),
    ...htmlAndBodyStyle(),
    ...rootStyle(),
    ...fixSafariBugsStyle(),
    ...antGlobalStyle(theme),
    ...forceDisabledAnimationStyle,
  } as unknown as Interpolation<TTheme>;
};
