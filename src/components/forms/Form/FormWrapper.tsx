import { Form as RFForm, type FormProps } from "react-final-form";
import arrayMutators from "final-form-arrays";
import type { Mutator } from "final-form";
import type { NCore } from "@infomaximum/module-expander";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { withFormSubmitPromise } from "../../../decorators";
import type { IFormWrapperProps, TWrappedError } from "./FormWrapper.types";
import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from "react";
import { forEach } from "lodash";
import { FormComponent } from "./Form";
import type { IBaseFormProps } from "../BaseForm/BaseForm.types";

/**
 * Компонент-обертка над формой
 * @param props
 */
const FormWrapper: FC<IFormWrapperProps> = ({
  children,
  form: formName,
  component,
  mutators: mutatorsProp,
  onSubmit,
  ...rest
}) => {
  const { isFeatureEnabled } = useFeature();

  const mutators = useMemo(() => {
    /**
     * Мутатор изменения состояния touched полей формы
     * @param fieldNames
     */
    const touch: Mutator<unknown, typeof rest.initialValues> = (
      [fieldNames]: [string[]],
      state
    ) => {
      forEach(fieldNames, (fieldName) => {
        const field = state.fields[fieldName];
        if (field) {
          field.touched = true;
        }
      });
    };

    /**
     * Мутатор очистки полей формы
     * @param fieldNames
     */
    const clearFields: Mutator<unknown, typeof rest.initialValues> = (
      [fieldNames]: [string[]],
      state,
      { changeValue }
    ) => {
      forEach(fieldNames, (fieldName) => {
        const field = state.fields[fieldName];
        if (field) {
          changeValue(state, fieldName, () => undefined);
        }
      });
    };

    /**
     * Мутатор ошибки формы
     */
    const setSubmitError: Mutator<unknown, typeof rest.initialValues> = (
      [error]: [NCore.TError],
      state
    ) => {
      state.formState.submitError = error;
    };

    /**
     * Очистка ошибки формы
     * @param _
     * @param state
     */
    const clearSubmitError: Mutator<unknown, typeof rest.initialValues> = (_, state) => {
      state.formState.submitError = null;
    };

    /**
     * Мутатор ошибок формы
     */
    const setSubmitErrors: Mutator<unknown, typeof rest.initialValues> = (
      [fieldName, error]: [string, NCore.TError | TWrappedError[]],
      state
    ) => {
      state.formState.submitErrors = {
        ...state.formState.submitErrors,
        [fieldName]: error,
      };
    };

    /**
     * Очистка ошибок формы
     * @param _
     * @param state
     */
    const clearSubmitErrors: Mutator<unknown, typeof rest.initialValues> = (_, state) => {
      state.formState.submitErrors = undefined;
    };

    /**
     * Мутатор ошибки поля
     * @param fieldName
     */
    const setFieldError: Mutator<unknown, typeof rest.initialValues> = (
      [fieldName, error]: [string, NCore.TError],
      state
    ) => {
      if (fieldName && state?.formState?.errors) {
        state.formState.errors[fieldName] = error;
      }
    };

    /**
     * Мутатор добавления элемента в начало массива
     * @param fieldName
     * @param value
     */
    const unshift: Mutator<unknown, typeof rest.initialValues> = (
      [fieldName, value]: [string, unknown],
      state,
      { changeValue }
    ) => {
      changeValue(state, fieldName, (lastValue = []) => {
        return [value, ...lastValue];
      });
    };

    return {
      ...mutatorsProp,
      ...arrayMutators,
      unshift,
      touch,
      clearFields,
      setFieldError,
      setSubmitError,
      clearSubmitError,
      setSubmitErrors,
      clearSubmitErrors,
    };
  }, [mutatorsProp, rest]);

  return (
    <RFForm<any>
      onSubmit={onSubmit as FormProps<any>["onSubmit"]}
      mutators={mutators}
      isFeatureEnabled={isFeatureEnabled}
      {...rest}
    >
      {(params) => (
        <FormComponent
          {...params}
          initialValues={params.initialValues}
          component={component}
          formName={formName}
          isFeatureEnabled={isFeatureEnabled}
        >
          {children}
        </FormComponent>
      )}
    </RFForm>
  );
};

export const Form = withFormSubmitPromise(FormWrapper) as <
  FormProps extends IFormWrapperProps = IFormWrapperProps,
  ComponentProps extends IBaseFormProps = ComponentPropsWithoutRef<
    NonNullable<FormProps["component"]>
  >,
  ClearComponentProps extends IBaseFormProps = Exclude<ComponentProps, React.HTMLAttributes<any>>,
  TrueConnectFormProps = Omit<FormProps, "component" | keyof IBaseFormProps>
>(
  props: PropsWithChildren<
    TrueConnectFormProps &
      ClearComponentProps & {
        component?: IFormWrapperProps<ClearComponentProps>["component"];
      }
  >
) => JSX.Element;
