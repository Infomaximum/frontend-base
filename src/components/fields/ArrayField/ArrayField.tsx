import React, { useContext } from "react";
import { FieldArray } from "react-final-form-arrays";
import { isFunction, map, isNil, isUndefined, isNumber } from "lodash";
import {
  addButtonStyle,
  addButtonWrapperStyle,
  addEntityButtonStyle,
  buttonDescriptionWrapperStyle,
  wrappedArrayFieldStyle,
} from "./ArrayField.styles";
import type {
  IWrappedArrayFieldProps,
  IWrappedArrayFieldState,
  IArrayFieldProps,
} from "./ArrayField.types";
import { getAccessParameters, EOperationType } from "@im/utils";
import { createSelector } from "reselect";
import type { Interpolation } from "@emotion/react";
import { Button } from "../../Button/Button";
import { PlusSVG } from "../../../resources/icons";
import { FormOption } from "../FormOption/FormOption";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { withFeature } from "../../../decorators/hocs/withFeature/withFeature";

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
      const resultFormItemStyle: Interpolation<TTheme> = [
        wrappedArrayFieldStyle,
      ];

      if (formItemStyle) {
        resultFormItemStyle.push(formItemStyle);
      }

      return resultFormItemStyle;
    }
  );

  private handleAddFieldEntity = () => {
    const {
      formProvider,
      defaultEntityValue,
      addEntityButtonPosition,
      arrayFieldName,
    } = this.props;

    if (formProvider) {
      const addMethod =
        addEntityButtonPosition === EAddEntityButtonPositions.top
          ? formProvider.mutators.unshift
          : formProvider.mutators.push;

      if (!isUndefined(defaultEntityValue)) {
        addMethod?.(arrayFieldName, defaultEntityValue);
      } else {
        addMethod?.(arrayFieldName, {});
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

    if (readOnly && !fields.length) {
      return ["—"];
    }

    const fieldComponents = map(fields, (field, index) => {
      const fieldEntityPath = `${arrayFieldName}[${index}]`;
      const newField = !field?.id;

      if (newField) {
        return (
          <EntityComponent
            key={index}
            onRemoveFieldEntity={this.handleRemoveFieldEntity}
            fieldEntityPath={fieldEntityPath}
            fieldEntityIndex={index}
            readOnly={readOnly}
            fields={this.props.fields}
            writeAccess={true}
            removeAccess={true}
            autoFocus={this.getAutoFocusStatusByIndex(index)}
            {...fieldEntityComponentProps}
          />
        );
      }

      return (
        <EntityComponent
          key={index}
          onRemoveFieldEntity={this.handleRemoveFieldEntity}
          fieldEntityPath={fieldEntityPath}
          fieldEntityIndex={index}
          readOnly={false}
          fields={this.props.fields}
          writeAccess={this.writeAccess}
          removeAccess={this.deleteAccess}
          {...fieldEntityComponentProps}
        />
      );
    });

    return fieldComponents;
  };

  private getAddEntityButton = () => {
    const { addButtonDescription, readOnly, fields } = this.props;

    const isDisabled = fields.value?.some((v) => isNil(v) || v === "");

    return !readOnly && this.createAccess ? (
      <Button
        disabled={isDisabled}
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
    ) : null;
  };

  public override render() {
    const { label, wrapperCol, addEntityButtonPosition, formItemStyle } =
      this.props;

    return (
      <FormOption
        label={label}
        wrapperCol={wrapperCol}
        formItemStyle={this.getResultFormItemStyle(formItemStyle)}
      >
        {addEntityButtonPosition === EAddEntityButtonPositions.top
          ? [this.getAddEntityButton(), this.getFields()]
          : addEntityButtonPosition === EAddEntityButtonPositions.bottom
          ? [this.getFields(), this.getAddEntityButton()]
          : [this.getFields(), null]}
      </FormOption>
    );
  }
}

const ArrayFieldComponent: React.FC<IArrayFieldProps> = (props) => {
  const { accessKeys, readOnly, accessKey, ...rest } = props;
  const { hasReadAccess } = getAccessParameters(
    rest.isFeatureEnabled,
    accessKeys
  );

  const { formProvider } = useContext(FormContext);

  if (!hasReadAccess) {
    return null;
  }

  return (
    <div data-name={props.name}>
      <FieldArray
        key="field"
        {...rest}
        component={WrappedArrayField}
        accessKey={accessKey}
        arrayFieldName={props.name}
        readOnly={readOnly}
        formProvider={formProvider}
      />
    </div>
  );
};

export const ArrayField = withFeature(ArrayFieldComponent);
