import React from "react";
import { SelectComponent } from "../SelectComponent/SelectComponent";
import type {
  IInputDrawerFormFieldProps,
  IInputDrawerProps,
  IInputDrawerState,
  IInputDrawerFieldProps,
  TInputDrawerFieldValue,
} from "./InputDrawerField.types";
import { isFunction, map, forEach, some, isUndefined, isEqual } from "lodash";
import { wrapperInputDrawerStyle } from "./InputDrawerField.styles";
import type { IModel } from "@infomaximum/graphql-model";
import { Field } from "../../FormField/Field/Field";
import { FormField } from "../../FormField/FormField";
import type { ICommonTableCellProps } from "../../TableCellField/TableCellField.types";
import { TableCellField } from "../../TableCellField/TableCellField";
import { headerModes } from "../../../DataTable/DataTableHeader/DataTableHeader";
import { DataTableDrawer } from "../../../drawers/DataTableDrawer/DataTableDrawer";

class InputDrawer extends React.PureComponent<IInputDrawerProps, IInputDrawerState> {
  public static defaultProps: Partial<IInputDrawerProps> = {
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

  private showDrawer = (e: React.SyntheticEvent<Element>): void => {
    e?.stopPropagation?.();
    this.setState({ showDrawer: true });
  };

  private handleCloseDrawer = (): void => {
    this.setState({ showDrawer: false });
  };

  private handleChange = async (value: TInputDrawerFieldValue) => {
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

  private removeContradictions(models: TInputDrawerFieldValue): TInputDrawerFieldValue {
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
        isHasAccess,
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
            isHasAccess={isHasAccess}
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
      isDrawerEnabled,
      disabled,
      hintContainer,
      readOnly,
      allowClear,
      handlerDisplayValues,
      handlerTitleValues,
      handlerDisplaySelectedValues,
      showArrow,
      autoFocus,
      style,
      tagRender,
      labelPropsGetter,
    } = this.props;

    const isDisabled = readOnly || disabled;

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
          onSuffixClick={isDrawerEnabled && !isDisabled ? this.showDrawer : undefined}
          hintContainer={hintContainer}
          handlerDisplayValues={handlerDisplayValues}
          handlerTitleValues={handlerTitleValues}
          handlerDisplaySelectedValues={handlerDisplaySelectedValues}
          showArrow={readOnly ? false : showArrow}
          allowClear={!isDrawerEnabled && allowClear && isUndefined(mode)}
          autoFocus={autoFocus}
          tagRender={tagRender}
          labelPropsGetter={labelPropsGetter}
        />
        {this.getDrawer()}
      </>
    );
  }
}

const InputDrawerField: React.FC<IInputDrawerFieldProps> = (props) => (
  <Field component={InputDrawer} isEqual={isEqual} {...props} />
);

const InputDrawerFormField: React.FC<IInputDrawerFormFieldProps> = (props) => (
  <FormField
    component={InputDrawerField}
    wrapperComponentStyle={wrapperInputDrawerStyle}
    {...props}
  />
);

const InputDrawerTableCellField: React.FC<IInputDrawerFieldProps & ICommonTableCellProps> = (
  props
) => {
  return <TableCellField component={InputDrawerField} {...props} />;
};

export { InputDrawerFormField, InputDrawerField, InputDrawerTableCellField };
