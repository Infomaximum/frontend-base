import React, { useMemo, type FC } from "react";
// eslint-disable-next-line im/ban-import-entity
import { Tooltip as AntTooltip } from "antd";
import type { ITooltipProps } from "./Tooltip.types";
import { useTheme } from "../../decorators/hooks/useTheme";
import { tooltipOverlayStyle, tooltipOverlayInnerStyle } from "./Tooltip.styles";

const alignDefault = { targetOffset: [0, -2] };

const TooltipComponent: FC<ITooltipProps> = ({
  placement,
  overlayInnerStyle: overlayInnerStyleProp,
  overlayStyle: overlayStyleProp,
  title,
  align = alignDefault,
  removeMouseEnterDelay,
  ...rest
}) => {
  const theme = useTheme();

  const overlayStyle = useMemo(
    () => ({
      ...tooltipOverlayStyle(theme),
      ...overlayStyleProp,
    }),
    [overlayStyleProp, theme]
  );

  const overlayInnerStyle = useMemo(
    () => ({
      ...tooltipOverlayInnerStyle(theme),
      ...overlayInnerStyleProp,
    }),
    [theme, overlayInnerStyleProp]
  );

  return (
    <AntTooltip
      color={theme.grey9Color}
      overlayStyle={overlayStyle}
      overlayInnerStyle={overlayInnerStyle}
      align={align}
      mouseEnterDelay={removeMouseEnterDelay ? undefined : 1.5}
      mouseLeaveDelay={0}
      {...rest}
      title={title}
      placement={placement ?? "topLeft"}
    />
  );
};

export const Tooltip = TooltipComponent;
