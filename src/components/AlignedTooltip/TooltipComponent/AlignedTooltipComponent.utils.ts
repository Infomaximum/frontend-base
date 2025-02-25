import { useState, type RefObject } from "react";
import { useMountEffect } from "../../../decorators";

interface IUseTooltipAlignProps {
  containerRef: RefObject<HTMLDivElement>; // ref контейнера на котором нужно отобразить тултип.
  arrowOffset?: number; // Значение стандартного отступа стрелки тултипа.
  isChangeDirectionCalculationNeeded?: boolean; // Нужно ли менять направление тултипа в зависимости от того, выходит он за пределы или нет.
  textWidth?: number; // Значение ширины текста тултипа в пикселях.
  offsetY?: number; // Значение отступа тултипа по оси Y.
  offsetXProp?: number;
}

const standardArrowOffset = 21;

export const useTooltipAlign = (tooltipParams: IUseTooltipAlignProps) => {
  const {
    containerRef,
    arrowOffset = standardArrowOffset,
    isChangeDirectionCalculationNeeded = false,
    textWidth = 520,
    offsetY = -4,
    offsetXProp = 0,
  } = tooltipParams;

  const [tooltipAlign, setTooltipAlign] = useState({ offset: [0, offsetY] });

  const [isChangeHorizontalDirection, setIsChangeHorizontalDirection] = useState<boolean>(true);

  useMountEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const { left: containerLeft, right: containerRight } =
      containerRef.current?.getBoundingClientRect();

    let offsetX: number;

    const isEnoughSpace = document.body.clientWidth - offsetXProp > textWidth;
    setIsChangeHorizontalDirection(!isEnoughSpace);

    if (isEnoughSpace) {
      offsetX = offsetXProp - containerLeft - arrowOffset;
    } else {
      if (isChangeDirectionCalculationNeeded) {
        const isEnoughSpaceOnLeft =
          document.body.clientWidth - (document.body.clientWidth - offsetXProp) > textWidth;

        if (isEnoughSpaceOnLeft) {
          offsetX = offsetXProp - containerRight + arrowOffset;
        } else {
          // Ситуация, когда ни слева, ни справа не хватает места.
          setIsChangeHorizontalDirection(false);
          offsetX = 0;
        }
      } else {
        offsetX = offsetXProp - containerLeft - arrowOffset;
      }
    }

    setTooltipAlign({ offset: [offsetX, offsetY] });
  });

  return {
    tooltipAlign,
    isChangeHorizontalDirection,
  };
};
