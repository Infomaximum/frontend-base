import React, { useMemo, FC } from "react";
// eslint-disable-next-line im/ban-import-entity
import { Tooltip as AntTooltip } from "antd";
import type { ITooltipProps } from "./Tooltip.types";
import { useTheme } from "src/decorators/hooks/useTheme";
import {
  tooltipOverlayStyle,
  tooltipOverlayInnerStyle,
} from "./Tooltip.styles";

const tooltipOffset = [0, 2];
const align = { offset: tooltipOffset };

const Tooltip: FC<ITooltipProps> = ({
  placement,
  overlayInnerStyle: overlayInnerStyleProp,
  overlayStyle: overlayStyleProp,
  title,
  ...rest
}) => {
  const theme = useTheme();

  const overlayStyle = useMemo(
    () => ({
      ...tooltipOverlayStyle,
      ...overlayStyleProp,
    }),
    [overlayStyleProp]
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
      mouseEnterDelay={1.5}
      mouseLeaveDelay={0}
      {...rest}
      title={title}
      placement={placement ?? "topLeft"}
    />
  );
};

export default Tooltip;
