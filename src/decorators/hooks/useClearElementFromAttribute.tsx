import { HTMLAttributes, useEffect, useRef } from "react";

type TParamsType<T extends HTMLElement> = {
  selector: string;
  removableAttribute: keyof HTMLAttributes<T>;
};

export const useClearElementFromAttribute = <T extends HTMLElement>({
  selector,
  removableAttribute,
}: TParamsType<T>) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current?.querySelector?.(selector);

    const observer = new MutationObserver(() => {
      if (element?.hasAttribute(removableAttribute)) {
        element.removeAttribute(removableAttribute);
      }
    });

    if (element) {
      observer.observe(element, {
        attributeFilter: [removableAttribute],
        attributes: true,
      });
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref };
};
