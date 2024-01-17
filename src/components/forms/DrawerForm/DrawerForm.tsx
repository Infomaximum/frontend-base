import React from "react";
import { isFunction } from "lodash";
import type { Deferred } from "@infomaximum/utility";
import { Form } from "../Form";
import {
  formStyles,
  drawerBodyStyle,
  cancelButtonStyle,
  noAccessStyle,
  formContentStyle,
} from "./DrawerForm.styles";
import { EFormLayoutType } from "../BaseForm/BaseForm.types";
import type { NCore } from "@infomaximum/module-expander";
import { drawerFormCancelButtonTestId, drawerFormTestId } from "../../../utils/TestIds";
import type { IDrawerFormProps, IDrawerFormState } from "./DrawerForm.types";
import type { FormApi } from "final-form";
import type { IFormData } from "../../../decorators/contexts/FormContext";
import { DrawerAnimationInterval } from "../../../utils/const";
import { SubmitFormButton } from "../SubmitFormButton/SubmitFormButton";
import { Button } from "../../Button/Button";
import { Drawer } from "../../drawers/Drawer/Drawer";
import { Empty } from "../../Empty/Empty";

class DrawerFormComponent extends React.PureComponent<IDrawerFormProps, IDrawerFormState> {
  public static defaultProps = {
    bodyStyle: drawerBodyStyle,
    isHasAccess: true,
    placement: "right",
  };

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
    } = this.props;

    return (
      this.state.formProvider && (
        <div key="drawer-footer">
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
          />
          <Button
            type="ghost"
            key="button-cancel"
            onClick={this.handleCancel}
            test-id={drawerFormCancelButtonTestId}
            css={cancelButtonStyle}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
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
      bodyStyle,
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
      ...rest
    } = this.props;

    return (
      <Drawer
        {...rest}
        key="drawer-form"
        footer={!isHasAccess ? null : footer ?? this.renderFooter()}
        destroyOnClose={true}
        keyboard={true}
        open={open ?? this.state.open}
        closable={true}
        onClose={this.handleCloseDrawer}
        title={title}
        bodyStyle={bodyStyle}
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
            formStyles={formStyles}
            test-id={`${drawerFormTestId}_${form}`}
            layoutType={EFormLayoutType.ModalType}
            notification={notification}
            header={null}
            setFormData={this.setFormData}
            connectedFormWrapperStyle={formContentStyle}
          >
            {children}
          </Form>
        )}
      </Drawer>
    );
  }
}

export const DrawerForm = DrawerFormComponent;
