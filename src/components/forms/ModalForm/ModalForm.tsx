import type { FormApi } from "final-form";
import { isFunction, has } from "lodash";
import React from "react";
import { type IFormData, type IFormProvider } from "../../../decorators/contexts/FormContext";
import { closeModalIconStyle } from "../../../styles";
import {
  ModalAnimationInterval,
  modalFormCancelButtonTestId,
  modalFormCloseIconTestId,
  modalFormTestId,
} from "../../../utils";
import { EFormLayoutType } from "../BaseForm";
import { SubmitFormButton } from "../SubmitFormButton";
import { modalComponentsStyle, formStyle, wrapperModalFormStyle } from "./ModalForm.styles";
import type { IModalFormProps, IModalFormState } from "./ModalForm.types";
import { Space } from "antd";
import { Button } from "../../Button";
import { Modal } from "../../modals";
import { Form } from "../Form";
import { CloseOutlined } from "../../Icons/Icons";

class ModalFormComponent extends React.PureComponent<IModalFormProps, IModalFormState> {
  public static defaultProps = {
    styles: modalComponentsStyle,
    hasEnterHotkey: true,
  };

  public override readonly state: Readonly<IModalFormState> = {
    open: true,
    submitFocus: false,
  };

  private setFormData = (formData: IFormData) => {
    if (formData) {
      this.setState({ formProvider: formData.formProvider });

      const { setFormData } = this.props;

      if (isFunction(setFormData)) {
        setFormData(formData);
      }
    }
  };

  private onCloseModal() {
    this.setState({ open: false });
  }

  private afterCloseModal(
    callback: ((submitResult?: unknown) => void) | undefined,
    submitResult?: unknown
  ) {
    if (isFunction(callback)) {
      setTimeout(() => callback(submitResult), ModalAnimationInterval);
    }
  }

  private handleCancel = () => {
    this.onCloseModal();

    // если передаем open, то не нужно закрывать модалку через this.afterCloseModal
    if (has(this.props, "open")) {
      this.props.onCancel?.();
    } else {
      this.afterCloseModal(this.props.onCancel);
    }
  };

  private handleSubmit = async (values: TDictionary, form: FormApi) => {
    const { onSubmit, onCancel, afterSubmit } = this.props;

    const submitResult = await onSubmit(values, form);

    this.onCloseModal();
    this.afterCloseModal(afterSubmit ?? onCancel, submitResult);
  };

  private handleEnterKeyPress = (
    event: KeyboardEvent,
    formProvider: IFormProvider<TDictionary<any>>
  ) => {
    this.setState({ submitFocus: false });

    const targetElem = event.target as HTMLElement;
    const targetFieldType = targetElem?.getAttribute("type");
    const validFieldType =
      targetFieldType === "text" ||
      targetFieldType === "password" ||
      targetFieldType === "checkbox" ||
      targetElem?.hasAttribute("step");
    const isSearchTypeFieldExpanded = targetElem.getAttribute("aria-expanded") === "true";

    if (this.props.hasEnterHotkey && event.key === "Enter") {
      if (validFieldType) {
        formProvider.submit();
      }

      if (isSearchTypeFieldExpanded && formProvider.getState().valid) {
        setTimeout(() => {
          this.setState({ submitFocus: true });
        }, 0);
      }
    }
  };

  private handleModalKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const targetElem = event.target as HTMLElement;
    const isModalContainer = targetElem.tabIndex === -1;

    if (
      this.props.hasEnterHotkey &&
      event.key === "Enter" &&
      isModalContainer &&
      this.state.formProvider?.getState().valid
    ) {
      this.state.formProvider?.submit();
    }
  };

  private renderFooter(): React.ReactNode {
    const {
      okText,
      cancelText,
      form,
      disableSubmitOnPristine,
      disableSubmitOnInvalid,
      okButtonProps,
    } = this.props;

    return (
      this.state.formProvider && (
        <Space size={8} key="modal-footer">
          <Button
            type="common"
            key="button-cancel"
            onClick={this.handleCancel}
            test-id={modalFormCancelButtonTestId}
          >
            {cancelText}
          </Button>
          <SubmitFormButton
            key="button-submit"
            formName={form}
            formProvider={this.state.formProvider}
            caption={okText}
            disableOnPristine={disableSubmitOnPristine}
            disableOnInvalid={disableSubmitOnInvalid}
            test-id={form}
            type="primary"
            loading={okButtonProps?.loading}
            disabled={okButtonProps?.disabled}
            focusable={this.props.hasEnterHotkey}
            focus={this.state.submitFocus}
          />
        </Space>
      )
    );
  }

  public override render(): React.ReactNode {
    const {
      initialValues,
      form,
      children,
      onSubmit,
      title,
      styles,
      notification,
      afterSubmit,
      setFormData,
      footer,
      sortByPriority,
      keepDirtyOnReinitialize,
      ...rest
    } = this.props;

    const closeIcon = (
      <CloseOutlined test-id={modalFormCloseIconTestId} css={closeModalIconStyle} />
    );

    const ModalComponent = (
      <Modal
        open={this.state.open}
        {...rest}
        title={title}
        key="modal-form"
        footer={footer ?? this.renderFooter()}
        styles={styles}
        closeIcon={closeIcon}
        onCancel={this.handleCancel}
      >
        <Form
          onKeyDown={this.handleEnterKeyPress}
          form={form}
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
          formStyles={formStyle}
          test-id={`${modalFormTestId}_${form}`}
          layoutType={EFormLayoutType.ModalType}
          notification={notification}
          formSubmitPanelConfig={null}
          setFormData={this.setFormData}
          sortByPriority={sortByPriority}
          keepDirtyOnReinitialize={keepDirtyOnReinitialize ?? false}
        >
          {children}
        </Form>
      </Modal>
    );

    return this.props.hasEnterHotkey ? (
      <div css={wrapperModalFormStyle} onKeyDown={this.handleModalKeyPress}>
        {ModalComponent}
      </div>
    ) : (
      ModalComponent
    );
  }
}

export const ModalForm = ModalFormComponent;
