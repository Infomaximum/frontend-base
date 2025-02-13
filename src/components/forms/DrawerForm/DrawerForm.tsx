import React from "react";
import { isFunction } from "lodash";
import type { Deferred } from "@infomaximum/utility";
import { Form } from "../Form";
import {
  formStyle,
  cancelButtonStyle,
  noAccessStyle,
  formContentStyle,
  drawerFooterStyle,
} from "./DrawerForm.styles";
import { EFormLayoutType } from "../BaseForm/BaseForm.types";
import type { NCore } from "@infomaximum/module-expander";
import { drawerFormCancelButtonTestId, drawerFormTestId } from "../../../utils/TestIds";
import type { IDrawerFormProps, IDrawerFormState } from "./DrawerForm.types";
import type { FormApi } from "final-form";
import type { IFormData } from "../../../decorators/contexts/FormContext";
import { DrawerAnimationInterval } from "../../../utils/const";
import { SubmitFormButton } from "../SubmitFormButton";
import { Button } from "../../Button/Button";
import { Drawer } from "../../drawers/Drawer/Drawer";
import { Empty } from "../../Empty/Empty";
import { withLoc } from "../../../decorators/hocs/withLoc/withLoc";

class DrawerFormComponent extends React.PureComponent<IDrawerFormProps, IDrawerFormState> {
  public static defaultProps = {
    isHasAccess: true,
    placement: "right",
  } as const;

  public override readonly state: Readonly<IDrawerFormState> = {
    open: false,
    formPristine: true,
  };

  public override componentDidMount() {
    this.setState({ open: true });
  }

  private setFormData = (formData: IFormData) => {
    if (formData) {
      const { setFormData } = this.props;

      if (isFunction(setFormData)) {
        setFormData(formData);
      }

      const { formProvider } = formData;

      if (formProvider) {
        this.setState({ formProvider });

        formProvider.subscribe(
          ({ pristine }) => {
            this.setState({ formPristine: pristine });
          },
          { pristine: true }
        );
      }
    }
  };

  private handleCloseDrawer = (e?: any) => {
    const { onStartClosing } = this.props;
    onStartClosing && onStartClosing();

    this.setState({ open: false }, () =>
      this.afterCloseDrawer(() => {
        if (isFunction(this.props.onClose)) {
          this.props.onClose(e);
        }
      })
    );
  };

  private afterCloseDrawer(
    callback: ((submitResult?: unknown) => void) | undefined,
    submitResult?: unknown
  ) {
    if (isFunction(callback)) {
      setTimeout(() => callback(submitResult), DrawerAnimationInterval);
    }
  }

  private handleCancel = () => {
    this.handleCloseDrawer();
    this.afterCloseDrawer(this.props.onCancel);
  };

  private handleSubmit = (
    values: TDictionary,
    form: FormApi<TDictionary, Partial<TDictionary>>
  ): Deferred | Promise<any> | undefined => {
    const { onSubmit, onCancel, afterSubmit } = this.props;

    return onSubmit(values, form)
      ?.then((submitResult: unknown) => {
        if (!!form.getState().submitError) {
          return;
        }

        this.handleCloseDrawer();
        this.afterCloseDrawer(afterSubmit ?? onCancel, submitResult);
        Promise.resolve();
      })
      .catch((error: NCore.TError) => Promise.reject(error));
  };

  private renderFooter(): React.ReactNode {
    const {
      okText,
      cancelText,
      form,
      disableSubmitOnPristine,
      disableSubmitOnInvalid,
      cancelButtonProps,
      disableSubmitFormButton,
      okButtonProps,
      additionalFooterButtons,
    } = this.props;

    return (
      this.state.formProvider && (
        <div key="drawer-footer" css={drawerFooterStyle}>
          <div>
            <SubmitFormButton
              key="button-submit"
              type="primary"
              formName={form}
              formProvider={this.state.formProvider}
              caption={okText}
              disableOnPristine={disableSubmitOnPristine}
              disableOnInvalid={disableSubmitOnInvalid}
              test-id={form}
              disabled={disableSubmitFormButton}
              {...okButtonProps}
            />
            <Button
              type="common"
              key="button-cancel"
              onClick={this.handleCancel}
              test-id={drawerFormCancelButtonTestId}
              css={cancelButtonStyle}
              {...cancelButtonProps}
            >
              {cancelText}
            </Button>
          </div>
          {additionalFooterButtons}
        </div>
      )
    );
  }

  public override render(): React.ReactNode {
    const {
      initialValues,
      form,
      children,
      onSubmit,
      onClose,
      title,
      notification,
      okText,
      cancelText,
      okButtonProps,
      afterSubmit,
      cancelButtonProps,
      disableSubmitOnPristine,
      disableSubmitOnInvalid,
      disableSubmitFormButton,
      setFormData,
      isHasAccess,
      footer,
      open,
      formLayoutType = EFormLayoutType.ModalType,
      onStartClosing,
      ...rest
    } = this.props;

    return (
      <Drawer
        {...rest}
        key="drawer-form"
        footer={!isHasAccess ? null : (footer ?? this.renderFooter())}
        destroyOnClose={true}
        keyboard={true}
        open={open ?? this.state.open}
        closable={true}
        onClose={this.handleCloseDrawer}
        title={title}
        maskClosable={disableSubmitFormButton ?? this.state.formPristine}
      >
        {!isHasAccess ? (
          <div css={noAccessStyle}>
            <Empty isFiltersEmpty={true} isSearchEmpty={true} isHasAccess={isHasAccess} />
          </div>
        ) : (
          <Form
            form={form}
            onSubmit={this.handleSubmit}
            initialValues={initialValues}
            formStyles={formStyle}
            test-id={`${drawerFormTestId}_${form}`}
            layoutType={formLayoutType}
            notification={notification}
            setFormData={this.setFormData}
            connectedFormWrapperStyle={formContentStyle}
            formSubmitPanelConfig={null}
          >
            {children}
          </Form>
        )}
      </Drawer>
    );
  }
}

export const DrawerForm = withLoc(DrawerFormComponent);
