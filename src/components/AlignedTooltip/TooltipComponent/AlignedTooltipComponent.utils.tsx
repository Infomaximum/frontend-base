import { useMemo, useState, type RefObject } from "react";
import { useMountEffect, useTheme } from "../../../decorators";
import { getHyphenatedText } from "../../../decorators/hooks/useCardLinesOverlay";
import { map, max, trimStart } from "lodash";
import { getTextWidth } from "../../../utils/textWidth";

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
  const theme = useTheme();

  const {
    containerRef,
    arrowOffset = standardArrowOffset,
    isChangeDirectionCalculationNeeded = false,
    textWidth = theme.maxTooltipWidth,
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

/**
 * Получить первые N строк текста, последняя строка которого будет забледнена в конце, если есть непоместившиеся строкию
 * Перенос осуществляется по пробелам и дефисам, если непрерывное слово не помещается в ширину, то оно перенесется по буквам
 * @param text - текст, который нужно перенести
 * @param paddings - отступы, уменьшающие ширину контейнера
 * @param maxLinesCount - количество видимых строк
 * @param fontSize - размер шрифта для расчетов
 * @returns string[] - массив подстрок
 */
export const useTooltipLines = (
  text: string | undefined,
  paddings: number,
  fontSize: number,
  maxLinesCount: number = 1000
) => {
  const theme = useTheme();

  const lines = useMemo(() => {
    if (!text) {
      return [];
    }

    return getHyphenatedText(
      text.replace(/\s{2,}/g, " "),
      theme.maxTooltipWidth - paddings,
      maxLinesCount,
      fontSize
    );
  }, [fontSize, maxLinesCount, paddings, text, theme.maxTooltipWidth]);

  const maxLineWidth = useMemo(
    () => max(lines.map((text) => getTextWidth(text, { size: fontSize }))),
    [fontSize, lines]
  );

  const tooltipLines = useMemo(() => {
    if (!lines.length) {
      return null;
    }

    return (
      <>
        {map(lines, (line, index) => {
          if (index >= maxLinesCount) {
            return null;
          }

          return <div key={index}>{trimStart(line)}</div>;
        })}
      </>
    );
  }, [lines, maxLinesCount]);

  return { maxLineWidth, tooltipLines };
};
