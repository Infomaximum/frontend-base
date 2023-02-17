import { last, range, sum } from "lodash";

// todo: вынести в утилиты платформы
export const getTextWidth = (() => {
  const context = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;

  return (text: string, fontSize: number) => {
    context.font = `${fontSize}px 'Roboto'`;

    return context.measureText(text).width;
  };
})();

/** interleaveWith(() => 0, [1,1,1]) == [1,0,1,0,1] */
export function interleaveWith<T>(createPlaceholder: (i: number) => T, items: T[]) {
  return items.flatMap((item, i) => (item === last(items) ? [item] : [item, createPlaceholder(i)]));
}

/**
 * Вычислить маску сжатия: если true, то элемент по данному индексу можно сжимать.
 * Функция стремится пометить сжимаемыми как можно меньшее число элементов.
 */
export function calcShrinkMask(widths: number[], maxTotalWidth: number, minWidth: number) {
  const indexes = range(widths.length);

  for (let shrinkCount = 1; shrinkCount <= widths.length; shrinkCount++) {
    const foundComb = findComb(indexes, shrinkCount, (comb) => {
      const compressedWidths = widths.map((width, i) => (comb.includes(i) ? minWidth : width));
      return sum(compressedWidths) <= maxTotalWidth;
    });

    if (foundComb) {
      return widths.map((_, i) => foundComb.includes(i));
    }
  }

  return widths.map(() => true);
}

/** Найти сочетание по предикату */
function findComb<T>(items: T[], combSize: number, predicate: (comb: T[]) => boolean) {
  for (const comb of generateCombs(items, combSize)) {
    if (predicate(comb)) {
      return comb;
    }
  }
}

/** Сгенерировать сочетания */
function* generateCombs<T>(items: T[], combSize: number): Iterable<T[]> {
  if (combSize < 1) {
    yield [];
    return;
  }

  for (let i = 0; i <= items.length - combSize; i++) {
    const restItems = items.slice(i + 1, items.length);

    for (const comb of generateCombs(restItems, combSize - 1)) {
      yield [items[i] as T, ...comb];
    }
  }
}
