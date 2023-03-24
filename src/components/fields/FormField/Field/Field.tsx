import React, { useContext, useEffect, useMemo } from "react";
import { Field as FinalFormField, type FieldRenderProps } from "react-final-form";
import type { IFieldProps, IWrappedFieldProps } from "./Field.types";
import { isArray, isEqual, isFunction } from "lodash";
import { alternatelyValidators, getAccessParameters } from "@infomaximum/utility";
import { useFeature } from "../../../../decorators/hooks/useFeature";
import { FormContext } from "../../../../decorators/contexts/FormContext";

/**
 * Компонент-обертка над содержимым field
 */
class WrappedField<V> extends React.PureComponent<IWrappedFieldProps<V>> {
  public override componentDidMount() {
    if (this.props.setFieldProvider) {
      this.props.setFieldProvider({ meta: this.props.meta });
    }
  }

  public override componentDidUpdate(prevProps: IWrappedFieldProps<V>) {
    if (this.props.setFieldProvider && !isEqual(this.props.meta, prevProps.meta)) {
      this.props.setFieldProvider({ meta: this.props.meta });
    }
  }

  public override render() {
    const { fieldComponent: FieldComponent, setFieldProvider, ...rest } = this.props;

    return FieldComponent ? <FieldComponent {...rest} /> : null;
  }
}

/**
 * Компонент "Поле формы", связанный с react-final-form
 */
const FieldComponent = <V, P extends FieldRenderProps<V> = FieldRenderProps<V>>(
  props: IFieldProps<V, P>
) => {
  const {
    accessKeys,
    readOnly,
    fieldWrapperStyle,
    component,
    validate: validateProp,
    ...rest
  } = props;
  const isFieldHasAccessData: boolean = !!accessKeys;

  const { isFeatureEnabled } = useFeature();
  const { hasWriteAccess } = getAccessParameters(isFeatureEnabled, accessKeys);
  const { access, formProvider } = useContext(FormContext);

  const { hasReadAccess: isFormHasAccess, hasWriteAccess: isFormHasWriteAccess } = access;

  const validate = useMemo(() => {
    if (isFunction(validateProp)) {
      return validateProp;
    } else if (isArray(validateProp)) {
      return alternatelyValidators(validateProp);
    }
  }, [validateProp]);

  /**
   * todo: Виктор Пименов: удалить, когда в final-form поддержат запуск валидации, при изменении
   * поля validate
   */
  useEffect(() => {
    if (formProvider) {
      if (validate) {
        const formValues = formProvider.getState().values;
        const value = formValues[props.name];
        const fieldState = formProvider.getFieldState(props.name);
        formProvider.mutators.setFieldError?.(validate(value, formValues, fieldState));
      } else {
        formProvider.mutators.setFieldError?.();
      }
    }
  }, [formProvider, props.name, validate]);

  if (isFormHasAccess) {
    return (
      <div data-name={props.name} css={fieldWrapperStyle}>
        <FinalFormField<V>
          key="field"
          {...rest}
          readOnly={
            readOnly !== undefined
              ? readOnly
              : isFieldHasAccessData
              ? !hasWriteAccess
              : !isFormHasWriteAccess
          }
          validate={validate}
          component={WrappedField}
          fieldComponent={component}
        />
      </div>
    );
  }

  return null;
};

export const Field = FieldComponent;
