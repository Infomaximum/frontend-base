import { noop } from "lodash";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Original repo https://github.com/jaredLunde/react-hook
 */

/**
 * 
        MIT License

        Copyright (c) 2019 Jared Lunde

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
 */

type TUseResizeObserverCallback = (entry: ResizeObserverEntry, observer: ResizeObserver) => void;

const useStoredCallback = (current: TUseResizeObserverCallback) => {
  const storedValue = useRef(current);

  useEffect(() => {
    storedValue.current = current;
  });

  return storedValue;
};

const createResizeObserver = () => {
  let isTicking = false;
  let allEntries: ResizeObserverEntry[] = [];

  const callbacks: Map<Element | undefined, Array<TUseResizeObserverCallback>> = new Map();

  const observer = new ResizeObserver((entries: ResizeObserverEntry[], obs: ResizeObserver) => {
    allEntries = allEntries.concat(entries);

    if (!isTicking) {
      requestAnimationFrame(() => {
        const triggered = new Set<Element | undefined>();

        for (let i = 0; i < allEntries.length; i++) {
          const observerEntry = allEntries[i];

          if (triggered.has(observerEntry?.target)) {
            continue;
          }

          if (observerEntry) {
            triggered.add(observerEntry.target);
            const cbs = callbacks.get(observerEntry.target);
            cbs?.forEach((cb) => cb(observerEntry, obs));
          }
        }

        allEntries = [];
        isTicking = false;
      });
    }

    isTicking = true;
  });

  return {
    observer,
    subscribe(target: Element, callback: TUseResizeObserverCallback) {
      observer.observe(target);
      const cbs = callbacks.get(target) ?? [];
      cbs.push(callback);
      callbacks.set(target, cbs);
    },
    unsubscribe(target: Element, callback: TUseResizeObserverCallback) {
      const cbs = callbacks.get(target) ?? [];

      if (cbs.length === 1) {
        observer.unobserve(target);
        callbacks.delete(target);

        return;
      }

      const cbIndex = cbs.indexOf(callback);

      if (cbIndex !== -1) {
        cbs.splice(cbIndex, 1);
      }

      callbacks.set(target, cbs);
    },
  };
};

let _resizeObserver: ReturnType<typeof createResizeObserver>;

const getResizeObserver = () =>
  !_resizeObserver ? (_resizeObserver = createResizeObserver()) : _resizeObserver;

export function useResizeObserver(
  targetElement: React.RefObject<HTMLElement> | HTMLElement | null,
  callback: TUseResizeObserverCallback
): ResizeObserver {
  const resizeObserver = getResizeObserver();
  const storedCallback = useStoredCallback(callback);

  useLayoutEffect(() => {
    let didUnsubscribe = false;
    const element =
      targetElement && "current" in targetElement ? targetElement.current : targetElement;

    if (!element) {
      return noop;
    }

    function cb(observerEntry: ResizeObserverEntry, observer: ResizeObserver) {
      if (didUnsubscribe) {
        return;
      }

      storedCallback.current(observerEntry, observer);
    }

    resizeObserver.subscribe(element, cb);

    return () => {
      didUnsubscribe = true;
      resizeObserver.unsubscribe(element, cb);
    };
  }, [targetElement, resizeObserver, storedCallback]);

  return resizeObserver.observer;
}
