import React, { memo, useContext } from "react";
import { FieldArray } from "react-final-form-arrays";
import { isFunction, map, isNil, isUndefined, isNumber, isEqual, isString, uniqueId } from "lodash";
import {
  addButtonStyle,
  addButtonWrapperStyle,
  addEntityButtonStyle,
  buttonDescriptionWrapperStyle,
  wrappedArrayFieldStyle,
  getRowsContainerStyle,
} from "./ArrayField.styles";
import type {
  IWrappedArrayFieldProps,
  IWrappedArrayFieldState,
  IArrayFieldProps,
} from "./ArrayField.types";
import { getAccessParameters, EOperationType } from "@infomaximum/utility";
import { createSelector } from "reselect";
import type { Interpolation } from "@emotion/react";
import { Button } from "../../Button/Button";
import { PlusSVG } from "../../../resources/icons";
import { FormOption } from "../FormOption/FormOption";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { withFeature } from "../../../decorators/hocs/withFeature/withFeature";
import { SpaceSizeContext } from "../../../decorators/contexts/SpaceSizeContext";

export enum EAddEntityButtonPositions {
  top = "top",
  bottom = "bottom",
  none = "none",
}

class WrappedArrayField extends React.PureComponent<
  IWrappedArrayFieldProps,
  IWrappedArrayFieldState
> {
  private writeAccess: boolean = true;
  private createAccess: boolean = true;
  private deleteAccess: boolean = true;

  public static defaultProps: Partial<IWrappedArrayFieldProps> = {
    addEntityButtonPosition: EAddEntityButtonPositions.top,
  };

  constructor(props: IWrappedArrayFieldProps) {
    super(props);

    const { accessKey, isFeatureEnabled } = props;

    if (isFunction(props.setArrayFieldProvider)) {
      props.setArrayFieldProvider({
        addFieldEntity: this.handleAddFieldEntity,
        removeFieldEntity: this.handleRemoveFieldEntity,
        batchRemoveFieldEntities: this.onBatchRemoveFieldEntities,
      });
    }

    if (accessKey && isFeatureEnabled) {
      this.writeAccess = isFeatureEnabled(accessKey, {
        accessType: EOperationType.WRITE,
      });
      this.createAccess = isFeatureEnabled(accessKey, {
        accessType: EOperationType.CREATE,
      });
      this.deleteAccess = isFeatureEnabled(accessKey, {
        accessType: EOperationType.DELETE,
      });
    }
  }

  private getResultFormItemStyle = createSelector(
    (formItemStyle?: Interpolation<TTheme>) => formItemStyle,
    (formItemStyle) => {
      const resultFormItemStyle = [wrappedArrayFieldStyle as Interpolation<TTheme>];

      if (formItemStyle) {
        resultFormItemStyle.push(formItemStyle);
      }

      return resultFormItemStyle;
    }
  );

  private handleAddFieldEntity = () => {
    const { formProvider, defaultEntityValue, addEntityButtonPosition, arrayFieldName } =
      this.props;

    if (formProvider) {
      const addMethod =
        addEntityButtonPosition === EAddEntityButtonPositions.top
          ? formProvider.mutators.unshift
          : formProvider.mutators.push;

      if (!isUndefined(defaultEntityValue)) {
        addMethod?.(arrayFieldName, defaultEntityValue);
      } else {
        addMethod?.(arrayFieldName, { uniqueKey: uniqueId("_") });
      }
    }
  };

  public handleRemoveFieldEntity = (index: number) => {
    const { fields } = this.props;
    fields.remove(index);
  };

  public onBatchRemoveFieldEntities = (indexes: number[]) => {
    const { fields } = this.props;

    for (let i = 0; i < indexes.length; i += 1) {
      const index = indexes[i];

      if (isNumber(index)) {
        fields.remove(index - i);
      }
    }
  };

  private getAutoFocusStatusByIndex(index: number): boolean {
    const {
      fields,
      addEntityButtonPosition,
      autoFocus,
      meta: { dirty },
    } = this.props;

    if (!autoFocus) {
      return false;
    }

    if (addEntityButtonPosition === EAddEntityButtonPositions.bottom) {
      if (index === 0 && dirty) {
        return true; // фикс автофокуса первого элемента
      }

      if (fields?.length && fields?.length > 1 && dirty) {
        return index === fields.length - 1;
      }
    } else {
      return index === 0; // Не удалось реализовать autoFocus на input'ы при добавлении новых в начало массива (unshift)
    }

    return false;
  }

  private getFields = (): React.ReactNode[] => {
    const {
      arrayFieldName,
      readOnly,
      fieldEntityComponent: EntityComponent,
      fieldEntityComponentProps,
    } = this.props;

    const fields = this.props.fields.value;

    if (readOnly && !fields?.length) {
      return ["—"];
    }

    const fieldComponents = map(fields, (field, index) => {
      const fieldEntityPath = `${arrayFieldName}[${index}]`;
      const newField = !field?.id;

      const title = isString(this.props.label) ? this.props.label : "";

      return (
        <div key={field?.uniqueKey ?? field?.id ?? fieldEntityPath}>
          <label htmlFor={arrayFieldName} title={title} />
          <EntityComponent
            id={arrayFieldName}
            key={index}
            onRemoveFieldEntity={this.handleRemoveFieldEntity}
            fieldEntityPath={fieldEntityPath}
            fieldEntityIndex={index}
            readOnly={newField ? readOnly : false}
            isRemoveItem={!!fields.length && fields.length > 1 && !readOnly}
            writeAccess={this.writeAccess}
            removeAccess={this.deleteAccess}
            autoFocus={newField ? this.getAutoFocusStatusByIndex(index) : undefined}
            {...fieldEntityComponentProps}
          />
        </div>
      );
    });

    return fieldComponents;
  };

  private getAddEntityButton = () => {
    const { addButtonDescription, readOnly, fields, additionalButtonContent, formProvider } =
      this.props;

    const isDisabled = fields.value?.some((v) => isNil(v) || v === "");
    const additionalContent = additionalButtonContent?.(formProvider);
    const isReadOnly = readOnly || !this.createAccess;

    return (
      <div key="button-block">
        <Button
          disabled={isDisabled || isReadOnly}
          key="add-button"
          type="link"
          onClick={this.handleAddFieldEntity}
          css={addEntityButtonStyle}
          test-id={`button_${this.props["test-id"]}`}
        >
          <div css={buttonDescriptionWrapperStyle}>
            <span css={addButtonWrapperStyle}>
              <PlusSVG css={addButtonStyle} />
            </span>
            {addButtonDescription}
          </div>
        </Button>
        {additionalContent}
      </div>
    );
  };

  public override render() {
    const { label, addEntityButtonPosition, formItemStyle } = this.props;
    const { spaceSize } = this.props;

    return (
      <FormOption label={label} formItemStyle={this.getResultFormItemStyle(formItemStyle)}>
        <div css={getRowsContainerStyle(spaceSize)}>
          {addEntityButtonPosition === EAddEntityButtonPositions.top
            ? [this.getAddEntityButton(), this.getFields()]
            : addEntityButtonPosition === EAddEntityButtonPositions.bottom
              ? [this.getFields(), this.getAddEntityButton()]
              : [this.getFields(), null]}
        </div>
      </FormOption>
    );
  }
}

const ArrayFieldComponent: React.FC<IArrayFieldProps> = (props) => {
  const { accessKeys, readOnly, accessKey, ...rest } = props;
  const { hasReadAccess } = getAccessParameters(rest.isFeatureEnabled, accessKeys);

  const { formProvider } = useContext(FormContext);
  const spaceSize = useContext(SpaceSizeContext);

  if (!hasReadAccess) {
    return null;
  }

  return (
    <div data-name={props.name}>
      <FieldArray
        key="field"
        isEqual={isEqual}
        component={WrappedArrayField}
        accessKey={accessKey}
        arrayFieldName={props.name}
        readOnly={readOnly}
        formProvider={formProvider}
        spaceSize={spaceSize}
        {...rest}
      />
    </div>
  );
};

export const ArrayField = memo(withFeature(ArrayFieldComponent));
