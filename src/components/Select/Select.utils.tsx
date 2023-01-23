import React, { ReactElement, ReactNode, RefObject, useEffect } from "react";
import Select from "./Select";
import Tooltip from "src/components/Tooltip/Tooltip";
import {
  find,
  has,
  isArray,
  isEmpty,
  isNil,
  isNumber,
  isString,
  map,
} from "lodash";
import { textWrapperStyle } from "./Select.styles";
import { useDropdownPosition } from "src/components/Dropdown/Dropdown.utils";
import type {
  DefaultOptionType,
  LabeledValue,
  SelectValue,
} from "antd/lib/select";
import type {
  IDropdownParams,
  TXPlacement,
} from "src/components/Dropdown/Dropdown.types";
import { globalScrollBehavior } from "src/utils/ScrollBehavior/ScrollBehavior";
import type { BaseSelectRef } from "rc-select";

export const replaceBrowserTooltip = (children: React.ReactNode) =>
  React.Children.map(children, (element) => {
    if (
      !React.isValidElement(element) ||
      (element.type !== Select.Option && element.type !== Select.OptGroup)
    ) {
      return element;
    }

    if (element.type === Select.OptGroup) {
      const { children: groupContent } = element.props;

      const groupChildren = map(groupContent, (group: ReactElement) => {
        const { children: groupContent } = group.props;

        return React.cloneElement(group, {
          title: null,
          children: isString(groupContent) ? (
            <Tooltip title={groupContent}>
              <span style={textWrapperStyle} test-id={element.props["test-id"]}>
                {groupContent}
              </span>
            </Tooltip>
          ) : (
            <span test-id={element.props["test-id"]}>{groupContent}</span>
          ),
        });
      });

      return React.cloneElement(element, {
        children: groupChildren,
      });
    }

    const { children: optionContent } = element.props;

    return React.cloneElement(element, {
      title: null,
      children: isString(optionContent) ? (
        <Tooltip title={optionContent}>
          <span style={textWrapperStyle} test-id={element.props["test-id"]}>
            {optionContent}
          </span>
        </Tooltip>
      ) : (
        <span test-id={element.props["test-id"]}>{optionContent}</span>
      ),
    });
  });

export const useSelectDropdownPosition = (
  fieldWrapperRef: RefObject<HTMLElement>,
  options: Partial<IDropdownParams>,
  xPlacement: TXPlacement
) => {
  const dropdownPadding = 4;
  const dropdownConfig = { ...options, padding: dropdownPadding } as const;
  const { height, ...rest } = useDropdownPosition(
    fieldWrapperRef,
    dropdownConfig,
    xPlacement
  );
  const listHeight = isNumber(height)
    ? height - dropdownPadding * 2
    : undefined;

  return { listHeight, ...rest } as const;
};

export const optionParsersForSearch = {
  /** Реализация по умолчанию */
  parseOptionText(option: DefaultOptionType) {
    return textContent(option.label);
  },
  takeAfterDash(option: DefaultOptionType) {
    return optionParsersForSearch
      .parseOptionText(option)
      .replace(/.*?( — )/, "")
      .trim();
  },
  takeBeforeBrackets(option: DefaultOptionType) {
    return optionParsersForSearch
      .parseOptionText(option)
      .replace(/(.+)\(.+\)/, "$1")
      .trim();
  },
};

export const textContent = (node: ReactNode): string => {
  if (!node) {
    return "";
  }
  if (isString(node)) {
    return node;
  }

  const children = (node as ReactElement).props?.children;

  return isArray(children)
    ? children.map(textContent).join("")
    : textContent(children);
};

const buildOption = (element: React.ReactNode): DefaultOptionType | null => {
  if (!React.isValidElement(element)) {
    return null;
  }

  const { value, children, ...rest } = (element as ReactElement).props;
  const isHasTestId = has(rest, "test-id");
  let label = isHasTestId ? (
    <span style={textWrapperStyle} test-id={rest["test-id"]}>
      {children}
    </span>
  ) : (
    children
  );

  if (isString(children)) {
    label = <Tooltip title={children}>{label}</Tooltip>;
  }

  return { value, label, key: element.key, ...rest } as DefaultOptionType;
};

export const mapChildrenToOptions = (
  children: React.ReactNode
): DefaultOptionType[] => {
  return (
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      if (child.type === Select.OptGroup) {
        return {
          label: child?.props.label as string,
          options: child?.props?.children.map(
            buildOption
          ) as DefaultOptionType[],
        };
      }

      return buildOption(child) as DefaultOptionType;
    }) ?? []
  );
};

export const isLabeled = (value: any): value is LabeledValue => {
  return has(value, "label");
};

export const findActiveOption = (
  value: SelectValue | null,
  options: DefaultOptionType[]
): TNullable<DefaultOptionType> => {
  value = isArray(value) ? value[0] : value;

  if (isNil(value)) {
    return null;
  }

  if (isLabeled(value)) {
    return value;
  }

  return find(options, { value });
};

export const isValidValue = (value: SelectValue | null) => {
  return !isEmpty(value) || isNumber(value);
};

export const optionToValue = (option?: DefaultOptionType): SelectValue => {
  if (option && option.value && option.label) {
    return { value: option.value, label: option.label };
  }
};

export const useGlobalScrollBehavior = (isOpen: boolean) => {
  useEffect(() => {
    isOpen
      ? globalScrollBehavior.hideScroll()
      : globalScrollBehavior.showScroll();
  }, [isOpen]);
};

// todo: Удалить после перехода на antd v5, если исправится [BI-9255]
export const useRemoveFocusedClass = (
  isOpen: boolean,
  element: HTMLElement | null
) => {
  const antSelectFocusedClass = "ant-select-focused";

  useEffect(() => {
    if (element && !isOpen) {
      if (!element.contains(document.activeElement)) {
        element
          .querySelector(`.${antSelectFocusedClass}`)
          ?.classList.remove(antSelectFocusedClass);
      }
    }
  }, [element, isOpen]);
};

export const useBlurOnResize = (element: BaseSelectRef | null) => {
  useEffect(() => {
    if (element) {
      const handleResize = () => element.blur();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [element]);
};
