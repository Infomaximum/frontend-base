import React from "react";
import { SelectComponent } from "@infomaximum/base/src/components/fields/AutoCompleteField/SelectComponent/SelectComponent";
import type {
  IAutoCompleteFormFieldProps,
  IAutoCompleteProps,
  IAutoCompleteState,
  IAutoCompleteFieldProps,
  TAutoCompleteFieldValue,
} from "@infomaximum/base/src/components/fields/AutoCompleteField/AutoCompleteFormField/AutoCompleteField.types";
import { isFunction, map, forEach, some, every, isEmpty, xorBy, filter, difference } from "lodash";
import { wrapperAutocompleteStyle } from "@infomaximum/base/src/components/fields/AutoCompleteField/AutoCompleteFormField/AutoCompleteField.styles";
import { type IModel, Group } from "@infomaximum/graphql-model";
import { withFeature, withLoc } from "@infomaximum/base/src/decorators";
import { Field } from "@infomaximum/base/src/components/fields/FormField/Field/Field";
import { FormField } from "@infomaximum/base/src/components/fields/FormField/FormField";
import type { ICommonTableCellProps } from "@infomaximum/base/src/components/fields/TableCellField/TableCellField.types";
import { TableCellField } from "@infomaximum/base/src/components/fields/TableCellField/TableCellField";
import { headerModes } from "@infomaximum/base/src/components/DataTable/DataTableHeader/DataTableHeader";
import { DataTableDrawer } from "@infomaximum/base/src/components/drawers/DataTableDrawer/DataTableDrawer";
import { Message } from "@infomaximum/base/src/components/Message";
import { ELEMENT_ALREADY_BELONGS_TO_SELECTED_OBJECT } from "@infomaximum/base/src/utils";
import { symmetricDifference } from "@infomaximum/base/src/components/fields/AutoCompleteField/AutoCompleteFormField/AutoCompleteField.utils";

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
      input: { onChange, value: initialValue },
      onChangeCallback,
      removeContradictions,
      isWithoutParentsGroupSelection,
    } = this.props;

    if (onChange) {
      const newValue = removeContradictions
        ? this.removeContradictions(initialValue, value)
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

  private removeContradictions(
    initialModels: TAutoCompleteFieldValue,
    models: TAutoCompleteFieldValue
  ): TAutoCompleteFieldValue {
    const { localization } = this.props;

    const modelsMap = new Map(map(models, (model) => [model.getInnerName(), model]));

    const initialModelsNames = map(initialModels, (item) => item.getInnerName());
    const modelsMapNames = map([...modelsMap.values()], (item) => item.getInnerName());
    const newValuesLength = difference(modelsMapNames, initialModelsNames).length;

    // Если хотя бы один родитель элемента есть в списке, удаляем элемент из списка
    forEach(models, (model) => {
      const parents = (model as IModel & { getParents?(): TNullable<IModel[]> }).getParents?.();

      if (some(parents, (parent) => modelsMap.has(parent.getInnerName()))) {
        modelsMap.delete(model.getInnerName());
      }
    });

    const resultModelsMapNames = map([...modelsMap.values()], (item) => item.getInnerName());

    //  Массив элементов, которые входят ТОЛЬКО в один из массивов
    const symmetricDifferenceModelsNames = symmetricDifference(
      resultModelsMapNames,
      initialModelsNames
    );

    if (!symmetricDifferenceModelsNames.length && localization) {
      Message.showMessage({
        notification: localization.getLocalized(
          ELEMENT_ALREADY_BELONGS_TO_SELECTED_OBJECT(newValuesLength === 1)
        ),
        type: "error",
        config: { maxCount: 1 },
      });
    }

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
        isVirtualized,
        rowHeight,
        drawerStyles,
        onStartClosing,
        isShowDividers,
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
            isVirtualized={isVirtualized}
            rowHeight={rowHeight}
            styles={drawerStyles}
            onStartClosing={onStartClosing}
            isShowDividers={isShowDividers}
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
      suffixIcon,
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
          suffixIcon={readOnly ? null : suffixIcon}
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
const AutoCompleteWithFeature = withLoc(
  withFeature(AutoComplete) as React.ComponentType<IAutoCompleteProps>
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
