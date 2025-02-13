import { useLayoutEffect, useRef, useState, type FC } from "react";
import { useTheme } from "../../decorators";
import { Tooltip } from "../Tooltip";
import type { IAlignedTooltipProps } from "./AlignedTooltip.types";
import {
  getAlignedTooltipStyle,
  wrapperStyle,
  getExpandByParentStyle,
} from "./AlignedTooltip.styles";
import { useTooltipAlign } from "../../decorators/hooks/useTooltipAlign";
import { getTextWidthOfReactNode } from "../../utils/textWidth";
import { isFunction } from "lodash";

/**
 * Тултип, который смещается по оси X, чтобы отобразиться около курсора.
 * Настройка позиционирования доступна только по оси Y.
 * Зашиты стили троеточия и есть возможность установки троеточия для теста из нескольких строк с указанием numberOfLines.
 * Текст для тултипа берется из пропса либо из ребенка.
 * Необходимо использовать для строк с текстом. Для кнопок используется обычный Tooltip.
 *
 * @examples
 * Кастомное позиционирование по оси Y
 * const offsetY = 10;
 *
 * <AlignedTooltip offsetY={offsetY} title={hasOverflow ? connectionName : undefined}>
 *   {children}
 * </AlignedTooltip>
 *
 */

export const AlignedTooltip: FC<IAlignedTooltipProps> = ({
  title,
  children,
  className,
  offsetY,
  numberOfLines = 1,
  customStyle,
  expandByParent = true,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapper = document.body as HTMLDivElement;

  const [titleText, setTitleText] = useState(
    (isFunction(title) ? title() : title) ?? containerRef.current?.innerText
  );

  useLayoutEffect(() => {
    const timer = setTimeout(
      () => setTitleText((isFunction(title) ? title() : title) ?? containerRef.current?.innerText),
      10
    );

    return () => clearTimeout(timer);
  }, [title, containerRef, children]);

  const textWidthOfReactNode = getTextWidthOfReactNode(titleText, { size: theme.h5FontSize });
  const textWidthOfTooltip = textWidthOfReactNode
    ? Math.min(theme.maxTooltipWidth, textWidthOfReactNode)
    : undefined;

  const {
    tooltipAlign,
    updateOffsetX,
    handleOpenChange,
    isChangeHorizontalDirection,
    handleWheel,
    handleMouseLeave,
  } = useTooltipAlign({
    containerRef,
    wrapper,
    isChangeDirectionCalculationNeeded: true,
    textWidth: textWidthOfTooltip,
    offsetY,
  });

  return (
    <div
      css={[wrapperStyle, getExpandByParentStyle(expandByParent), customStyle]}
      className={className}
    >
      <Tooltip
        css={[getAlignedTooltipStyle(numberOfLines), getExpandByParentStyle(expandByParent)]}
        title={titleText}
        align={tooltipAlign}
        onOpenChange={handleOpenChange}
        // Смена направления стандартного отображения в зависимости от того, хватает места или нет
        placement={isChangeHorizontalDirection ? "topRight" : undefined}
        destroyTooltipOnHide={true}
      >
        <div
          ref={containerRef}
          onMouseMove={updateOffsetX}
          onMouseOver={updateOffsetX}
          onWheel={handleWheel}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </Tooltip>
    </div>
  );
};
