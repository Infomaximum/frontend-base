import React from "react";
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
  ENTER_QUERY_OR_CHOOSE,
  REFINE_QUERY,
  SHOWED_ALL_CHANGE_QUERY,
  NOT_SELECTED,
} from "../../../../utils/Localization/Localization";
import {
  hintContainerStyle,
  suffixIconStyle,
  closeCircleStyle,
  inputSelectedContentStyle,
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
import type { RawValueType } from "rc-tree-select/lib/TreeSelect";
import { Group, type IModel } from "@im/models";
import { CloseCircleFilled } from "../../../Icons/Icons";
import type { Localization } from "@im/localization";
import { Tooltip } from "../../../Tooltip/Tooltip";
import { DropdownAnimationInterval, KeyupRequestInterval } from "../../../../utils/const";
import { Select } from "../../../Select/Select";
import { BarsSVG } from "../../../../resources/icons";
import { DropdownPendingPlaceholder } from "../../../Select/DropdownPendingPlaceholder/DropdownPendingPlaceholder";
import { withLoc } from "../../../../decorators/hocs/withLoc/withLoc";

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

  public static clearIcon = (<CloseCircleFilled css={closeCircleStyle} />);

  private disposer = this.getReaction();
  private modelListByGroups: TDictionary<IModel[]> | undefined;

  constructor(props: ISelectComponentProps) {
    super(props);

    this.state = {
      searchText: undefined,
      hasBeenOpenedDropdown: false,
      isDropdownOpened: false,
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
    const { autocompleteStore } = this.props;

    const modelsList = autocompleteStore.list;

    if (!isNil(modelsList) && isFunction(this.props.groupBy)) {
      this.modelListByGroups = groupBy(modelsList, this.props.groupBy);
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

            const title = handlerTitleValues ? handlerTitleValues(model) : model?.getDisplayName();

            return {
              value: model?.getInnerName(),
              label: (
                <div css={inputSelectedContentStyle} {...labelProps}>
                  <Tooltip title={title}>
                    {displayValue || localization.getLocalized(NOT_SELECTED)}
                  </Tooltip>
                </div>
              ),
            };
          })
        : [];
    }
  );

  private onSearch = () => {
    const { autocompleteStore, queryVariables, value } = this.props;
    const { searchText, isDropdownOpened } = this.state;

    const isSearchTextChanged = searchText !== autocompleteStore.searchValue;

    if (isSearchTextChanged && isString(searchText) && isDropdownOpened) {
      autocompleteStore.searchValueChange(searchText, mapExcludedData(value, queryVariables));
    }
  };

  private onSearchDebounced = debounce(this.onSearch, KeyupRequestInterval);

  private getFieldValueCollection = createSelector(identity, (models: IModel[]) => {
    const collection: TDictionary<IModel> = {};
    forEach(models, (item) => {
      collection[item.getInnerName()] = item;
    });
    return collection;
  });

  private mapSelectValueToModel(value: RawValueType) {
    const { autocompleteStore, value: fieldValue } = this.props;
    return autocompleteStore.list?.[value] ?? this.getFieldValueCollection(fieldValue)[value];
  }

  private getHintText(currentCount: number, nextCount: number, isSearch: boolean) {
    const { localization } = this.props;
    const generalCount = currentCount + nextCount;

    return nextCount && !isSearch
      ? localization.getLocalized(ENTER_QUERY_OR_CHOOSE, {
          templateData: {
            currentCount,
            generalCount,
          },
        })
      : nextCount
      ? localization.getLocalized(REFINE_QUERY, {
          templateData: {
            currentCount,
            generalCount,
          },
        })
      : localization.getLocalized(SHOWED_ALL_CHANGE_QUERY);
  }

  private getHintOption() {
    const { autocompleteStore } = this.props;
    const { wasDataSearched } = this.state;
    const { model } = autocompleteStore;

    if (!model) {
      return;
    }

    const currentCount = model.getItems().length;
    const nextCount = model.getNextCount();

    if ((nextCount === 0 && !wasDataSearched) || !currentCount) {
      return;
    }

    return (
      <Select.Option disabled={true}>
        <span css={hintOptionStyle}>
          {this.getHintText(currentCount, nextCount, wasDataSearched)}
        </span>
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
    const { onSuffixClick } = this.props;

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
        test-id={autocompleteSelectSuffixButtonTestId}
      >
        <BarsSVG />
      </div>
    );
  }

  private handleSearchChange = (searchText: string): void => {
    this.setState({ searchText }, () => {
      if (this.props.isHasAccess) {
        this.onSearchDebounced();
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
    selectStruct = isArray(selectStruct) ? selectStruct : selectStruct ? [selectStruct] : [];
    onChange(compact(map(selectStruct, ({ value }) => this.mapSelectValueToModel(value))));
  };

  private renderOptions(modelList: TDictionary<IModel> | IModel[]): React.ReactNode[] {
    const {
      handlerDisplayValues,
      handlerTitleValues,
      rowDisable,
      localization,
      isVisibleOptionsTooltip,
    } = this.props;

    return map(modelList, (item: IModel) => {
      let displayName: React.ReactNode = item?.getDisplayName();
      let title: string | undefined = String(displayName);

      if (isFunction(handlerDisplayValues)) {
        if (isString(handlerDisplayValues(item))) {
          displayName = handlerDisplayValues(item);
          title = String(displayName);
        } else {
          displayName = handlerDisplayValues(item);
        }
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
          <Tooltip title={title} visible={isVisibleOptionsTooltip}>
            {!isUndefined(displayName) && !isNull(displayName) && displayName !== ""
              ? displayName
              : localization.getLocalized(NOT_SELECTED)}
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

    const modelsList = autocompleteStore.list;

    const items = modelsList && !loading ? modelsList : {};

    return this.renderOptions(items);
  }

  private renderDropDownOptions(): React.ReactNode[] {
    if (this.modelListByGroups) {
      return this.renderGroupedOptions();
    }

    return this.renderStandardOptions();
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
      allowClear,
      showArrow,
      autoFocus,
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
          open={autocompleteStore.isDataLoaded && isFocused ? undefined : false}
          key="ant-select"
          mode={mode}
          dropdownStyle={dropdownStyle}
          placeholder={placeholder}
          loading={this.isFirstLoading() && this.state.hasBeenOpenedDropdown}
          labelInValue={true}
          value={value}
          onBlur={this.handleBlur}
          allowClear={allowClear}
          onFocus={this.handleFocus}
          showSearch={true}
          filterOption={false}
          showArrow={showArrow}
          disabled={disabled}
          notFoundContent={
            <DropdownPendingPlaceholder
              isDataLoaded={autocompleteStore.isDataLoaded}
              loading={autocompleteStore.isLoading}
              hasAccess={isHasAccess}
              searchText={searchText}
            />
          }
          suffixIcon={!disabled ? this.getSuffixIcon(!!disabled) : null}
          clearIcon={_Select.clearIcon}
          onSearch={this.handleSearchChange}
          onChange={this.handleChange}
          onDropdownVisibleChange={this.handleDropdownVisibleChange}
          autoFocus={autoFocus}
          test-id={this.props["test-id"] ?? autocompleteSelectTestId}
          style={style}
          tagRender={tagRender}
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
