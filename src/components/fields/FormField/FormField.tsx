import { useCallback, useContext, useEffect, useState } from "react";
import type { IFormFieldProps } from "./FormField.types";
import { FormOption } from "../FormOption/FormOption";
import { getAccessParameters } from "@im/utils";
import type { TFieldProvider } from "./Field/Field.types";
import type { FieldMetaState } from "react-final-form";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { usePrevious } from "../../../decorators/hooks/usePrevious";

function FormFieldComponent<V = any>(props: IFormFieldProps<V>) {
  const {
    label,
    component: FieldComponent,
    formItemStyle,
    labelCol,
    wrapperCol,
    labelAlign,
    colon,
    testId,
    promptTestId,
    highlightFieldWithError,
    promptText,
    promptWrapperStyle,
    rightLabel,
    wrapperComponentStyle,
    labelStyle,
    disabled,
    validate,
    isClearSubmitErrorsOnValueChange = true,
    ...restProps
  } = props;

  const { isFeatureEnabled } = useFeature();
  const { formName, formProvider } = useContext(FormContext);
  const [meta, setMeta] = useState<FieldMetaState<V> | undefined>();

  const setFieldProvider = useCallback((fieldProvider: TFieldProvider<V>) => {
    if (fieldProvider) {
      setMeta(fieldProvider.meta);
    }
  }, []);

  const fieldName: string = props.name;

  const fieldState = formProvider?.getFieldState(fieldName);

  const prevFieldValue = usePrevious(fieldState?.value);

  const fieldTestId = formName && fieldName && `${formName}_${fieldName}`;

  const { hasReadAccess } = getAccessParameters(isFeatureEnabled, restProps.accessKeys);

  useEffect(() => {
    //очищаем ошибку как только вносим изменение в форму, чтобы ошибка не висела
    if (
      isClearSubmitErrorsOnValueChange &&
      formProvider &&
      fieldState?.submitError &&
      fieldState?.value !== prevFieldValue
    ) {
      formProvider?.mutators?.clearSubmitErrors?.();
    }
  }, [
    isClearSubmitErrorsOnValueChange,
    fieldState?.submitError,
    fieldState?.value,
    formProvider,
    formProvider?.mutators,
    prevFieldValue,
  ]);

  if (!hasReadAccess) {
    return null;
  }

  return (
    <FormOption
      label={label}
      labelStyle={labelStyle}
      labelAlign={labelAlign}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      colon={colon}
      formItemStyle={formItemStyle}
      testId={testId || fieldTestId}
      promptTestId={promptTestId}
      highlightFieldWithError={highlightFieldWithError}
      promptText={promptText}
      promptWrapperStyle={promptWrapperStyle}
      rightLabel={rightLabel}
      wrapperComponentStyle={wrapperComponentStyle}
      {...meta}
    >
      <FieldComponent
        setFieldProvider={setFieldProvider}
        disabled={disabled}
        validate={!disabled && validate}
        {...restProps}
      />
    </FormOption>
  );
}

export const FormField = FormFieldComponent;
