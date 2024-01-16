import React from "react";
import { map, isUndefined, isFunction, isString, isNull } from "lodash";
import { autocompleteSelectTestId, autocompleteSelectOptionTestId } from "../../../utils/TestIds";
import { observer } from "mobx-react";
import { closeCircleStyle } from "../AutoCompleteField/SelectComponent/SelectComponent.styles";
import type {
  IAutoFillComponentProps,
  IAutoFillComponentState,
  TAutoFillOption,
} from "./AutoFillComponent.types";
import { autoFillComponentArrowIconStyle } from "./AutoFillField.styles";
import type { DefaultOptionType } from "antd/lib/select";
import { CloseCircleFilled, SearchOutlined } from "../../Icons/Icons";
import type { Localization } from "@infomaximum/localization";
import type { IModel } from "@infomaximum/graphql-model";
import {
  ENTER_OR_SELECT_FROM_THE_LIST,
  NOT_SELECTED,
} from "../../../utils/Localization/Localization";
import { KeyupRequestInterval } from "../../../utils/const";
import { AutoComplete } from "../../AutoComplete/AutoComplete";
import { DropdownPendingPlaceholder } from "../../Select/DropdownPendingPlaceholder/DropdownPendingPlaceholder";
import { withLoc } from "../../../decorators/hocs/withLoc/withLoc";

class AutoFill extends React.PureComponent<IAutoFillComponentProps, IAutoFillComponentState> {
  public static defaultProps = {
    requestOnMount: false,
    showArrow: true,
    isHasAccess: true,
    isOptionHintDisplayed: true,
  };

  public static clearIcon = (<CloseCircleFilled css={closeCircleStyle} />);
  private searchTimer: NodeJS.Timer | undefined;

  constructor(props: IAutoFillComponentProps) {
    super(props);

    this.searchTimer = undefined;

    this.state = {
      searchText: undefined,
      isOpenedDropdown: props.defaultOpen ?? false,
      hasBeenOpenedDropdown: false,
    };
  }

  public override componentDidMount(): void {
    const {
      autocompleteStore,
      queryVariables: variables,
      requestOnMount,
      isHasAccess,
    } = this.props;

    if (requestOnMount && isHasAccess) {
      autocompleteStore.searchValueChange(undefined);

      autocompleteStore.requestData({
        variables,
      });
    }
  }

  public override componentDidUpdate(
    prevProps: IAutoFillComponentProps,
    prevState: IAutoFillComponentState
  ): void {
    if (this.props.isHasAccess && this.state.searchText !== prevState.searchText) {
      this.onSearch();
    }

    if (prevProps.isHasAccess && !this.props.isHasAccess) {
      const { autocompleteStore } = this.props;

      autocompleteStore.clearData();
    }
  }

  public override componentWillUnmount(): void {
    const { autocompleteStore } = this.props;

    autocompleteStore.clearData();
  }

  private isFirstLoading() {
    const { autocompleteStore } = this.props;

    return autocompleteStore.isLoading && !autocompleteStore.isDataLoaded;
  }

  private getSelectValue(localization: Localization, fieldValue: IModel) {
    const { disabled } = this.props;

    const displayValue = fieldValue?.getDisplayName?.();

    if (disabled && !fieldValue) {
      return localization.getLocalized(NOT_SELECTED);
    }

    return displayValue;
  }

  private onSearch = (): void => {
    const { autocompleteStore, queryVariables: variables } = this.props;
    const { searchText } = this.state;

    this.searchTimer && clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      if (isString(searchText)) {
        autocompleteStore.searchValueChange(searchText, variables);
      }
    }, KeyupRequestInterval);
  };

  private handleSearchChange = (searchValue: string): void => {
    this.setState({
      searchText: searchValue,
    });
  };

  private handleDropdownVisibleChange = (isOpened: boolean): void => {
    const { autocompleteStore, queryVariables: variables, isHasAccess } = this.props;

    if (isOpened && !this.state.hasBeenOpenedDropdown) {
      this.setState({
        hasBeenOpenedDropdown: true,
      });
    }

    if (isOpened && isHasAccess) {
      autocompleteStore.searchValueChange(undefined);

      autocompleteStore.requestData({
        variables,
      });
    }

    this.setState({
      isOpenedDropdown: isOpened,
    });
  };

  private handleSelect = (value: string, option: DefaultOptionType): void => {
    const { onChange, autocompleteStore, onSelectCallback } = this.props;

    const modelsMap = autocompleteStore.map;

    const selectedModel = modelsMap?.get(option.key);

    if (modelsMap && option.key && selectedModel) {
      isFunction(onChange) && onChange(selectedModel);

      isFunction(onSelectCallback) && onSelectCallback(selectedModel);
    }
  };

  private handleChange = (value: string, opt: any): void => {
    const { onChange, autocompleteStore } = this.props;

    const modelsMap = autocompleteStore.map;

    const option: TAutoFillOption = opt;

    if (isUndefined(value)) {
      isFunction(onChange) && onChange();
    } else if (modelsMap && option.key && modelsMap.get(option.key)) {
      isFunction(onChange) && onChange(modelsMap.get(option.key));
    }
  };

  private handleBlur = (): void => {
    const { onBlur, onChange, value } = this.props;

    isFunction(onChange) && onChange(value);

    isFunction(onBlur) && onBlur();
    this.setState({ searchText: undefined });
  };

  private getPrepareDisplayValue(value: string | undefined) {
    const { localization } = this.props;

    return !isUndefined(value) && !isNull(value) && value !== ""
      ? value
      : localization.getLocalized(NOT_SELECTED);
  }

  private isOpenedDropdown() {
    return this.props.autocompleteStore.isDataLoaded && this.state.isOpenedDropdown;
  }

  private getSuffixIcon() {
    if (this.isOpenedDropdown()) {
      return <SearchOutlined />;
    }
  }

  public override render(): React.ReactNode {
    const {
      placeholder,
      autocompleteStore,
      value: fieldValue,
      onFocus,
      disabled,
      localization,
      allowClear,
      rowDisable,
      showArrow,
      autoFocus,
      isHasAccess,
      autoFillComponentStyle,
      defaultOpen,
      style,
      dropdownStyle,
      getPrepareDisplayValue,
      suffixIcon,
      isOptionHintDisplayed,
    } = this.props;

    const modelsMap = autocompleteStore.map;

    const items = (modelsMap && Array.from(modelsMap, ([, model]) => model)) ?? [];

    return (
      <>
        <AutoComplete
          key="ant-autocomplete"
          placeholder={placeholder || localization.getLocalized(ENTER_OR_SELECT_FROM_THE_LIST)}
          loading={this.isFirstLoading() && this.state.hasBeenOpenedDropdown}
          backfill={true}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          value={this.state.searchText ?? this.getSelectValue(localization, fieldValue)}
          allowClear={allowClear}
          onFocus={onFocus}
          showSearch={true}
          filterOption={false}
          showArrow={showArrow}
          disabled={disabled}
          notFoundContent={
            <DropdownPendingPlaceholder
              isDataLoaded={autocompleteStore.isDataLoaded}
              loading={autocompleteStore.isLoading}
              hasAccess={isHasAccess}
              searchText={this.state.searchText}
            />
          }
          clearIcon={AutoFill.clearIcon}
          suffixIcon={suffixIcon ? suffixIcon : !disabled ? this.getSuffixIcon() : undefined}
          onSearch={this.handleSearchChange}
          onSelect={this.handleSelect}
          onDropdownVisibleChange={this.handleDropdownVisibleChange}
          autoFocus={autoFocus}
          test-id={this.props["test-id"] ?? autocompleteSelectTestId}
          css={autoFillComponentStyle ? autoFillComponentStyle : autoFillComponentArrowIconStyle}
          style={style}
          defaultOpen={defaultOpen}
          open={this.isOpenedDropdown()}
          dropdownStyle={dropdownStyle}
        >
          {map(items, (item) => {
            let displayValue: string;

            if (isFunction(getPrepareDisplayValue)) {
              displayValue = getPrepareDisplayValue(item?.getDisplayName());
            } else {
              displayValue = this.getPrepareDisplayValue(item?.getDisplayName());
            }

            return (
              <AutoComplete.Option
                key={item.getInnerName()}
                value={displayValue}
                test-id={autocompleteSelectOptionTestId}
                title={isOptionHintDisplayed ? displayValue : ""}
                disabled={rowDisable ? rowDisable(item) : undefined}
              >
                {displayValue}
              </AutoComplete.Option>
            );
          })}
        </AutoComplete>
      </>
    );
  }
}

const AutoFillComponent = withLoc(observer(AutoFill));

export { AutoFillComponent };
