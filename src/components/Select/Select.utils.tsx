import React, {
  type ReactElement,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
} from "react";
import { Select } from "./Select";
import { AlignedTooltip } from "../AlignedTooltip";
import { find, has, isArray, isEmpty, isNil, isNumber, isString, map } from "lodash";
import { useDropdownPosition } from "../Dropdown/Dropdown.utils";
import type { DefaultOptionType, LabeledValue, SelectValue } from "antd/lib/select";
import type { IDropdownParams, TXPlacement } from "../Dropdown/Dropdown.types";
import { globalScrollBehavior } from "../../utils/ScrollBehavior/ScrollBehavior";
import type { BaseSelectRef } from "rc-select";
import type { ISelectProps } from "./Select.types";
import { ellipsisStyle } from "../../styles";

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
            <AlignedTooltip>
              <span style={ellipsisStyle} test-id={element.props["test-id"]}>
                {groupContent}
              </span>
            </AlignedTooltip>
          ) : (
            <span test-id={element.props["test-id"]}>{groupContent}</span>
          ),
        });
      });

      return React.cloneElement(element as React.ReactElement<{ children: ReactNode[] }>, {
        children: groupChildren,
      });
    }

    const { children: optionContent } = element.props;

    return React.cloneElement(
      element as React.ReactElement<{ children: ReactNode; title: null | undefined | string }>,
      {
        title: null,
        children: isString(optionContent) ? (
          <AlignedTooltip>
            <span style={ellipsisStyle} test-id={element.props["test-id"]}>
              {optionContent}
            </span>
          </AlignedTooltip>
        ) : (
          <span test-id={element.props["test-id"]}>{optionContent}</span>
        ),
      }
    );
  });

export const useSelectDropdownPosition = (
  fieldWrapperRef: RefObject<HTMLElement>,
  options: Partial<IDropdownParams>,
  xPlacement: TXPlacement
) => {
  const dropdownPadding = 4;
  const dropdownConfig = { ...options, padding: dropdownPadding } as const;
  const { height, ...rest } = useDropdownPosition(fieldWrapperRef, dropdownConfig, xPlacement);
  const listHeight = isNumber(height) ? height - dropdownPadding * 2 : undefined;

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

export const mergeRefs = (
  ...selectRefs: Array<React.MutableRefObject<HTMLElement | BaseSelectRef | null> | undefined>
) => {
  return (ref: HTMLElement | BaseSelectRef | null) => {
    selectRefs.forEach((selectRef) => {
      if (!selectRef) {
        return;
      }

      selectRef.current = ref;
    });
  };
};

export const textContent = (node: ReactNode): string => {
  if (!node) {
    return "";
  }

  if (isString(node)) {
    return node;
  }

  const children = (node as ReactElement).props?.children;

  return isArray(children) ? children.map(textContent).join("") : textContent(children);
};

const buildOption = (element: React.ReactNode): DefaultOptionType | null => {
  if (!React.isValidElement(element)) {
    return null;
  }

  const { value, children, ...rest } = (element as ReactElement).props;
  const isHasTestId = has(rest, "test-id");
  let label = isHasTestId ? (
    <span style={ellipsisStyle} test-id={rest["test-id"]}>
      {children}
    </span>
  ) : (
    children
  );

  if (isString(children)) {
    // Фрагмент необходим для отключения title по-умолчанию
    label = <>{label}</>;
  }

  return { value, label, key: element.key, ...rest } as DefaultOptionType;
};

export const mapChildrenToOptions = (children: React.ReactNode): DefaultOptionType[] => {
  return (
    React.Children.map(children, (_child) => {
      if (!React.isValidElement(_child)) {
        return null;
      }

      const child = _child as React.ReactElement<
        { children: ReactNode[]; label: string } | undefined
      >;

      if (child.type === Select.OptGroup) {
        return {
          label: child?.props?.label,
          options: child?.props?.children.map(buildOption) as DefaultOptionType[],
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
    isOpen ? globalScrollBehavior.hideScroll() : globalScrollBehavior.showScroll();
  }, [isOpen]);
};

// todo: Удалить после перехода на antd v5, если исправится [BI-9255]
export const useRemoveFocusedClass = (isOpen: boolean, element: HTMLElement | null) => {
  const antSelectFocusedClass = "ant-select-focused";

  useEffect(() => {
    if (element && !isOpen) {
      if (!element.contains(document.activeElement)) {
        element.querySelector(`.${antSelectFocusedClass}`)?.classList.remove(antSelectFocusedClass);
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

/**
 * Хук для блокировки ненужных вызовов onSearch из AntSelect при его очистке.
 * Вызов onSearch в момент перед закрытием Dropdown вызывает мерцание содержимого Dropdown.
 * Принцип работы хука в перехватывании нажатий по областям очистки и вызове нужных методов вручную.
 * onSearch с пустой строкой вызовется в эффекте после полного закрытия Dropdown.
 */
export const useCustomClearing = (
  selectWrapper: HTMLDivElement | null,
  callbacks: Pick<Required<ISelectProps>, "onDropdownVisibleChange" | "onChange" | "onClear">,
  isMultipleMode: boolean,
  allowClear: boolean
) => {
  const { onDropdownVisibleChange, onClear, onChange } = callbacks;

  const handleMouseDown = useCallback(
    (e: DocumentEventMap["mousedown"]) => {
      const target = e.target as Element | null;

      if (!target || !selectWrapper) {
        return;
      }

      const isEventOnClearIcon = target.closest(".ant-select-clear");

      if (isEventOnClearIcon) {
        e.preventDefault();
        e.stopPropagation();
        onDropdownVisibleChange(false);
        onClear();
        // В соответствии с тем, какие аргументы при очистке передает AntSelect, несмотря на типизацию
        isMultipleMode ? onChange([], []) : onChange(undefined, undefined!);

        return;
      }

      // Произошло ли нажатие по области, очищающей поисковую строку
      const isEventOnClearArea =
        target.closest(".ant-select-selector") &&
        !target.closest(".ant-select-selection-search-input");

      const hasSearchValue = selectWrapper.querySelector("input")?.value;

      if (isEventOnClearArea && hasSearchValue && allowClear) {
        e.stopPropagation();
        e.preventDefault();
        onDropdownVisibleChange(false);
      }
    },
    [onChange, onDropdownVisibleChange, onClear, selectWrapper, isMultipleMode, allowClear]
  );

  useEffect(() => {
    if (selectWrapper) {
      selectWrapper.addEventListener("mousedown", handleMouseDown);

      return () => selectWrapper.removeEventListener("mousedown", handleMouseDown);
    }
  }, [handleMouseDown, selectWrapper]);
};
