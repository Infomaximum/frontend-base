import { useCallback, useContext, useEffect, useState } from "react";
import type { IFormFieldProps } from "./FormField.types";
import { FormOption } from "../FormOption/FormOption";
import { getAccessParameters } from "@infomaximum/utility";
import type { TFieldProvider } from "./Field/Field.types";
import type { FieldMetaState } from "react-final-form";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { usePrevious } from "../../../decorators/hooks/usePrevious";

function FormFieldComponent<V = any>(props: IFormFieldProps<V>) {
  const {
    component: FieldComponent,
    formItemStyle,
    labelAlign,
    colon,
    testId,
    promptTestId,
    highlightFieldWithError,
    promptText,
    promptWrapperStyle,
    getPromptPopupContainer,
    rightLabel,
    wrapperComponentStyle,
    labelStyle,
    disabled,
    validate,
    isClearSubmitErrorsOnValueChange = true,
    description,
    labelContent,
    additionalHint,
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
    // очищаем ошибку как только вносим изменение в форму, чтобы ошибка не висела
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
      label={restProps.label}
      labelContent={labelContent}
      labelStyle={labelStyle}
      labelAlign={labelAlign}
      colon={colon}
      formItemStyle={formItemStyle}
      testId={testId || fieldTestId}
      promptTestId={promptTestId}
      highlightFieldWithError={highlightFieldWithError}
      promptText={promptText}
      promptWrapperStyle={promptWrapperStyle}
      getPromptPopupContainer={getPromptPopupContainer}
      rightLabel={rightLabel}
      wrapperComponentStyle={wrapperComponentStyle}
      description={description}
      additionalHint={additionalHint}
      readOnly={restProps.readOnly}
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
