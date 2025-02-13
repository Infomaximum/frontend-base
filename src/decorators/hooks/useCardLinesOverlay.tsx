import type { Interpolation } from "@emotion/react";
import { useContainerWidth } from "./useContainerWidth";
import { forEach, isEmpty, map } from "lodash";
import { getGradientColorsFromTransparent } from "../../utils/colors";
import { getTextWidth } from "../../utils/textWidth";
import { useMemo } from "react";

/**
 * Получить разбитый на строки текст, который поместится в указанную ширину
 * Перенос осуществляется по буквам
 * @param text - текст, который нужно перенести
 * @param widthLimit - ширина, более которой не может быть подстрока
 * @returns string[] - массив подстрок
 */
const getHyphenatedTextByChar = (text: string, widthLimit: number, fontSize: number): string[] => {
  const result: string[] = [];
  const textLength = text.length;

  let accumulatedLine = "";
  forEach(text, (char, index) => {
    const lineWidth = getTextWidth(`${accumulatedLine}${char}`, {
      size: fontSize,
    });

    if (lineWidth > widthLimit) {
      result.push(accumulatedLine);
      accumulatedLine = char;

      return;
    }

    accumulatedLine += char;

    if (textLength === index + 1) {
      result.push(accumulatedLine);
      accumulatedLine = "";
    }
  });

  return result;
};

/**
 * Получить первые строки текста, который поместится в указанную ширину
 * Перенос осуществляется по пробелам и дефисам, если непрерывное слово не помещается в ширину, то оно перенесется по буквам
 * @param text - текст, который нужно перенести
 * @param widthLimit - ширина, более которой не может быть подстрока
 * @param visibleLinesCount - количество видимых строк
 * @returns string[] - массив подстрок
 */
export const getHyphenatedText = (
  text: string,
  widthLimit: number,
  visibleLinesCount: number,
  fontSize: number
): string[] => {
  const result: string[] = [];
  const fullWidth = getTextWidth(text, {
    size: fontSize,
  });

  if (fullWidth <= widthLimit) {
    // если текст поместился полностью
    result.push(text);

    return result;
  }

  const words = text.split(" ");
  let accumulatedLine = "";

  forEach(words, (word, index) => {
    const dashSplittedList = word.split("-");
    const isLastWord = index + 1 === words.length;
    const postfixArr = word.match(/-/g);

    forEach(dashSplittedList, (dashSplittedWord, hyphenIndex) => {
      if (result.length === visibleLinesCount + 1) {
        return result;
      }

      const isLastDashWord = hyphenIndex + 1 === dashSplittedList.length;
      const postfix = postfixArr?.[hyphenIndex] || "";
      const tempLine = `${
        !isEmpty(accumulatedLine) && hyphenIndex === 0 ? " " : ""
      }${dashSplittedWord}${postfix}`;
      const currentLine = `${accumulatedLine}${tempLine}`;
      const lineWidth = getTextWidth(currentLine, {
        size: fontSize,
      });

      if (lineWidth > widthLimit) {
        if (!isEmpty(accumulatedLine)) {
          // аккумулированная строка не пустая, нужно её добавить в отдельную строку
          if (result.length + 1 === visibleLinesCount) {
            const lastLine = getHyphenatedTextByChar(currentLine, widthLimit, fontSize)[0] || "";
            result.push(lastLine);
          } else {
            result.push(accumulatedLine);
          }

          if (result.length === visibleLinesCount + 1) {
            return result;
          }

          accumulatedLine = tempLine;
        } else {
          // строка пустая, значит наша темповая строка аккумулируется и позже перенесется по буквам
          accumulatedLine = tempLine;
        }

        // переносим по буквам то что теперь аккумулировано
        const hyphenatedByCharList = getHyphenatedTextByChar(accumulatedLine, widthLimit, fontSize);
        const charListItem = hyphenatedByCharList.pop();

        if (charListItem) {
          accumulatedLine = charListItem;
          result.push(...hyphenatedByCharList);

          if (result.length === visibleLinesCount + 1) {
            return result;
          }
        }
        // последнюю подстроку не нужно сразу добавлять в результат
      } else {
        accumulatedLine = `${accumulatedLine}${tempLine}`;
      }

      if (isLastWord && isLastDashWord && !isEmpty(accumulatedLine)) {
        result.push(accumulatedLine);

        if (result.length === visibleLinesCount + 1) {
          return result;
        }
      }
    });
  });

  return result;
};

const getOverlayAfterStyle =
  (isLastLineInArray: boolean): Interpolation<TTheme> =>
  (theme: TTheme) => {
    const { minOpacity, maxOpacity } = getGradientColorsFromTransparent(theme);

    return {
      position: "relative",
      width: "fit-content",
      "&:after": !isLastLineInArray
        ? {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "8px",
            height: "100%",
            backgroundImage: `linear-gradient(to right, ${minOpacity}, ${maxOpacity})`,
          }
        : undefined,
    };
  };

/**
 * Получить первые N строк текста, последняя строка которого будет забледнена в конце, если есть непоместившиеся строкию
 * Перенос осуществляется по пробелам и дефисам, если непрерывное слово не помещается в ширину, то оно перенесется по буквам
 * @param text - текст, который нужно перенести
 * @param paddings - отступы, уменьшающие ширину контейнера
 * @param maxLinesCount - количество видимых строк
 * @param fontSize - размер шрифта для расчетов
 * @param showEllipsis - флаг отображения троеточия в конце вместо забледнения, по умолчанию отображается забледнение
 * @returns string[] - массив подстрок
 */
export const useCardLinesOverlay = (
  text: string | undefined,
  paddings: number,
  maxLinesCount: number,
  fontSize: number,
  outerContainerWidth?: number,
  showEllipsis = false
) => {
  const [containerWidth, setContainerRef] = useContainerWidth();

  const usedWidth = outerContainerWidth ?? containerWidth;

  const lines = useMemo(() => {
    if (!usedWidth || !text) {
      return [];
    }

    return getHyphenatedText(
      text.replace(/\s{2,}/g, " "),
      usedWidth - paddings,
      maxLinesCount,
      fontSize
    );
  }, [fontSize, maxLinesCount, paddings, text, usedWidth]);

  // добавлено ли забледнение, т.е. true если текст не поместился в условия
  const hasOverflow = lines.length > maxLinesCount;

  const overlayedLines = useMemo(() => {
    if (!lines.length) {
      return null;
    }

    return (
      <>
        {map(lines, (line, index) => {
          const isLastLineIntoView = index === maxLinesCount - 1;
          const isLastLineInArray = index === lines.length - 1;

          if (index >= maxLinesCount) {
            return null;
          }

          return isLastLineIntoView ? (
            <div key={index} css={!showEllipsis && getOverlayAfterStyle(isLastLineInArray)}>
              {line}
              {showEllipsis && "..."}
            </div>
          ) : (
            <div key={index}>{line}</div>
          );
        })}
      </>
    );
  }, [lines, maxLinesCount, showEllipsis]);

  return { usedWidth, setContainerRef, overlayedLines, hasOverflow };
};
