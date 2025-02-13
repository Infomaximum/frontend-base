import { assignInWith, isNil } from "lodash";
import { HoverAnimationInterval } from "../../../utils/const";
import type { TCustomContextIconButtonFuncStyle } from "./ContextIconButton.types";

export const getDefaultButtonStyle = (size: number) => (theme: TTheme) =>
  ({
    margin: `-${theme.tableCellVerticalPadding}px -${theme.tableCellHorizontalPadding}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.grey7Color,
    cursor: "pointer",
    fontSize: `${theme.subtitleFontSize}px`,
    ":hover": {
      backgroundColor: theme.grey45Color,
      color: theme.grey7Color,
    },
    height: `${size}px`,
    width: `${size}px`,
    transition: `${HoverAnimationInterval}ms`,
  }) as const;

export const disabledButtonStyle = (theme: TTheme) =>
  getCustomContextIconButtonStyle({
    color: theme.grey6Color,
    hoverBackgroundColor: null,
    hoverColor: null,
    additionalStyles: {
      cursor: "not-allowed",
      ":hover": {},
    },
  });

export const redButtonStyle = (theme: TTheme) =>
  getCustomContextIconButtonStyle({
    color: null,
    hoverBackgroundColor: theme.red2Color,
    hoverColor: theme.red6Color,
  });

/** Функция для генерирования кастомных стилей */
export const getCustomContextIconButtonStyle: TCustomContextIconButtonFuncStyle =
  ({ color, hoverColor, hoverBackgroundColor, additionalStyles }) =>
  (size) =>
  (theme) => {
    const defaultStyle = {
      ...getDefaultButtonStyle(size)(theme),
    };

    const paramsStyle = {
      color,
      ":hover": {
        color: hoverColor,
        backgroundColor: hoverBackgroundColor,
      },
      ...(additionalStyles as Record<string, any>),
    };

    return assignInWith(defaultStyle, paramsStyle, (objValue, srcValue) =>
      isNil(srcValue) ? objValue : srcValue
    );
  };
