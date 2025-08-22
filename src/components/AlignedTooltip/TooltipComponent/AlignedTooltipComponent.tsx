import { useLayoutEffect, useMemo, useState, type FC } from "react";
import { isFunction } from "lodash";
import type { IAlignedTooltipComponentProps } from "./AlignedTooltipComponent.types";
import { useFirstMountState, useTheme } from "@infomaximum/base/src/decorators";
import { getTextValueOfReactNode, getTextWidth } from "@infomaximum/base/src/utils/textWidth";
import { useTooltipAlign, useTooltipLines } from "./AlignedTooltipComponent.utils";
import { Tooltip } from "@infomaximum/base/src/components/Tooltip/Tooltip";

export const AlignedTooltipComponent: FC<IAlignedTooltipComponentProps> = ({
  title,
  offsetY,
  visible,
  removeMouseEnterDelay,
  offsetX,
  containerRef,
  numberOfLines,
  show = false,
}) => {
  const theme = useTheme();
  const isFirstRender = useFirstMountState();

  const [titleText, setTitleText] = useState(
    (isFunction(title) ? title() : title) ?? containerRef.current?.innerText
  );

  useLayoutEffect(() => {
    const timer = setTimeout(
      () => setTitleText((isFunction(title) ? title() : title) ?? containerRef.current?.innerText),
      10
    );

    return () => clearTimeout(timer);
  }, [title, containerRef]);

  // текстовое значение тултипа
  const textValue = getTextValueOfReactNode(titleText);

  const hasOverflow = useMemo(() => {
    if (containerRef.current && textValue) {
      const elementForStyleComputing = containerRef.current.firstElementChild
        ? containerRef.current.firstElementChild
        : containerRef.current;
      const computedStyles = window.getComputedStyle(elementForStyleComputing, null);
      const fontSize = computedStyles.getPropertyValue("font-size").replace("px", "");
      const family = computedStyles.getPropertyValue("font-family");
      const weight = computedStyles.getPropertyValue("font-weight");

      // доступная для текста ширина контейнера
      const availableWidth = containerRef.current.getBoundingClientRect().width * numberOfLines;
      // ширина занимаемая всем текстом
      const allTextWidth = getTextWidth(textValue, {
        size: Number(fontSize),
        family,
        weight,
      });

      return !!(availableWidth && allTextWidth && availableWidth < allTextWidth);
    }

    return true;
  }, [containerRef, numberOfLines, textValue]);

  // ноды уже разбитых строк и значение максимально широкой строки
  const { maxLineWidth, tooltipLines } = useTooltipLines(textValue, 20, theme.h5FontSize);

  const { tooltipAlign, isChangeHorizontalDirection } = useTooltipAlign({
    containerRef,
    isChangeDirectionCalculationNeeded: true,
    textWidth: maxLineWidth,
    offsetY,
    offsetXProp: offsetX,
  });

  const triggerProps = useMemo(() => {
    return {
      getTriggerDOMNode: () => containerRef.current,
    };
  }, [containerRef]);

  return (
    <Tooltip
      title={tooltipLines}
      align={tooltipAlign}
      // Смена направления стандартного отображения в зависимости от того, хватает места или нет
      placement={isChangeHorizontalDirection ? "topRight" : undefined}
      destroyTooltipOnHide={true}
      open={!isFirstRender && visible && (show || hasOverflow)}
      removeMouseEnterDelay={removeMouseEnterDelay}
      {...triggerProps}
    />
  );
};
