import React, { type MouseEvent } from "react";
import {
  map,
  forEach,
  isUndefined,
  isFunction,
  isString,
  isNull,
  isEmpty,
  find,
  groupBy,
  isNil,
  debounce,
  compact,
  identity,
  isArray,
} from "lodash";
import { createSelector } from "reselect";
import type { LabeledValue } from "antd/lib/select";
import {
  ENTER_QUERY,
  REFINE_QUERY,
  NOT_SELECTED,
} from "../../../../utils/Localization/Localization";
import {
  hintContainerStyle,
  suffixIconStyle,
  closeCircleStyle,
  hintOptionStyle,
} from "./SelectComponent.styles";
import {
  autocompleteSelectSuffixButtonTestId,
  autocompleteSelectTestId,
  autocompleteSelectOptionTestId,
} from "../../../../utils/TestIds";
import type { ISelectComponentProps, ISelectState } from "./SelectComponent.types";
import { observer } from "mobx-react";
import { reaction } from "mobx";
import type { TreeSelectProps } from "rc-tree-select/lib/TreeSelect";
import { Group, type IModel } from "@infomaximum/graphql-model";
import { CloseCircleFilled, CloseOutlined } from "../../../Icons/Icons";
import type { Localization } from "@infomaximum/localization";
import { Tooltip } from "../../../Tooltip";
import { DropdownAnimationInterval, KeyupRequestInterval } from "../../../../utils/const";
import { Select } from "../../../Select/Select";
import { BarsSVG } from "../../../../resources/icons";
import { DropdownPendingPlaceholder } from "../../../Select/DropdownPendingPlaceholder/DropdownPendingPlaceholder";
import { withLoc } from "../../../../decorators/hocs/withLoc/withLoc";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { Tag } from "../../../Tag";
import { boundMethod } from "../../../../decorators";
import { closeIconStyle, disableTagStyle, tagStyle } from "../../../Select/Select.styles";
import { AlignedTooltip } from "../../../AlignedTooltip";

/** Используется, если нужен одинаковый title для выбранного и выбираемых значений
 * По умолчанию, если есть handlerDisplayValues, то title для выбранного и выбираемых значений разный
 */
const defaultTitleValuesHandler = (model: IModel) => model?.getDisplayName();

function mapExcludedData(value?: IModel[], variables?: TDictionary) {
  if (!value) {
    return variables;
  }

  const excluded: { excludedNodes?: number[]; excludedItems?: number[] } = {};

  if (variables?.excludedNodes) {
    excluded.excludedNodes = [...variables.excludedNodes];
  }

  if (variables?.excludedItems) {
    excluded.excludedItems = [...variables.excludedItems];
  }

  forEach(value, (model) => {
    const key = model instanceof Group ? "excludedNodes" : "excludedItems";

    if (!excluded[key]) {
      excluded[key] = [];
    }

    if (!find(excluded[key], (id: number) => id === model.getId())) {
      excluded[key]?.push(model.getId());
    }
  });

  return {
    ...variables,
    ...excluded,
  };
}

class _Select extends React.PureComponent<ISelectComponentProps, ISelectState> {
  public static defaultProps = {
    requestOnMount: false,
    showArrow: true,
    isHasAccess: true,
  };

  public static clearIcon = { clearIcon: <CloseCircleFilled css={closeCircleStyle} /> };

  private disposer = this.getReaction();
  private modelListByGroups: TDictionary<IModel[]> | undefined;

  constructor(props: ISelectComponentProps) {
    super(props);

    this.state = {
      searchText: this.props.searchValue,
      hasBeenOpenedDropdown: false,
      isDropdownOpened: false, // todo: не всегда соответствует фактическому состоянию открытости
      wasDataSearched: false,
      isFocused: false,
    };
  }

  public override componentDidMount(): void {
    const {
      autocompleteStore,
      queryVariables: variables,
      value,
      requestOnMount,
      isHasAccess,
    } = this.props;

    if (requestOnMount && isHasAccess) {
      autocompleteStore.searchValueChange(undefined);

      autocompleteStore.requestData({
        variables: mapExcludedData(value, variables),
      });
    }
  }

  public override componentDidUpdate(prevProps: Readonly<ISelectComponentProps>): void {
    const { autocompleteStore, searchValue } = this.props;

    if (!isUndefined(searchValue) && searchValue !== this.state.searchText) {
      this.setState({ searchText: searchValue });
    }

    const modelsMap = autocompleteStore.map;

    if (!isNil(modelsMap) && isFunction(this.props.groupBy)) {
      this.modelListByGroups = groupBy(
        Array.from(modelsMap, ([, model]) => model),
        this.props.groupBy
      );
    } else {
      this.modelListByGroups = undefined;
    }

    if (prevProps.isHasAccess && !this.props.isHasAccess) {
      const { autocompleteStore } = this.props;

      autocompleteStore.clearData();
    }
  }

  public override componentWillUnmount(): void {
    const { autocompleteStore } = this.props;

    this.disposer();

    autocompleteStore.clearData();
  }

  private getSelectValue = createSelector(
    (localization) => localization,
    (_localization: Localization, fieldValue: IModel[] | undefined) => fieldValue,
    (localization, fieldValue) => {
      const { handlerDisplaySelectedValues, handlerTitleValues, labelPropsGetter } = this.props;

      return fieldValue
        ? map(fieldValue, (model) => {
            const displayValue = handlerDisplaySelectedValues
              ? handlerDisplaySelectedValues(model)
              : model?.getDisplayName();

            const labelProps = labelPropsGetter ? labelPropsGetter(model) : null;

            const title = handlerTitleValues ? handlerTitleValues(model) : null;

            return {
              value: model?.getInnerName(),
              label: (
                <div {...labelProps}>
                  <AlignedTooltip offsetY={-2} title={title}>
                    {displayValue || localization.getLocalized(NOT_SELECTED)}
                  </AlignedTooltip>
                </div>
              ),
            };
          })
        : [];
    }
  );

  private getFieldValueCollection = createSelector(identity, (models: IModel[]) => {
    const collection: TDictionary<IModel> = {};
    forEach(models, (item) => {
      collection[item.getInnerName()] = item;
    });

    return collection;
  });

  // eslint-disable-next-line react/sort-comp
  private onSearch = () => {
    const { autocompleteStore, queryVariables, value } = this.props;
    const { isDropdownOpened } = this.state;
    const searchText = this.props.searchValue ?? this.state.searchText;

    const isSearchTextChanged = searchText !== autocompleteStore.searchValue;

    if (isSearchTextChanged && isString(searchText) && isDropdownOpened) {
      autocompleteStore.searchValueChange(searchText, mapExcludedData(value, queryVariables));
    }
  };

  private onSearchDebounced = debounce(this.onSearch, KeyupRequestInterval);

  private mapSelectValueToModel(value: TreeSelectProps["value"]) {
    const { autocompleteStore, value: fieldValue } = this.props;

    return autocompleteStore.map?.get(value) ?? this.getFieldValueCollection(fieldValue)[value];
  }

  private getHintText(hasNext: boolean, isSearch: boolean) {
    const { localization } = this.props;

    if (hasNext && !isSearch) {
      return localization.getLocalized(ENTER_QUERY);
    } else {
      return localization.getLocalized(REFINE_QUERY);
    }
  }

  private getHintOption() {
    const { autocompleteStore } = this.props;
    const { wasDataSearched } = this.state;
    const { model } = autocompleteStore;

    if (!model) {
      return;
    }

    const currentCount = model.getItems().length;
    const hasNext = model.hasNext();

    if ((!hasNext && !wasDataSearched) || !currentCount) {
      return;
    }

    return (
      <Select.Option disabled={true}>
        <span css={hintOptionStyle}>{this.getHintText(hasNext, wasDataSearched)}</span>
      </Select.Option>
    );
  }

  private getReaction() {
    const { autocompleteStore } = this.props;

    return reaction(
      () => ({
        loading: autocompleteStore.isLoading,
      }),
      (value, prevValue) => {
        if (prevValue.loading === true && value.loading === false) {
          this.setState({ wasDataSearched: !!this.state.searchText });
        }
      }
    );
  }

  private isFirstLoading() {
    const { autocompleteStore } = this.props;
    const { isDropdownOpened } = this.state;

    return autocompleteStore.isLoading && !autocompleteStore.isDataLoaded && isDropdownOpened;
  }

  private getSuffixIcon(disabled: boolean) {
    const { onSuffixClick, suffixButtonTestId } = this.props;

    const suffixButtonTestIdValue = suffixButtonTestId ?? autocompleteSelectSuffixButtonTestId;

    const handleSuffixIconClick =
      !disabled && isFunction(onSuffixClick) ? onSuffixClick : undefined;

    if (!onSuffixClick) {
      return;
    }

    return (
      <div
        key="select-suffix"
        css={suffixIconStyle}
        onClick={handleSuffixIconClick}
        test-id={suffixButtonTestIdValue}
      >
        <BarsSVG />
      </div>
    );
  }

  private handleSearchChange = (searchText: string): void => {
    const { onSearch } = this.props;

    this.setState({ searchText }, () => {
      onSearch?.(searchText);

      if (this.props.isHasAccess) {
        this.props.autocompleteStore.isDataLoaded ? this.onSearchDebounced() : this.onSearch();
      }
    });
  };

  private handleDropdownVisibleChange = (isOpened: boolean): void => {
    this.setState(
      {
        isDropdownOpened: isOpened,
        hasBeenOpenedDropdown: this.state.hasBeenOpenedDropdown || isOpened,
      },
      () => {
        if (isOpened && this.props.isHasAccess && this.state.isFocused) {
          this.onSearch();
        }

        if (!isOpened) {
          setTimeout(() => {
            if (!this.state.isDropdownOpened) {
              this.props.autocompleteStore.clearData();
            }
          }, DropdownAnimationInterval);
        }
      }
    );
  };

  private handleFocus = () => {
    this.props.onFocus?.();
    this.setState({ isFocused: true });
  };

  private handleBlur = () => {
    this.props.onBlur?.();
    this.setState({ isFocused: false });
  };

  private handleChange = (selectStruct: LabeledValue | LabeledValue[] | undefined): void => {
    const { onChange } = this.props;

    // сделано для зануления стейта поиска после перехода на другую вкладку браузера и обратно
    const { searchText } = this.state;

    if (searchText) {
      this.handleSearchChange("");
    }

    selectStruct = isArray(selectStruct) ? selectStruct : selectStruct ? [selectStruct] : [];
    onChange(compact(map(selectStruct, ({ value }) => this.mapSelectValueToModel(value))));
  };

  private renderOptions(modelList: TDictionary<IModel> | IModel[]): React.ReactNode[] {
    const { handlerDisplayValues, handlerTitleValues, rowDisable, localization } = this.props;

    return map(modelList, (item: IModel) => {
      let displayName: React.ReactNode = item?.getDisplayName();
      let title: string | undefined;

      if (isFunction(handlerDisplayValues)) {
        displayName = handlerDisplayValues(item);
      }

      if (handlerTitleValues) {
        title = handlerTitleValues(item);
      }

      return (
        <Select.Option
          key={item.getInnerName()}
          value={item.getInnerName()}
          test-id={autocompleteSelectOptionTestId}
          disabled={rowDisable ? rowDisable(item) : undefined}
        >
          <Tooltip title={title}>
            {!isUndefined(displayName) && !isNull(displayName) && displayName !== "" ? (
              <AlignedTooltip>{displayName}</AlignedTooltip>
            ) : (
              localization.getLocalized(NOT_SELECTED)
            )}
          </Tooltip>
        </Select.Option>
      );
    });
  }

  private renderGroupedOptions(): React.ReactNode[] {
    const { loading } = this.props;

    if (!this.modelListByGroups) {
      return [];
    }

    const items = !loading ? this.modelListByGroups : {};

    return map(items, (value, key) => {
      return (
        <Select.OptGroup key={key} label={key}>
          {this.renderOptions(value)}
        </Select.OptGroup>
      );
    });
  }

  private renderStandardOptions(): React.ReactNode[] {
    const { autocompleteStore, loading } = this.props;

    const modelsMap = autocompleteStore.map;

    const items = modelsMap && !loading ? Array.from(modelsMap, ([, model]) => model) : [];

    return this.renderOptions(items);
  }

  private renderDropDownOptions(): React.ReactNode[] {
    if (this.modelListByGroups) {
      return this.renderGroupedOptions();
    }

    return this.renderStandardOptions();
  }

  @boundMethod
  private tagRender({ label, closable, onClose }: CustomTagProps): React.ReactElement {
    const { handlerTitleValues } = this.props;

    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const closeIcon = <CloseOutlined onMouseDown={handleMouseDown} css={closeIconStyle} />;

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        css={!closable ? disableTagStyle : tagStyle}
        closeIcon={closeIcon}
        title={handlerTitleValues ? "" : undefined}
        isWithoutTooltipWrapper={true}
      >
        {label}
      </Tag>
    );
  }

  private getAllowClear() {
    const { allowClear } = this.props;

    if (allowClear === true) {
      return _Select.clearIcon;
    }

    if (typeof allowClear === "object" && !isNull(allowClear)) {
      return allowClear;
    }

    return false;
  }

  public override render(): React.ReactNode {
    const {
      mode: antSelectMode,
      placeholder,
      autocompleteStore,
      value: fieldValue,
      disabled,
      hintContainer,
      localization,
      showArrow,
      autoFocus,
      autoFocusWithPreventScroll,
      style,
      tagRender,
      getPopupContainer,
      isHasAccess,
      maxTagCount,
      maxTagPlaceholder,
      prepareOptionForSearch,
      onSelect,
      onDeselect,
      onClear,
      onClick,
      dropdownStyle,
      label,
      innerRef,
      showSearch,
      listHeight,
    } = this.props;

    const { searchText, isFocused } = this.state;
    let value: LabeledValue[] = this.getSelectValue(localization, fieldValue);
    let mode = antSelectMode;

    if (disabled && isEmpty(value)) {
      value = [
        {
          label: localization.getLocalized(NOT_SELECTED),
          value: undefined as any,
        },
      ];

      mode = undefined;
    }

    return (
      <>
        <Select<LabeledValue | LabeledValue[] | undefined>
          innerRef={innerRef}
          open={isFocused ? undefined : false}
          key="ant-select"
          mode={mode}
          aria-label={label}
          searchValue={searchText}
          dropdownStyle={dropdownStyle}
          placeholder={placeholder}
          loading={this.isFirstLoading() && this.state.hasBeenOpenedDropdown}
          labelInValue={true}
          value={value}
          onBlur={this.handleBlur}
          allowClear={this.getAllowClear()}
          onFocus={this.handleFocus}
          showSearch={showSearch ?? true}
          filterOption={false}
          showArrow={showArrow}
          disabled={disabled}
          notFoundContent={
            autocompleteStore.isDataLoaded ? (
              <DropdownPendingPlaceholder
                isDataLoaded={autocompleteStore.isDataLoaded}
                loading={autocompleteStore.isLoading}
                hasAccess={isHasAccess}
                searchText={searchText}
              />
            ) : null
          }
          suffixIcon={!disabled ? this.getSuffixIcon(!!disabled) : null}
          onSearch={this.handleSearchChange}
          onChange={this.handleChange}
          onDropdownVisibleChange={this.handleDropdownVisibleChange}
          autoFocus={autoFocus}
          autoFocusWithPreventScroll={autoFocusWithPreventScroll}
          showAction={this.props.showAction}
          test-id={this.props["test-id"] ?? autocompleteSelectTestId}
          style={style}
          tagRender={tagRender ?? this.tagRender}
          getPopupContainer={getPopupContainer}
          virtual={false}
          maxTagCount={maxTagCount}
          maxTagPlaceholder={maxTagPlaceholder}
          prepareOptionForSearch={prepareOptionForSearch}
          isClearIconOverSuffix={this.props.isClearIconOverSuffix}
          onSelect={onSelect}
          onDeselect={onDeselect}
          onClear={onClear}
          onClick={onClick}
          listHeight={listHeight}
        >
          {this.renderDropDownOptions()}
          {this.getHintOption()}
        </Select>
        <div css={hintContainerStyle}>{hintContainer}</div>
      </>
    );
  }
}

const SelectComponent = withLoc(observer(_Select));

export { SelectComponent, defaultTitleValuesHandler };
