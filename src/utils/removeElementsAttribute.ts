import { forEach, isEmpty } from "lodash";
import { type HTMLAttributes } from "react";

export const removeElementsAttribute = (
  targetNode: HTMLDivElement,
  selectorList = ["span.ant-select-selection-item", "div.ant-select-item-group"],
  removableAttribute: keyof HTMLAttributes<HTMLElement> = "title"
) => {
  const elementList: Element[] = [];

  forEach(selectorList, (selector) => {
    const descendantElementList = targetNode.querySelectorAll(selector);

    if (!isEmpty(descendantElementList)) {
      elementList.push(...Array.from(descendantElementList));
    }
  });

  forEach(elementList, (element) => {
    if (element.hasAttribute(removableAttribute)) {
      element.removeAttribute(removableAttribute);
    }
  });
};
