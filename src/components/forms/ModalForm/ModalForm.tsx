import React from "react";
import { has, isFunction } from "lodash";
import { formStyle, modalBodyStyle } from "./ModalForm.styles";
import { EFormLayoutType } from "../BaseForm/BaseForm.types";
import {
  modalFormCancelButtonTestId,
  modalFormCloseIconTestId,
  modalFormTestId,
} from "../../../utils/TestIds";
import type { IModalFormProps, IModalFormState } from "./ModalForm.types";
import type { FormApi } from "final-form";
import type { IFormData } from "../../../decorators/contexts/FormContext";
import { ModalAnimationInterval } from "../../../utils/const";
import { Button } from "../../Button/Button";
import { SubmitFormButton } from "../SubmitFormButton/SubmitFormButton";
import { CloseOutlined } from "../../Icons/Icons";
import { Modal } from "../../modals/Modal/Modal";
import { Form } from "../Form";
import { closeModalIconStyle } from "../../../styles/common.styles";

class ModalFormComponent extends React.PureComponent<
  IModalFormProps,
  IModalFormState
> {
  public static defaultProps = {
    bodyStyle: modalBodyStyle,
  };

  public override readonly state: Readonly<IModalFormState> = {
    isVisible: true,
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
    this.setState({ isVisible: false });
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

    // если передаем visible, то не нужно закрывать модалку через this.afterCloseModal
    if (has(this.props, "visible")) {
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

  private renderFooter(): React.ReactNode {
    const {
      okText,
      cancelText,
      form,
      disableSubmitOnPristine,
      disableSubmitOnInvalid,
    } = this.props;

    return (
      this.state.formProvider && (
        <div key="modal-footer">
          <Button
            type="ghost"
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
          />
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
      title,
      bodyStyle,
      notification,
      afterSubmit,
      setFormData,
      footer,
      sortByPriority,
      ...rest
    } = this.props;

    const closeIcon = (
      <CloseOutlined
        test-id={modalFormCloseIconTestId}
        css={closeModalIconStyle}
      />
    );

    return (
      <Modal
        visible={this.state.isVisible}
        {...rest}
        title={title}
        key="modal-form"
        footer={footer ?? this.renderFooter()}
        bodyStyle={bodyStyle}
        closeIcon={closeIcon}
        centered={true}
        onCancel={this.handleCancel}
      >
        <Form
          form={form}
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
          formStyles={formStyle}
          test-id={`${modalFormTestId}_${form}`}
          layoutType={EFormLayoutType.ModalType}
          notification={notification}
          header={null}
          setFormData={this.setFormData}
          sortByPriority={sortByPriority}
        >
          {children}
        </Form>
      </Modal>
    );
  }
}

export const ModalForm = ModalFormComponent;
