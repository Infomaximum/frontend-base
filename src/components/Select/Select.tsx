// eslint-disable-next-line im/ban-import-entity
import { Select as AntSelect } from "antd";
import type { SelectValue } from "antd/lib/select";
import { CheckOutlined, CloseCircleFilled, CloseOutlined, DownOutlined } from "../Icons/Icons";
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
  hiddenDropdownStyle,
  selectTextOnFocusInputStyle,
} from "./Select.styles";
import type { ISelectProps } from "./Select.types";
import { Tag } from "../Tag/Tag";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { Interpolation } from "@emotion/react";
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
  buildOption,
  getValueFromSelectValue,
  getFilteredOptionsByTextValue,
  searchValueKey,
} from "./Select.utils";
import {
  filter,
  find,
  first,
  isArray,
  isEmpty,
  isFunction,
  isNull,
  isString,
  isUndefined,
  noop,
} from "lodash";
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
import { autocompleteSelectClearIconTestId, removeElementsAttribute } from "../../utils";
import { ConfigProvider } from "antd";
import { LocalSpinner } from "../Spinner";
import { AlignedTooltip } from "../AlignedTooltip";
import type { OptionFC } from "rc-select/lib/Option";
import type { OptionGroupFC } from "rc-select/lib/OptGroup";

const { OptGroup, Option } = AntSelect;

const clearIcon = { clearIcon: <CloseCircleFilled test-id={autocompleteSelectClearIconTestId} /> };

const themeToken = {
  token: {
    paddingSM: 8,
  },
};

const SelectComponent = <T extends SelectValue = SelectValue>({
  dropdownPlacement = "left",
  visibleMaxCount,
  suffixIcon: suffixIconProp,
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
  variant,
  prepareOptionForSearch = optionParsersForSearch.parseOptionText,
  isClearIconOverSuffix = true,
  optionLabelProp,
  selectTextOnFocus: selectTextOnFocusProp = false,
  enableAddingNewOption: enableAddingNewOptionProp = false,
  innerRef,
  autoFocus,
  autoFocusWithPreventScroll,
  getBoundingContainer,
  notFoundContent,
  dropdownStyle,
  submitEmptyValue,
  onKeyDown,
  disableGlobalScrollBehavior,
  optionFilterProp,
  ...rest
}: ISelectProps<T>) => {
  const localization = useLocalization();
  const theme = useTheme();

  showSearch = showSearch ?? (mode ? true : false); // значение по умолчанию в соответствии с antd

  const isShowSuffixIcon = !disabled && !isNull(suffixIconProp);

  const options = useMemo(
    () =>
      optionsProps?.map((opt) => {
        let label = opt.label;

        if (isString(opt.label)) {
          label = <AlignedTooltip>{opt.label}</AlignedTooltip>;
        }

        return {
          ...opt,
          label: label,
          ...(showSearch && optionFilterProp === "label" ? { [searchValueKey]: opt.label } : {}),
        };
      }) ?? mapChildrenToOptions(children, { showSearch, optionFilterProp }),
    [children, optionsProps, optionFilterProp, showSearch]
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
  const [isHideDropdown, setIsHideDropdown] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState<string | number | null>(null);
  const [searchValueState, setSearchValueState] = useState(searchValueProps);
  const loadingState = useDelayedTrue(loadingProps, suffixLoaderDelay);
  const [isFilterable, setIsFilterable] = useState(true);
  const isSearchHandlerEnabled = useRef(true);
  const isOpen = isOpenTest ?? isOpenProps ?? isOpenState;
  const value = isUndefined(valueProps) ? valueState : valueProps;
  const searchValue = searchValueProps ?? searchValueState;
  const filterOption = isFilterable ? filterOptionProps : false;

  const selectTextOnFocus = selectTextOnFocusProp && showSearch && !mode;
  const enableAddingNewOption = enableAddingNewOptionProp && !mode;
  const fieldWrapperRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<BaseSelectRef>(null);

  const dropdownPosition = useSelectDropdownPosition(
    fieldWrapperRef,
    { itemHeight: listItemHeight, visibleMaxCount },
    dropdownPlacement
  );
  useEffect(() => {
    if (enableAddingNewOption && options.length > 0 && value) {
      const valueFromSelectValue = getValueFromSelectValue(value);
      const isExistedOption = find(options, { value: valueFromSelectValue });

      if (isUndefined(isExistedOption)) {
        setNewOptionValue(valueFromSelectValue ?? null);
      } else {
        setNewOptionValue(null);
      }
    }
  }, [options, enableAddingNewOption, value]);

  const computeDropdownPosition = isFunction(dropdownRender) ? noop : dropdownPosition.compute;

  useBlurOnResize(selectRef.current);
  useGlobalScrollBehavior(isOpen, disableGlobalScrollBehavior);
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
        if (enableAddingNewOption && valueState) {
          setSearchValueState(getValueFromSelectValue(valueState));
        } else {
          setSearchValueState(undefined);
        }

        setIsHideDropdown(false);
        onSearch?.("");
      }, DropdownAnimationInterval);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, valueState]);

  useLayoutEffect(() => {
    isOpen && computeDropdownPosition(getBoundingContainer ?? getPopupContainer);
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
        if (!enableAddingNewOption) {
          setSearchValueState(undefined);
        }

        return;
      }

      const searchFilterResults = getFilteredOptionsByTextValue(options, text);

      setIsHideDropdown(
        enableAddingNewOption && isNull(notFoundContent) && searchFilterResults.length === 0
      );

      setIsFilterable(true);

      setSearchValueState(text);
      onSearch?.(text);
    },
    [enableAddingNewOption, notFoundContent, onSearch, options]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const activeOption =
        selectTextOnFocus && isValidValue(value) && findActiveOption(value, options);

      const searchText = activeOption
        ? prepareOptionForSearch(activeOption)
        : (newOptionValue?.toString() ?? "");

      onFocus?.(e);
      setIsFilterable(false);
      setSearchValueState(searchText);
      onSearch?.(searchText);
    },
    [selectTextOnFocus, value, options, prepareOptionForSearch, newOptionValue, onFocus, onSearch]
  );

  const handleChange = useCallback<NonNullable<typeof onChange>>(
    (value, option) => {
      setTimeout(() => computeDropdownPosition(getBoundingContainer ?? getPopupContainer));

      if (isUndefined(value) || value === "") {
        setNewOptionValue(null);
      }

      setValueState(value);
      onChange?.(value, option);

      if (!enableAddingNewOption) {
        handleSearch("");
      }
    },
    [
      onChange,
      enableAddingNewOption,
      computeDropdownPosition,
      getBoundingContainer,
      getPopupContainer,
      handleSearch,
    ]
  );

  const handleChangeWithNewOption = useCallback(
    (searchValue: string | undefined, isBlur = true) => {
      if (!isUndefined(searchValue)) {
        const trimmedSearchValue = searchValue.trim();

        // Если значение в поиске совпадает с выбранным значением
        // или отключена возможность сабмита пустой строки,
        // то не применять новое значение
        if (trimmedSearchValue === valueState || (!submitEmptyValue && searchValue.length === 0)) {
          return;
        }

        const searchFilterResults = getFilteredOptionsByTextValue(options, searchValue);

        const singularFilterResultValue = searchFilterResults[0]?.value;

        // Сабмит единственного найденного значения при блюре
        if (isBlur && searchFilterResults.length === 1 && singularFilterResultValue) {
          handleChange(singularFilterResultValue as T, searchFilterResults[0]);

          return;
        }

        // Применение нового значения, если нажата клавиша Enter и нет совпадений
        // или при блюре в случаях, когда либо более 1-го совпадения, либо нет совпадений
        if ((!isBlur && searchFilterResults.length === 0) || isBlur) {
          const newOption =
            buildOption(
              <Select.Option
                filterProp={trimmedSearchValue}
                key={`select_key-${trimmedSearchValue}`}
                value={trimmedSearchValue}
              >
                {trimmedSearchValue}
              </Select.Option>,
              { showSearch, optionFilterProp }
            ) ?? undefined;

          handleChange(trimmedSearchValue as T, newOption);
        }
      }
    },
    [handleChange, optionFilterProp, options, showSearch, submitEmptyValue, valueState]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (enableAddingNewOption) {
        handleChangeWithNewOption(searchValueState);
      }

      if (isFunction(onBlur)) {
        onBlur(e);
      }
    },
    [handleChangeWithNewOption, onBlur, searchValueState, enableAddingNewOption]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        if (enableAddingNewOption && searchValueState) {
          handleChangeWithNewOption(searchValueState, false);
        }
      }

      onKeyDown?.(event);
    },
    [onKeyDown, enableAddingNewOption, searchValueState, handleChangeWithNewOption]
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
      const { label, closable, onClose, isMaxTag } = props;

      const closeIcon = <CloseOutlined onMouseDown={handleMouseDown} css={closeIconStyle(theme)} />;

      return (
        <Tag
          closable={closable}
          onClose={onClose}
          css={!closable ? disableTagStyle(theme) : tagStyle(theme)}
          closeIcon={closeIcon}
          isWithoutTooltipWrapper={isMaxTag}
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
          <LocalSpinner delay={0} />
        </div>
      );
    }

    if (suffixIconProp) {
      return suffixIconProp;
    }

    if (!isShowSuffixIcon) {
      return null;
    }

    return (
      <div key="select-icon-suffix-down" css={arrowSuffixIconStyle(theme)}>
        <DownOutlined />
      </div>
    );
  }, [isShowSuffixIcon, loadingState, suffixIconProp, theme]);

  const getPlaceholder = () => {
    return disabled
      ? localization.getLocalized(NOT_SELECTED)
      : showSearch
        ? localization.getLocalized(ENTER_OR_SELECT_FROM_THE_LIST)
        : localization.getLocalized(SELECT_FROM_LIST);
  };

  const isShowIconClear =
    (allowClear || !!newOptionValue) &&
    (isShowSuffixIcon ? true : !loadingState) &&
    ((isOpen && !!searchValue) || !isEmpty(isArray(value) ? value : [value]));

  const style = useMemo(() => {
    // `arrow` всегда занимает место, а `clear` только когда не отображается поверх `arrow` или когда нет `arrow`
    const iconSlotCount = filter([
      isShowSuffixIcon || (!isShowSuffixIcon && loadingState),
      isShowIconClear && (!isClearIconOverSuffix || !isShowSuffixIcon),
    ]).length;

    const selectStyles = [getDisplaySelectStyle(iconSlotCount)(theme) as Interpolation<TTheme>];

    if (disabled) {
      selectStyles.push(getDisableSelectStyle(rest.readOnly || disabled)(theme));
    }

    if (mode === "multiple") {
      selectStyles.push(multipleSelectStyle);
    }

    if (selectTextOnFocus) {
      selectStyles.push(selectTextOnFocusInputStyle);
    }

    return selectStyles;
  }, [
    rest.readOnly,
    disabled,
    isClearIconOverSuffix,
    isShowIconClear,
    isShowSuffixIcon,
    loadingState,
    mode,
    selectTextOnFocus,
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
      <ConfigProvider theme={themeToken}>
        <AntSelect<T>
          {...rest}
          ref={mergeRefs(selectRef, innerRef)}
          mode={mode}
          onClick={handleClick}
          open={isOpen}
          dropdownAlign={dropdownPosition.align}
          variant={variant ?? (rest.readOnly || disabled ? "borderless" : "outlined")}
          searchValue={searchValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
          notFoundContent={notFoundContent}
          dropdownStyle={isHideDropdown ? hiddenDropdownStyle : dropdownStyle}
          optionFilterProp={
            showSearch && optionFilterProp === "label" ? searchValueKey : optionFilterProp
          }
        />
      </ConfigProvider>
    </div>
  );
};

SelectComponent.Option = Option as OptionFC;
SelectComponent.OptGroup = OptGroup as OptionGroupFC;

export const Select = SelectComponent;
