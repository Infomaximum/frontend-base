import { Form as RFForm, type FormProps } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { withFormSubmitPromise } from "../../../decorators";
import type { IFormWrapperProps } from "./FormWrapper.types";
import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from "react";
import { FormComponent } from "./Form";
import type { IBaseFormProps } from "../BaseForm/BaseForm.types";
import { formMutators } from "./Form.utils";

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
    return {
      ...mutatorsProp,
      ...arrayMutators,
      ...formMutators,
    };
  }, [mutatorsProp]);

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
