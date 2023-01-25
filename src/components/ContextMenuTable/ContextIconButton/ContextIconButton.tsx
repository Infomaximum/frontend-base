import React, { useCallback, useMemo } from "react";
import type { IEditableRowButtonProps } from "./ContextIconButton.types";
import {
  defaultButtonStyle,
  redButtonStyle,
  disabledButtonStyle,
} from "./ContextIconButton.styles";
import { useTheme } from "../../../decorators/hooks/useTheme";
import Tooltip from "../../Tooltip/Tooltip";

export enum EContextIconButtonColors {
  DEFAULT = "DEFAULT",
  RED = "RED",
}

/** Иконка отображаемая вместо контекстного меню в таблицах */
const ContextIconButton: React.FC<IEditableRowButtonProps> & {
  colors: typeof EContextIconButtonColors;
} = ({
  color,
  icon,
  onClick,
  disabled,
  clickHandlerData,
  size: sizeProp,
  title,
  customStyle,
  ...rest
}) => {
  const theme = useTheme();
  const size = sizeProp ?? theme.commonTableRowHeight;

  const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.stopPropagation();
      if (typeof onClick === "function") {
        onClick(clickHandlerData);
      }
    },
    [onClick, clickHandlerData]
  );

  const buttonStyle = useMemo(() => {
    const { RED, DEFAULT } = EContextIconButtonColors;

    if (disabled) {
      return disabledButtonStyle(theme)(size);
    }

    const styleFromColor = {
      [RED]: redButtonStyle(theme)(size),
      [DEFAULT]: defaultButtonStyle(size),
    };

    return (
      customStyle?.(theme)?.(size) ??
      (color ? styleFromColor[color] : null) ??
      styleFromColor[DEFAULT]
    );
  }, [disabled, size, customStyle, theme, color]);

  return (
    <Tooltip title={!disabled ? title : undefined}>
      <div
        css={buttonStyle}
        onClick={!disabled ? handleClick : undefined}
        {...rest}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

ContextIconButton.colors = EContextIconButtonColors;

ContextIconButton.defaultProps = {
  color: ContextIconButton.colors.DEFAULT,
};

export default ContextIconButton;
