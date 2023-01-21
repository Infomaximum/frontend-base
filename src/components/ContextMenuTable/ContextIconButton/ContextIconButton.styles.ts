import { assignInWith, isNil } from "lodash";
import { HoverAnimationInterval } from "@im/base/src/utils/const";
import type { TCustomContextIconButtonFuncStyle } from "./ContextIconButton.types";

export const defaultButtonStyle = (size: number) => (theme: TTheme) =>
  ({
    margin: `-${theme.tableCellVerticalPadding}px -${theme.tableCellHorizontalPadding}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.grey7Color,
    cursor: "pointer",
    fontSize: `${theme.subtitleFontSize}px`,
    ":hover": {
      backgroundColor: theme.grey4Color,
      color: theme.grey8Color,
    },
    height: `${size}px`,
    width: `${size}px`,
    transition: `${HoverAnimationInterval}ms`,
  } as const);

export const disabledButtonStyle = (theme: TTheme) =>
  customContextIconButtonStyle({
    color: theme.grey6Color,
    hoverBackgroundColor: null,
    hoverColor: null,
    additionalStyles: {
      cursor: "not-allowed",
      ":hover": {},
    },
  });

export const redButtonStyle = (theme: TTheme) =>
  customContextIconButtonStyle({
    color: null,
    hoverBackgroundColor: theme.red2Color,
    hoverColor: theme.red6Color,
  });

/** Функция для генерирования кастомных стилей **/
export const customContextIconButtonStyle: TCustomContextIconButtonFuncStyle =
  ({ color, hoverColor, hoverBackgroundColor, additionalStyles }) =>
  (size) =>
  (theme) => {
    const defaultStyle = {
      ...defaultButtonStyle(size)(theme),
    };

    const paramsStyle = {
      color,
      ":hover": {
        color: hoverColor,
        backgroundColor: hoverBackgroundColor,
      },
      ...additionalStyles,
    };

    return assignInWith(defaultStyle, paramsStyle, (objValue, srcValue) =>
      isNil(srcValue) ? objValue : srcValue
    );
  };
