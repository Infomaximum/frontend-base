import type { DropdownProps } from "antd";
import { constant, isFunction, last, lowerFirst, mapValues, words } from "lodash";
import React, { type RefObject, useCallback, useState } from "react";
import type {
  IDropdownParams,
  IDropdownProps,
  IDropdownSizeParams,
  IFreeSpace,
  TXPlacement,
  TDropdownPositionResult,
} from "./Dropdown.types";

export const defaultTrigger = ["click"] as ["click"];

export const defaultVisibleMaxCount = 14.5;
const shrinkK = 7.5 / defaultVisibleMaxCount;

export function createTopAlignConfig(
  targetGap: number,
  xPlacement: TXPlacement
): DropdownProps["align"] {
  return {
    points: [`b${xPlacement[0]}`, `t${xPlacement[0]}`],
    offset: [0, -targetGap],
    overflow: { adjustX: true, adjustY: false },
  };
}

export function createBottomAlignConfig(
  targetGap: number,
  xPlacement: TXPlacement
): DropdownProps["align"] {
  return {
    points: [`t${xPlacement[0]}`, `b${xPlacement[0]}`],
    offset: [0, targetGap],
    overflow: { adjustX: true, adjustY: false },
  };
}

export function extractXPlacement(placement: IDropdownProps["placement"]): TXPlacement {
  const xPlacement = lowerFirst(last(words(placement)));

  switch (xPlacement) {
    case "left":
      return "left";
    case "right":
      return "right";
    default:
      return "center";
  }
}

export function getDropdownMenuMaxHeight({
  itemHeight = 28,
  visibleMaxCount = defaultVisibleMaxCount,
  padding = 4,
}: IDropdownSizeParams) {
  return itemHeight * visibleMaxCount + padding * 2;
}

export function useDropdownPosition(
  targetRef: RefObject<HTMLElement>,
  dropdownParams: IDropdownParams,
  xPlacement: TXPlacement
): TDropdownPositionResult {
  const { targetGap = 4, ...sizeParams } = dropdownParams ?? {};

  const maxHeight = getDropdownMenuMaxHeight(sizeParams);

  const [actualMaxHeight, setActualMaxHeight] = useState<number | undefined>(maxHeight);
  const [align, setAlign] = useState<DropdownProps["align"]>();

  const compute = useCallback(
    (getPopupContainer: (t: HTMLElement) => HTMLElement = constant(document.body)) => {
      const target = targetRef.current;

      if (!target) {
        return;
      }

      const popupContainer = getPopupContainer(target);

      const containerGap = 8;
      const freeSpace = mapValues(defineDropdownFreeSpace(target, popupContainer), (n) =>
        Math.floor(n - targetGap - containerGap)
      );

      const isAbove = shouldDropdownBeAbove(freeSpace, maxHeight);
      const actualMaxHeight = Math.min(isAbove ? freeSpace.top : freeSpace.bottom, maxHeight);

      setActualMaxHeight(actualMaxHeight);
      setAlign(
        isAbove
          ? createTopAlignConfig(targetGap, xPlacement)
          : createBottomAlignConfig(targetGap, xPlacement)
      );
    },
    [targetRef, maxHeight, targetGap, xPlacement]
  );

  return { height: actualMaxHeight, align, compute } as const;
}

/** Должен ли Dropdown находиться над целевым элементом */
function shouldDropdownBeAbove(freeSpace: IFreeSpace, maxHeight: number) {
  return freeSpace.bottom < shrinkK * maxHeight && freeSpace.top > freeSpace.bottom;
}

/** Определить, сколько свободного места для рисования Dropdown под и над целевым элементом */
function defineDropdownFreeSpace(target: Element, container: HTMLElement): IFreeSpace {
  const targetRect = target.getBoundingClientRect();

  const containerTopBound = defineContainerTopBound(container);
  const containerBottomBound = containerTopBound + container.offsetHeight;

  return {
    top: targetRect.top - containerTopBound,
    bottom: containerBottomBound - targetRect.bottom,
  };
}

/**
 * Получить верхнюю усеченную позицию контейнера на странице (наивысшая позиция, в которой может
 * быть отображен Dropdown)
 */
function defineContainerTopBound(container: HTMLElement) {
  const parentTop =
    container.offsetParent instanceof Element
      ? container.offsetParent.getBoundingClientRect().top
      : 0;

  return parentTop + container.offsetTop;
}

/** Передать ref в элемент, не сломав уже существующий ref */
export function injectRef<T extends Element>(
  element: React.ReactElement,
  injectedRef: React.MutableRefObject<T | null>
) {
  return React.cloneElement(element, {
    ref(node: T) {
      injectedRef.current = node;

      const ref: React.MutableRefObject<Element> = (element as any).ref;

      if (!ref) {
        return;
      }

      if (isFunction(ref)) {
        ref(node);
      } else {
        ref.current = node;
      }
    },
  });
}
