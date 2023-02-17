import React from "react";
import { SelectComponent } from "../SelectComponent/SelectComponent";
import type {
  IAutoCompleteFormFieldProps,
  IAutoCompleteProps,
  IAutoCompleteState,
  IAutoCompleteFieldProps,
  TAutoCompleteFieldValue,
} from "./AutoCompleteField.types";
import { isFunction, map, forEach, some, isEqual, every } from "lodash";
import { wrapperAutocompleteStyle } from "./AutoCompleteField.styles";
import type { IModel } from "@im/models";
import { withFeature } from "../../../../decorators/hocs/withFeature/withFeature";
import { Field } from "../../FormField/Field/Field";
import { FormField } from "../../FormField/FormField";
import type { ICommonTableCellProps } from "../../TableCellField/TableCellField.types";
import { TableCellField } from "../../TableCellField/TableCellField";
import { headerModes } from "../../../DataTable/DataTableHeader/DataTableHeader";
import { DataTableDrawer } from "../../../drawers/DataTableDrawer/DataTableDrawer";

class AutoComplete extends React.PureComponent<IAutoCompleteProps, IAutoCompleteState> {
  public static defaultProps: Partial<IAutoCompleteProps> = {
    mode: undefined,
    isDrawerEnabled: true,
    removeContradictions: false,
    allowClear: false,
    headerMode: headerModes.SIMPLE_INPUT,
  };

  public override readonly state = {
    showDrawer: false,
  };

  private emptySelectedModels: IModel[] = [];

  private showDrawer = (e: React.SyntheticEvent<HTMLElement>): void => {
    e.stopPropagation();
    this.setState({ showDrawer: true });
  };

  private handleCloseDrawer = (): void => {
    this.setState({ showDrawer: false });
  };

  private handleChange = async (value: TAutoCompleteFieldValue) => {
    const {
      input: { onChange },
      onChangeCallback,
      removeContradictions,
    } = this.props;

    if (onChange) {
      const newValue = removeContradictions ? this.removeContradictions(value) : value;

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

  private handleBlur = (): void => {
    const onBlur = this.props.input?.onBlur;

    if (onBlur) {
      onBlur();
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
        requestOnMount,
        rowDisable,
        queryVariables,
        handlerTableDisplayValues,
        showHeader,
        headerMode,
        dataAccessKeys,
        isFeatureEnabled,
        columnConfig,
      } = this.props;

      if (isDrawerEnabled && tableStore) {
        return (
          <DataTableDrawer
            key="data-table-drawer"
            headerMode={headerMode}
            selectionType={tableSelectionType}
            title={drawerTitle}
            selectedModels={value ? value : this.emptySelectedModels}
            okText={okText}
            cancelText={cancelText}
            tableStore={tableStore}
            onClose={this.handleCloseDrawer}
            onSaveData={this.handleChange}
            isGroupSelection={removeContradictions}
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
      style,
      tagRender,
      labelPropsGetter,
      dataAccessKeys,
      isFeatureEnabled,
      groupBy,
      prepareOptionForSearch,
    } = this.props;

    const isDisabled = readOnly || disabled;
    const showDrawerIcon = isDrawerEnabled && !isDisabled;

    return (
      <>
        <SelectComponent
          key="select"
          mode={mode}
          style={style}
          value={value}
          disabled={isDisabled}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
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
          tagRender={tagRender}
          labelPropsGetter={labelPropsGetter}
          groupBy={groupBy}
          prepareOptionForSearch={prepareOptionForSearch}
          isClearIconOverSuffix={!showDrawerIcon}
        />
        {this.getDrawer()}
      </>
    );
  }
}

// todo: Виктор Пименов: разобраться с типами
const AutoCompleteWithFeature = withFeature(
  AutoComplete
) as React.ComponentType<IAutoCompleteProps>;

const AutoCompleteField: React.FC<IAutoCompleteFieldProps> = (props) => (
  <Field component={AutoCompleteWithFeature} isEqual={isEqual} {...props} />
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
