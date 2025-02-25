import { useLayoutEffect, useMemo, useState, type FC } from "react";
import { isFunction } from "lodash";
import type { IAlignedTooltipComponentProps } from "./AlignedTooltipComponent.types";
import { useFirstMountState, useTheme } from "../../../decorators";
import { getTextWidthOfReactNode } from "../../../utils/textWidth";
import { useTooltipAlign } from "./AlignedTooltipComponent.utils";
import { Tooltip } from "../../Tooltip/Tooltip";

export const AlignedTooltipComponent: FC<IAlignedTooltipComponentProps> = ({
  title,
  offsetY,
  visible,
  removeMouseEnterDelay,
  offsetX,
  containerRef,
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

  const textWidthOfReactNode = getTextWidthOfReactNode(titleText, { size: theme.h5FontSize });
  const textWidthOfTooltip = textWidthOfReactNode
    ? Math.min(theme.maxTooltipWidth, textWidthOfReactNode)
    : undefined;

  const { tooltipAlign, isChangeHorizontalDirection } = useTooltipAlign({
    containerRef,
    isChangeDirectionCalculationNeeded: true,
    textWidth: textWidthOfTooltip,
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
      title={titleText}
      align={tooltipAlign}
      // Смена направления стандартного отображения в зависимости от того, хватает места или нет
      placement={isChangeHorizontalDirection ? "topRight" : undefined}
      destroyTooltipOnHide={true}
      open={!isFirstRender && visible}
      removeMouseEnterDelay={removeMouseEnterDelay}
      {...triggerProps}
    />
  );
};
