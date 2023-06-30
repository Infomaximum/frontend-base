import { createRef, Children, Component } from "react";
import { TestIdAttr, getAccessParameters } from "@infomaximum/utility";
import type { IFormProps, IFormState } from "./Form.types";
import { isFunction, omit } from "lodash";
import type { IBaseFormProps } from "../BaseForm/BaseForm.types";
import { omittedPropsConnectedForm, type TOmittedConnectedFormProps } from "./Form.utils";
import type { Location } from "react-router";
import { BaseForm } from "../BaseForm/BaseForm";
import { FormContext, type IFormProvider } from "../../../decorators/contexts/FormContext";
import { contains } from "../../../utils/URI/URI";
import { FormConfirmationModal } from "../../modals/FormConfirmationModal/FormConfirmationModal";
import { assertSimple } from "@infomaximum/assert";

class FormComponent extends Component<IFormProps, IFormState> {
  public static defaultProps = {
    component: BaseForm,
  };

  public static getDerivedStateFromProps(nextProps: IFormProps, prevState: IFormState) {
    const { accessKeys, someAccessKeys, isFeatureEnabled, customAccess } = nextProps;

    if (
      (accessKeys || someAccessKeys || customAccess) &&
      isFeatureEnabled &&
      (prevState.accessKeys !== accessKeys ||
        prevState.someAccessKeys !== someAccessKeys ||
        prevState.isFeatureEnabled !== isFeatureEnabled ||
        prevState.customAccess !== customAccess)
    ) {
      return {
        contextData: {
          ...prevState.contextData,
          access: customAccess ?? getAccessParameters(isFeatureEnabled, accessKeys, someAccessKeys),
        },
        accessKeys,
        someAccessKeys,
        isFeatureEnabled,
      };
    }

    return null;
  }

  private wrapperRef = createRef<HTMLDivElement | HTMLTableRowElement>();
  private formProvider: IFormProvider | undefined;
  public override readonly state: Readonly<IFormState> = {
    contextData: {
      access: {
        hasReadAccess: true,
        hasWriteAccess: true,
        hasExecuteAccess: true,
      },
    },
  };

  constructor(props: IFormProps) {
    super(props);

    const { accessKeys, someAccessKeys, customAccess, isFeatureEnabled, formName } = props;

    const state: IFormState = {
      contextData: {
        ...this.state.contextData,
        formProvider: this.getFormProvider(),
        formName,
      },
    };

    if ((accessKeys || someAccessKeys || customAccess) && isFeatureEnabled) {
      state.contextData.access =
        customAccess ?? getAccessParameters(isFeatureEnabled, accessKeys, someAccessKeys);
      state.customAccess = customAccess;
      state.accessKeys = accessKeys;
      state.someAccessKeys = someAccessKeys;
      state.isFeatureEnabled = isFeatureEnabled;
    }

    this.state = state;
  }

  public override componentDidMount() {
    const { onKeyDown, setFormData } = this.props;

    if (this.wrapperRef.current && isFunction(onKeyDown)) {
      this.wrapperRef.current.addEventListener("keydown", this.handleKeyDown);
    }

    if (isFunction(setFormData)) {
      setFormData(this.state.contextData);
    }
  }

  public override shouldComponentUpdate(nextProps: IFormProps) {
    if (
      nextProps.isFeatureEnabled !== this.props.isFeatureEnabled ||
      nextProps.onSubmitSuccessed !== this.props.onSubmitSuccessed ||
      nextProps.submitSucceeded !== this.props.submitSucceeded ||
      nextProps.hasSubmitErrors !== this.props.hasSubmitErrors ||
      nextProps.errors !== this.props.errors ||
      nextProps.error !== this.props.error ||
      nextProps.submitError !== this.props.submitError ||
      nextProps.dirty !== this.props.dirty ||
      nextProps.component !== this.props.component ||
      nextProps.submitting !== this.props.submitting ||
      nextProps.children !== this.props.children
    ) {
      return true;
    }

    return false;
  }

  public override componentDidUpdate(prevProps: IFormProps, prevState: IFormState) {
    const {
      onSubmitSuccessed,
      submitSucceeded,
      submitting,
      hasSubmitErrors,
      form: { initialize },
      setFormData,
    } = this.props;
    const prevAccess = prevState.contextData.access;
    const access = this.state.contextData.access;

    if (
      onSubmitSuccessed &&
      prevProps.submitting &&
      !submitting &&
      !hasSubmitErrors &&
      submitSucceeded
    ) {
      onSubmitSuccessed(this.getFormProvider());
    }

    if (prevProps.initialValues !== this.props.initialValues) {
      initialize(this.props.initialValues);
    }

    if (
      (prevAccess.hasExecuteAccess !== access.hasExecuteAccess ||
        prevAccess.hasReadAccess !== access.hasReadAccess ||
        prevAccess.hasWriteAccess !== access.hasWriteAccess) &&
      isFunction(setFormData)
    ) {
      setFormData(this.state.contextData);
    }
  }

  public override componentWillUnmount() {
    const { onKeyDown } = this.props;

    if (this.wrapperRef.current && isFunction(onKeyDown)) {
      this.wrapperRef.current.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const { onKeyDown } = this.props;

    if (isFunction(onKeyDown)) {
      onKeyDown(event, this.getFormProvider());
    }
  };

  private getFormProvider() {
    if (!this.formProvider) {
      const { form } = this.props;

      this.formProvider = form;
    }

    return this.formProvider;
  }

  public getAttributes() {
    const testId = this.props[TestIdAttr];

    return {
      [TestIdAttr]: testId ? testId : "connected_form",
      ref: this.wrapperRef,
      css: this.props.connectedFormWrapperStyle,
      form: this.props.formName,
    };
  }

  public getPromptMessage = ({ pathname }: Location): string | boolean => {
    const {
      formName,
      blockUri,
      hasValidationErrors,
      form: { mutators },
      errors,
    } = this.props;
    // Если пытаемся перейти по пути, который не соответствует blockUri
    // и не является его дочерней страницей, то блокируем переход
    if (blockUri !== pathname || !contains(pathname, blockUri as string)) {
      if (hasValidationErrors && mutators?.touch && errors) {
        mutators.touch(Object.keys(errors));
      }
      return formName;
    }
    return true;
  };

  private getFormConfirmationModal() {
    const { blockUri, dirty } = this.props;
    const { contextData } = this.state;

    return blockUri ? (
      <FormConfirmationModal
        key="form-confirmation-modal"
        formProvider={this.getFormProvider()}
        when={dirty}
        disabledConfirmButton={!contextData.access.hasWriteAccess}
        blockUri={blockUri}
      />
    ) : null;
  }

  private getFields() {
    if (!this.props.sortByPriority) {
      return this.props.children || [];
    }

    const children = Children.toArray(this.props.children);

    children.sort((child1, child2) => {
      const priority1 = (child1 as React.ReactElement).props?.priority || 0;
      const priority2 = (child2 as React.ReactElement).props?.priority || 0;

      return priority2 - priority1;
    });

    return children || [];
  }

  public override render() {
    const { component } = this.props;

    if (!component) {
      assertSimple(false, `Не передан props "component" для Form!`);
    }

    const formComponentProps = omit<TOmittedConnectedFormProps<IFormProps>>(
      this.props,
      omittedPropsConnectedForm
    );

    const Component = component as React.ElementType<
      IBaseFormProps & { children: React.ReactNode }
    >;

    return (
      <FormContext.Provider value={this.state.contextData}>
        <Component key="component-form" attributes={this.getAttributes()} {...formComponentProps}>
          {this.getFields()}
          {this.getFormConfirmationModal()}
        </Component>
      </FormContext.Provider>
    );
  }
}

export { FormComponent };
