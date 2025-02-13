import React from "react";
import { SelectComponent } from "../SelectComponent/SelectComponent";
import type {
  IAutoCompleteFormFieldProps,
  IAutoCompleteProps,
  IAutoCompleteState,
  IAutoCompleteFieldProps,
  TAutoCompleteFieldValue,
} from "./AutoCompleteField.types";
import { isFunction, map, forEach, some, every, isEmpty, xorBy, filter } from "lodash";
import { wrapperAutocompleteStyle } from "./AutoCompleteField.styles";
import { type IModel, Group } from "@infomaximum/graphql-model";
import { withFeature } from "../../../../decorators/hocs/withFeature/withFeature";
import { Field } from "../../FormField/Field/Field";
import { FormField } from "../../FormField/FormField";
import type { ICommonTableCellProps } from "../../TableCellField/TableCellField.types";
import { TableCellField } from "../../TableCellField/TableCellField";
import { headerModes } from "../../../DataTable/DataTableHeader/DataTableHeader";
import { DataTableDrawer } from "../../../drawers/DataTableDrawer/DataTableDrawer";

const isSameValue = (a: TAutoCompleteFieldValue, b: TAutoCompleteFieldValue) => {
  return isEmpty(xorBy(a, b, (item) => item.getInnerName()));
};

class AutoComplete extends React.PureComponent<IAutoCompleteProps, IAutoCompleteState> {
  public static defaultProps: Partial<IAutoCompleteProps> = {
    mode: undefined,
    isDrawerEnabled: true,
    removeContradictions: false,
    isWithoutParentsGroupSelection: false,
    allowClear: false,
    headerMode: headerModes.SIMPLE_INPUT,
  };

  private selectRef: React.MutableRefObject<HTMLElement | null>;

  constructor(props: IAutoCompleteProps) {
    super(props);
    this.selectRef = React.createRef();
  }

  public override readonly state = {
    showDrawer: false,
  };

  private emptySelectedModels: IModel[] = [];

  private showDrawer = (e: React.SyntheticEvent<HTMLElement>): void => {
    e.stopPropagation();
    this.setState({ showDrawer: true });
    this.selectRef.current?.blur();

    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  };

  private handleCloseDrawer = (): void => {
    this.setState({ showDrawer: false });
  };

  private handleChange = async (value: TAutoCompleteFieldValue) => {
    const {
      input: { onChange },
      onChangeCallback,
      removeContradictions,
      isWithoutParentsGroupSelection,
    } = this.props;

    if (onChange) {
      const newValue = removeContradictions
        ? this.removeContradictions(value)
        : isWithoutParentsGroupSelection
          ? this.removeGroups(value)
          : value;

      onChange(newValue ?? []);

      if (onChangeCallback && isFunction(onChangeCallback)) {
        onChangeCallback(value);
      }
    }
  };

  private handleFocus = (): void => {
    const onFocus = this.props.input?.onFocus;

    if (onFocus) {
      onFocus();
    }
  };

  private handleSearch = (searchText: string): void => {
    const { onSearch } = this.props;

    if (isFunction(onSearch)) {
      onSearch(searchText);
    }
  };

  private handleBlur = (): void => {
    const {
      input: { onBlur },
      onBlur: onBlurProps,
    } = this.props;

    if (onBlur) {
      onBlur();
    }

    if (onBlurProps) {
      onBlurProps();
    }
  };

  private removeContradictions(models: TAutoCompleteFieldValue): TAutoCompleteFieldValue {
    const modelsMap = new Map(map(models, (model) => [model.getInnerName(), model]));

    // Если хотя бы один родитель элемента есть в списке, удаляем элемент из списка
    forEach(models, (model) => {
      const parents = (model as IModel & { getParents?(): TNullable<IModel[]> }).getParents?.();

      if (some(parents, (parent) => modelsMap.has(parent.getInnerName()))) {
        modelsMap.delete(model.getInnerName());
      }
    });

    return [...modelsMap.values()];
  }

  private removeGroups(models: TAutoCompleteFieldValue): TAutoCompleteFieldValue {
    return filter(models, (model) => !(model instanceof Group));
  }

  private getDrawer(): React.ReactNode {
    if (this.state.showDrawer) {
      const {
        tableStore,
        drawerTitle,
        okText,
        cancelText,
        input: { value },
        tableSelectionType,
        isDrawerEnabled,
        removeContradictions,
        isWithoutParentsGroupSelection,
        requestOnMount,
        rowDisable,
        queryVariables,
        handlerTableDisplayValues,
        showHeader,
        headerMode,
        dataAccessKeys,
        isFeatureEnabled,
        columnConfig,
        renderDrawer,
        drawerAutoFocus,
        rowSelection,
      } = this.props;

      const selectedModels = value ? value : this.emptySelectedModels;

      if (renderDrawer) {
        return renderDrawer({
          onClose: this.handleCloseDrawer,
          onSubmit: this.handleChange,
          selectedModels,
        });
      }

      if (isDrawerEnabled && tableStore) {
        return (
          <DataTableDrawer
            key="data-table-drawer"
            headerMode={headerMode}
            selectionType={tableSelectionType}
            title={drawerTitle}
            selectedModels={selectedModels}
            okText={okText}
            cancelText={cancelText}
            tableStore={tableStore}
            onClose={this.handleCloseDrawer}
            onSaveData={this.handleChange}
            isGroupSelection={removeContradictions || isWithoutParentsGroupSelection}
            rowDisable={rowDisable}
            queryVariables={queryVariables}
            handlerTableDisplayValues={handlerTableDisplayValues}
            showHeader={showHeader}
            requestOnMount={requestOnMount}
            disableSubmitFormButtonOnEmpty={false}
            isHasAccess={
              !!isFeatureEnabled &&
              every(dataAccessKeys, (accessKey) => isFeatureEnabled(accessKey))
            }
            columnConfig={columnConfig}
            autoFocus={drawerAutoFocus}
            rowSelection={rowSelection}
          />
        );
      }
    }

    return null;
  }

  public override render() {
    const {
      input: { value },
      mode,
      placeholder,
      autocompleteStore,
      isDrawerEnabled,
      disabled,
      hintContainer,
      readOnly,
      queryVariables,
      requestOnMount,
      allowClear,
      handlerDisplayValues,
      handlerTitleValues,
      handlerDisplaySelectedValues,
      rowDisable,
      showArrow,
      autoFocus,
      autoFocusWithPreventScroll,
      style,
      tagRender,
      labelPropsGetter,
      dataAccessKeys,
      isFeatureEnabled,
      groupBy,
      onSelect,
      searchText,
      prepareOptionForSearch,
      label,
      showSearch,
      suffixButtonTestId,
    } = this.props;

    const isDisabled = readOnly || disabled;
    const showDrawerIcon = isDrawerEnabled && !isDisabled;

    return (
      <>
        <SelectComponent
          innerRef={this.selectRef}
          label={label}
          key="select"
          mode={mode}
          style={style}
          value={value}
          searchValue={searchText}
          disabled={isDisabled}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onSelect={onSelect}
          onSearch={this.handleSearch}
          placeholder={placeholder}
          onChange={this.handleChange}
          onSuffixClick={showDrawerIcon ? this.showDrawer : undefined}
          autocompleteStore={autocompleteStore}
          hintContainer={hintContainer}
          queryVariables={queryVariables}
          requestOnMount={requestOnMount}
          handlerDisplayValues={handlerDisplayValues}
          isHasAccess={
            !!isFeatureEnabled && every(dataAccessKeys, (accessKey) => isFeatureEnabled(accessKey))
          }
          handlerTitleValues={handlerTitleValues}
          handlerDisplaySelectedValues={handlerDisplaySelectedValues}
          rowDisable={rowDisable}
          showArrow={readOnly ? false : showArrow}
          allowClear={allowClear}
          autoFocus={autoFocus}
          autoFocusWithPreventScroll={autoFocusWithPreventScroll}
          tagRender={tagRender}
          labelPropsGetter={labelPropsGetter}
          groupBy={groupBy}
          showSearch={showSearch}
          prepareOptionForSearch={prepareOptionForSearch}
          isClearIconOverSuffix={!showDrawerIcon}
          suffixButtonTestId={suffixButtonTestId}
        />
        {this.getDrawer()}
      </>
    );
  }
}

// todo: разобраться с типами
const AutoCompleteWithFeature = withFeature(
  AutoComplete
) as React.ComponentType<IAutoCompleteProps>;

const AutoCompleteField: React.FC<IAutoCompleteFieldProps> = (props) => (
  <Field component={AutoCompleteWithFeature} isEqual={isSameValue} {...props} />
);

const AutoCompleteFormField: React.FC<IAutoCompleteFormFieldProps> = (props) => (
  <FormField
    component={AutoCompleteField}
    wrapperComponentStyle={wrapperAutocompleteStyle}
    {...props}
  />
);

const AutoCompleteTableCellField: React.FC<IAutoCompleteFieldProps & ICommonTableCellProps> = (
  props
) => {
  return <TableCellField component={AutoCompleteField} {...props} />;
};

export { AutoCompleteFormField, AutoCompleteTableCellField, AutoCompleteField };
