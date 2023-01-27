import { PureComponent } from "react";
import { CloseCircleOutlined } from "../../Icons/Icons";
import { Button } from "../../Button/Button";
import { Modal } from "../../modals/Modal/Modal";
import {
  bodyStyle,
  titleModalStyle,
  iconStyle,
  bodyModalStyle,
  modalContentStyle,
} from "./RemoveConfirmationModal.styles";
import {
  CANCEL,
  DELETE,
  DELETION,
} from "../../../utils/Localization/Localization";
import { withLoc } from "../../../decorators/hocs/withLoc/withLoc";
import { ModalAnimationInterval } from "../../../utils/const";
import { isFunction } from "lodash";
import {
  removeConfirmationModalCancelButtonTestId,
  removeConfirmationModalRemoveButtonTestId,
} from "../../../utils/TestIds";
import type {
  IRemoveConfirmationModalProps,
  IRemoveConfirmationModalState,
} from "./RemoveConfirmationModal.types";

class RemoveConfirmationModalComponent extends PureComponent<
  IRemoveConfirmationModalProps,
  IRemoveConfirmationModalState
> {
  public override readonly state: Readonly<IRemoveConfirmationModalState> = {
    isVisible: true,
    isLoading: false,
  };

  public static defaultProps = {
    buttonRemoveText: DELETE,
  } as const;

  private getContentBodyModal = () => {
    const { localization, title } = this.props;

    return (
      <div css={modalContentStyle}>
        <div>
          <CloseCircleOutlined css={iconStyle} />
        </div>
        <div>
          <span css={titleModalStyle}>
            {title ? title : localization.getLocalized(DELETION)}
          </span>
          <span css={bodyModalStyle}>{this.props.children}</span>
        </div>
      </div>
    );
  };

  private onCloseModal() {
    this.setState({ isVisible: false });
  }

  private afterCloseModal(callback: () => void) {
    if (isFunction(callback)) {
      setTimeout(callback, ModalAnimationInterval);
    }
  }

  private handleCancel = () => {
    this.onCloseModal();
    this.afterCloseModal(this.props.onAfterCancel);
  };

  private handleConfirm() {
    const { onConfirm, onAfterConfirm, onAfterCancel } = this.props;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        onConfirm()
          .then(() => {
            this.onCloseModal();
            this.afterCloseModal(onAfterConfirm ?? onAfterCancel);
          })
          .finally(() => {
            this.setState({
              isLoading: false,
            });
          });
      }
    );
  }

  private getFooterModal = () => {
    const { localization, buttonRemoveText } = this.props;
    const { isLoading } = this.state;

    return (
      <div key="footer-remove-confirmation-modal">
        <Button
          type="ghost"
          key="remove-confirmation-modal_cancel-button"
          onClick={this.handleCancel}
          test-id={removeConfirmationModalCancelButtonTestId}
        >
          {localization.getLocalized(CANCEL)}
        </Button>
        <Button
          key="remove-confirmation-modal_remove-button"
          onClick={this.handleConfirm}
          type="primary"
          danger={true}
          loading={isLoading}
          test-id={removeConfirmationModalRemoveButtonTestId}
        >
          {localization.getLocalized(buttonRemoveText)}
        </Button>
      </div>
    );
  };

  public override render() {
    return (
      <Modal
        width={416}
        visible={this.state.isVisible}
        closable={false}
        centered={true}
        bodyStyle={bodyStyle}
        footer={this.getFooterModal()}
        destroyOnClose={true}
        zIndex={5000}
        onCancel={this.handleCancel}
      >
        {this.getContentBodyModal()}
      </Modal>
    );
  }
}

export const RemoveConfirmationModal = withLoc(
  RemoveConfirmationModalComponent
);
