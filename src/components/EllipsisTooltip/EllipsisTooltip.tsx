import { FC, memo, useMemo, cloneElement, isValidElement } from "react";
import { ellipsisTextWrapper, ellipsisStyleForSafari } from "./EllipsisTooltip.styles";
import type { IEllipsisTooltipProps } from "./EllipsisTooltip.types";
import { Tooltip } from "../Tooltip/Tooltip";
import { EUserAgents, userAgent } from "@im/utils";

const isSafari = userAgent() === EUserAgents.Safari;

const EllipsisTooltipComponent: FC<IEllipsisTooltipProps> = ({
  children,
  title,
  placement,
  customTextWrapperStyle,
  ...rest
}) => {
  const css = [customTextWrapperStyle, isSafari ? ellipsisStyleForSafari : null];
  const clearTitle = useMemo(() => {
    /** Если это элемент, то нужно убрать некоторые стили которые были добавлены */
    if (isValidElement(title)) {
      return cloneElement(title, {
        css: null,
        style: null,
      } as any);
    }

    return title;
  }, [title]);

  return (
    <div style={ellipsisTextWrapper} css={css}>
      <Tooltip title={clearTitle ?? children} placement={placement} {...rest}>
        {children}
      </Tooltip>
    </div>
  );
};

export const EllipsisTooltip = memo(EllipsisTooltipComponent);
