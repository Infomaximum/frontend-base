import React, { useMemo, type FC } from "react";
// eslint-disable-next-line im/ban-import-entity
import { Tooltip as AntTooltip } from "antd";
import type { ITooltipProps } from "./Tooltip.types";
import { useTheme } from "../../decorators/hooks/useTheme";
import { tooltipOverlayStyle, tooltipOverlayInnerStyle } from "./Tooltip.styles";

const alignDefault = { targetOffset: [0, -2] };

const TooltipComponent: FC<ITooltipProps> = ({
  placement,
  title,
  align = alignDefault,
  removeMouseEnterDelay,
  styles: stylesProp,
  ...rest
}) => {
  const theme = useTheme();

  const styles = useMemo(() => {
    const { root, body, ...rest } = stylesProp ?? {};

    return {
      body: {
        ...tooltipOverlayInnerStyle(theme),
        ...body,
      },
      root: {
        ...tooltipOverlayStyle(theme),
        ...root,
      },
      ...rest,
    };
  }, [stylesProp, theme]);

  return (
    <AntTooltip
      color={theme.grey9Color}
      styles={styles}
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
