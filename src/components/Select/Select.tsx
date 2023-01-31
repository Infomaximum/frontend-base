// eslint-disable-next-line im/ban-import-entity
import { Select as AntSelect, Spin } from "antd";
import type { SelectValue } from "antd/lib/select";
import {
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "../Icons/Icons";
import React, {
  MouseEvent,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  closeIconStyle,
  disableSelectStyle,
  disableTagStyle,
  displaySelectStyle,
  multipleSelectStyle,
  suffixIconSpinnerStyle,
  suffixIconStyle,
  tagStyle,
} from "./Select.styles";
import type { ISelectProps } from "./Select.types";
import { Tag } from "../Tag/Tag";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { ArrayInterpolation } from "@emotion/react";
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
} from "./Select.utils";
import {
  filter,
  first,
  isArray,
  isEmpty,
  isFunction,
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
import {
  suffixLoaderDelay,
  DropdownAnimationInterval,
} from "../../utils/const";
import type { BaseSelectRef } from "rc-select";
import { useTheme } from "../../decorators/hooks/useTheme";

const { OptGroup, Option } = AntSelect;

const SelectComponent = <T extends SelectValue = SelectValue>({
  dropdownPlacement = "left",
  suffixIcon: suffixIconProps,
  disabled,
  children,
  loading: loadingProps = false,
  dropdownRender,
  getPopupContainer,
  listItemHeight,
  onFocus,
  onBlur,
  onSearch,
  onChange,
  onClick,
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

  const isOpen = isOpenTest ?? isOpenProps ?? isOpenState;
  const value = isUndefined(valueProps) ? valueState : valueProps;
  const searchValue = searchValueProps ?? searchValueState;
  const filterOption = isFilterable ? filterOptionProps : false;

  const selectTextOnFocus = showSearch && !mode;

  const fieldWrapperRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<BaseSelectRef>(null);

  const dropdownPosition = useSelectDropdownPosition(
    fieldWrapperRef,
    { itemHeight: listItemHeight },
    dropdownPlacement
  );

  const computeDropdownPosition = isFunction(dropdownRender)
    ? noop
    : dropdownPosition.compute;

  useBlurOnResize(selectRef.current);
  useGlobalScrollBehavior(isOpen);
  useRemoveFocusedClass(isOpen, fieldWrapperRef.current);

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

  useEffect(() => {
    isOpen && computeDropdownPosition(getPopupContainer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
      setIsFilterable(true);
      setSearchValueState(text);
      onSearch?.(text);
    },
    [onSearch]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const activeOption =
        selectTextOnFocus &&
        isValidValue(value) &&
        findActiveOption(value, options);

      const searchText = activeOption
        ? prepareOptionForSearch(activeOption)
        : "";

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
    [
      value,
      options,
      selectTextOnFocus,
      prepareOptionForSearch,
      onFocus,
      onSearch,
    ]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = useCallback<NonNullable<typeof onChange>>(
    (value, option) => {
      setTimeout(() => computeDropdownPosition(getPopupContainer));

      setValueState(value);
      onChange?.(value, option);
    },
    [onChange, computeDropdownPosition, getPopupContainer]
  );

  const handleDropdownVisibleChange = useCallback(
    (shouldOpen: boolean) => {
      setIsOpenState(shouldOpen);
      onDropdownVisibleChange?.(shouldOpen);
    },
    [onDropdownVisibleChange]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const tagRender = useCallback(
    (props: CustomTagProps) => {
      const { label, closable, onClose } = props;

      const closeIcon = (
        <CloseOutlined
          onMouseDown={handleMouseDown}
          css={closeIconStyle(theme)}
        />
      );

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

    return (
      <ArrowDownSVG
        key="select-icon-suffix-down"
        css={suffixIconStyle(theme)}
      />
    );
  }, [loadingState, suffixIconProps, theme]);

  const getPlaceholder = () => {
    return disabled
      ? localization.getLocalized(NOT_SELECTED)
      : showSearch
      ? localization.getLocalized(ENTER_OR_SELECT_FROM_THE_LIST)
      : localization.getLocalized(SELECT_FROM_LIST);
  };

  const isShowIconClear =
    allowClear && ((isOpen && !!searchValue) || !isEmpty(value));

  const style = useMemo(() => {
    // `arrow` всегда занимает место, а `clear` только когда не отображается поверх `arrow`
    const iconSlotCount = filter([
      showArrow,
      isShowIconClear && !isClearIconOverSuffix,
    ]).length;

    const selectStyles: ArrayInterpolation<TTheme> = [
      displaySelectStyle(iconSlotCount)(theme),
    ];
    if (disabled) {
      selectStyles.push(disableSelectStyle(theme));
    }

    if (mode === "multiple") {
      selectStyles.push(multipleSelectStyle);
    }

    return selectStyles;
  }, [
    disabled,
    isClearIconOverSuffix,
    isShowIconClear,
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
    if (
      process.env.NODE_ENV === "development" &&
      isLabeled(isArray(value) ? value[0] : value)
    ) {
      return "NULL";
    }

    return undefined;
  };

  return (
    <div ref={fieldWrapperRef}>
      <AntSelect<T>
        {...rest}
        ref={selectRef}
        mode={mode}
        onClick={handleClick}
        open={isOpen}
        dropdownAlign={dropdownPosition.align}
        bordered={bordered ?? !disabled} // системное поведение
        searchValue={searchValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // Запрещаем вызов поиска с "" при закрытии dropdown [PT-12466]
        onSearch={showSearch && isOpen ? handleSearch : undefined}
        onChange={handleChange}
        value={value}
        showSearch={showSearch}
        allowClear={isShowIconClear}
        placeholder={placeholder || getPlaceholder()}
        clearIcon={<CloseCircleOutlined />}
        suffixIcon={suffixIcon}
        disabled={disabled}
        showArrow={showArrow}
        css={style}
        tagRender={rest.tagRender ?? tagRender}
        menuItemSelectedIcon={<CheckOutlined />}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        listHeight={dropdownPosition.listHeight}
        dropdownRender={dropdownRender}
        getPopupContainer={getPopupContainer}
        listItemHeight={listItemHeight}
        optionLabelProp={getOptionLabelProp()}
        options={options}
        autoFocus={false} // т.к. на фокус раскрывается dropdown
        filterOption={filterOption}
      />
    </div>
  );
};

SelectComponent.Option = Option;
SelectComponent.OptGroup = OptGroup;

export const Select = SelectComponent;
