// eslint-disable-next-line im/ban-import-entity
import { Select as AntSelect, Spin } from "antd";
import type { SelectValue } from "antd/lib/select";
import { CheckOutlined, CloseCircleFilled, CloseOutlined } from "../Icons/Icons";
import React, {
  type MouseEvent,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  closeIconStyle,
  arrowSuffixIconStyle,
  getDisableSelectStyle,
  disableTagStyle,
  getDisplaySelectStyle,
  multipleSelectStyle,
  suffixIconSpinnerStyle,
  tagStyle,
} from "./Select.styles";
import type { ISelectProps } from "./Select.types";
import { Tag } from "../Tag/Tag";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { Interpolation } from "@emotion/react";
import ArrowDownSVG from "../../resources/icons/ArrowDown.svg";
import {
  findActiveOption,
  isLabeled,
  isValidValue,
  mapChildrenToOptions,
  optionParsersForSearch,
  optionToValue,
  useGlobalScrollBehavior,
  useBlurOnResize,
  useRemoveFocusedClass,
  useSelectDropdownPosition,
  useCustomClearing,
  mergeRefs,
} from "./Select.utils";
import { filter, first, isArray, isEmpty, isFunction, isUndefined, noop } from "lodash";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import {
  ENTER_OR_SELECT_FROM_THE_LIST,
  NOT_SELECTED,
  SELECT_FROM_LIST,
} from "../../utils/Localization/Localization";
import { useDelayedTrue } from "../../decorators/hooks/useDelayedTrue";
import { suffixLoaderDelay, DropdownAnimationInterval } from "../../utils/const";
import type { BaseSelectRef } from "rc-select";
import { useTheme } from "../../decorators/hooks/useTheme";
import { useMountEffect } from "../../decorators";
import { removeElementsAttribute } from "../../utils";
import { ConfigProvider } from "antd";

const { OptGroup, Option } = AntSelect;

const clearIcon = { clearIcon: <CloseCircleFilled /> };

const SelectComponent = <T extends SelectValue = SelectValue>({
  dropdownPlacement = "left",
  visibleMaxCount,
  suffixIcon: suffixIconProps,
  disabled,
  children,
  loading: loadingProps = false,
  dropdownRender,
  getPopupContainer,
  listHeight,
  listItemHeight,
  onFocus,
  onBlur,
  onSearch,
  onChange,
  onClick,
  onClear,
  showSearch,
  showArrow = true,
  open: isOpenProps,
  value: valueProps,
  searchValue: searchValueProps,
  options: optionsProps,
  allowClear = false,
  placeholder,
  filterOption: filterOptionProps,
  defaultActiveFirstOption,
  defaultValue,
  onDropdownVisibleChange,
  mode,
  bordered,
  prepareOptionForSearch = optionParsersForSearch.parseOptionText,
  isClearIconOverSuffix = true,
  optionLabelProp,
  selectTextOnFocus: selectTextOnFocusProp = false,
  innerRef,
  autoFocus,
  autoFocusWithPreventScroll,
  ...rest
}: ISelectProps<T>) => {
  const localization = useLocalization();
  const theme = useTheme();

  showSearch = showSearch ?? (mode ? true : false); // значение по умолчанию в соответствии с antd
  showArrow = !disabled && showArrow; // системное поведение

  const options = useMemo(
    () => optionsProps ?? mapChildrenToOptions(children),
    [children, optionsProps]
  );

  const [isOpenTest, setIsOpenTest] = useState<boolean | undefined>();
  const [isOpenState, setIsOpenState] = useState(isOpenProps ?? false);
  const [valueState, setValueState] = useState(() =>
    isValidValue(valueProps)
      ? valueProps
      : isValidValue(defaultValue)
        ? defaultValue
        : defaultActiveFirstOption
          ? (optionToValue(first(options)) as T)
          : null
  );
  const [searchValueState, setSearchValueState] = useState(searchValueProps);
  const loadingState = useDelayedTrue(loadingProps, suffixLoaderDelay);
  const [isFilterable, setIsFilterable] = useState(true);
  const isSearchHandlerEnabled = useRef(true);
  const isOpen = isOpenTest ?? isOpenProps ?? isOpenState;
  const value = isUndefined(valueProps) ? valueState : valueProps;
  const searchValue = searchValueProps ?? searchValueState;
  const filterOption = isFilterable ? filterOptionProps : false;

  const selectTextOnFocus = selectTextOnFocusProp && showSearch && !mode;
  const fieldWrapperRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<BaseSelectRef>(null);

  const dropdownPosition = useSelectDropdownPosition(
    fieldWrapperRef,
    { itemHeight: listItemHeight, visibleMaxCount },
    dropdownPlacement
  );

  const computeDropdownPosition = isFunction(dropdownRender) ? noop : dropdownPosition.compute;

  useBlurOnResize(selectRef.current);
  useGlobalScrollBehavior(isOpen);
  useRemoveFocusedClass(isOpen, fieldWrapperRef.current);

  useMountEffect(() => {
    if (autoFocusWithPreventScroll) {
      selectRef.current?.focus({ preventScroll: true });
    }

    const targetNode = fieldWrapperRef.current;

    if (targetNode) {
      removeElementsAttribute(targetNode);
    }

    const mutationObserver = new MutationObserver(() => {
      targetNode && removeElementsAttribute(targetNode);
    });

    targetNode &&
      mutationObserver.observe(targetNode, {
        childList: true,
        subtree: true,
      });

    return () => mutationObserver.disconnect();
  });

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSearchValueState(undefined);
        onSearch?.("");
      }, DropdownAnimationInterval);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useLayoutEffect(() => {
    isOpen && computeDropdownPosition(getPopupContainer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    isSearchHandlerEnabled.current = true;
  });

  useEffect(() => {
    if (searchValueProps === null) {
      setSearchValueState(undefined);
    }
  }, [searchValueProps]);

  /** Сделан для тестирования, чтобы при открытии с нажатым Alt дропдаун не закрывался */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);

      if (e.altKey) {
        setIsOpenTest((prevState) => !prevState);
      }
    },
    [onClick]
  );

  const handleSearch = useCallback(
    (text: string) => {
      if (!isSearchHandlerEnabled.current) {
        setSearchValueState(undefined);

        return;
      }

      setIsFilterable(true);

      setSearchValueState(text);
      onSearch?.(text);
    },
    [onSearch]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const activeOption =
        selectTextOnFocus && isValidValue(value) && findActiveOption(value, options);

      const searchText = activeOption ? prepareOptionForSearch(activeOption) : "";

      if (searchText) {
        setTimeout(() => {
          fieldWrapperRef.current?.querySelector("input")?.select();
        });
      }

      onFocus?.(e);
      setIsFilterable(false);
      setSearchValueState(searchText);
      onSearch?.(searchText);
    },
    [value, options, selectTextOnFocus, prepareOptionForSearch, onFocus, onSearch]
  );

  const handleChange = useCallback<NonNullable<typeof onChange>>(
    (value, option) => {
      setTimeout(() => computeDropdownPosition(getPopupContainer));

      setValueState(value);
      onChange?.(value, option);
      handleSearch("");
    },
    [onChange, handleSearch, computeDropdownPosition, getPopupContainer]
  );

  const handleDropdownVisibleChange = useCallback(
    (shouldOpen: boolean) => {
      // Запрещаем вызов поиска с "" при закрытии dropdown [PT-12466]
      isSearchHandlerEnabled.current = shouldOpen;

      setIsOpenState(shouldOpen);
      onDropdownVisibleChange?.(shouldOpen);
    },
    [onDropdownVisibleChange]
  );

  useCustomClearing(
    fieldWrapperRef.current,
    {
      onDropdownVisibleChange: handleDropdownVisibleChange,
      onChange: handleChange,
      onClear: onClear ?? noop,
    },
    !!mode,
    !!allowClear
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const tagRender = useCallback(
    (props: CustomTagProps) => {
      const { label, closable, onClose } = props;

      const closeIcon = <CloseOutlined onMouseDown={handleMouseDown} css={closeIconStyle(theme)} />;

      return (
        <Tag
          closable={closable}
          onClose={onClose}
          css={!closable ? disableTagStyle(theme) : tagStyle(theme)}
          closeIcon={closeIcon}
        >
          {label}
        </Tag>
      );
    },
    [handleMouseDown, theme]
  );

  const suffixIcon = useMemo(() => {
    if (loadingState) {
      return (
        <div css={suffixIconSpinnerStyle}>
          <Spin size="small" />
        </div>
      );
    }

    if (suffixIconProps) {
      return suffixIconProps;
    }

    if (!showArrow) {
      return null;
    }

    return (
      <div key="select-icon-suffix-down" css={arrowSuffixIconStyle(theme)}>
        <ArrowDownSVG />
      </div>
    );
  }, [loadingState, showArrow, suffixIconProps, theme]);

  const getPlaceholder = () => {
    return disabled
      ? localization.getLocalized(NOT_SELECTED)
      : showSearch
        ? localization.getLocalized(ENTER_OR_SELECT_FROM_THE_LIST)
        : localization.getLocalized(SELECT_FROM_LIST);
  };

  const isShowIconClear =
    allowClear &&
    (showArrow ? true : !loadingState) &&
    ((isOpen && !!searchValue) || !isEmpty(isArray(value) ? value : [value]));

  const style = useMemo(() => {
    // `arrow` всегда занимает место, а `clear` только когда не отображается поверх `arrow` или когда нет `arrow`
    const iconSlotCount = filter([
      showArrow || (!showArrow && loadingState),
      isShowIconClear && (!isClearIconOverSuffix || !showArrow),
    ]).length;

    const selectStyles = [getDisplaySelectStyle(iconSlotCount)(theme) as Interpolation<TTheme>];

    if (disabled) {
      selectStyles.push(getDisableSelectStyle(bordered)(theme));
    }

    if (mode === "multiple") {
      selectStyles.push(multipleSelectStyle);
    }

    return selectStyles;
  }, [
    bordered,
    disabled,
    isClearIconOverSuffix,
    isShowIconClear,
    loadingState,
    mode,
    showArrow,
    theme,
  ]);

  const getOptionLabelProp = () => {
    if (optionLabelProp) {
      return optionLabelProp;
    }

    // Исправление warning [PT-12871]
    // По ключу "NULL" в опции ничего нет, поэтому однозначно используется label из value
    if (process.env.NODE_ENV === "development" && isLabeled(isArray(value) ? value[0] : value)) {
      return "NULL";
    }

    return undefined;
  };

  return (
    <div ref={fieldWrapperRef}>
      <ConfigProvider
        theme={{
          token: {
            paddingSM: 8,
          },
        }}
      >
        <AntSelect<T>
          {...rest}
          ref={mergeRefs(selectRef, innerRef)}
          mode={mode}
          onClick={handleClick}
          open={isOpen}
          dropdownAlign={dropdownPosition.align}
          variant={(bordered ?? (!disabled || rest.readOnly)) ? "outlined" : "borderless"}
          searchValue={searchValue}
          onFocus={handleFocus}
          onBlur={onBlur}
          onSearch={showSearch ? handleSearch : undefined}
          onChange={handleChange}
          onClear={onClear}
          value={value}
          showSearch={showSearch}
          allowClear={isShowIconClear ? clearIcon : false}
          placeholder={placeholder || getPlaceholder()}
          suffixIcon={suffixIcon}
          disabled={disabled}
          css={style}
          tagRender={rest.tagRender ?? tagRender}
          menuItemSelectedIcon={<CheckOutlined />}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          listHeight={listHeight ?? dropdownPosition.listHeight}
          dropdownRender={dropdownRender}
          getPopupContainer={getPopupContainer}
          listItemHeight={listItemHeight}
          optionLabelProp={getOptionLabelProp()}
          options={options}
          filterOption={filterOption}
          autoFocus={autoFocus}
        />
      </ConfigProvider>
    </div>
  );
};

SelectComponent.Option = Option;
SelectComponent.OptGroup = OptGroup;

export const Select = SelectComponent;
