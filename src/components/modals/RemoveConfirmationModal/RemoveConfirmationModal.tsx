import { PureComponent } from "react";
import { CloseCircleFilled } from "../../Icons/Icons";
import { Button } from "../../Button/Button";
import { Modal } from "../../modals/Modal/Modal";
import {
  bodyStyle,
  titleModalStyle,
  iconStyle,
  bodyModalStyle,
  modalContentStyle,
} from "./RemoveConfirmationModal.styles";
import { CANCEL, DELETE, DELETION } from "../../../utils/Localization/Localization";
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
import { withTheme } from "../../../decorators/hocs/withTheme";

class RemoveConfirmationModalComponent extends PureComponent<
  IRemoveConfirmationModalProps,
  IRemoveConfirmationModalState
> {
  public override readonly state: Readonly<IRemoveConfirmationModalState> = {
    open: true,
    isLoading: false,
  };

  public static defaultProps = {
    buttonRemoveText: DELETE,
  } as const;

  private getContentBodyModal = () => {
    const { localization, title, theme } = this.props;

    return (
      <div css={modalContentStyle}>
        <div>
          <CloseCircleFilled css={iconStyle(theme)} />
        </div>
        <div>
          <div css={titleModalStyle(theme)}>
            {title ? title : localization.getLocalized(DELETION)}
          </div>
          {this.props.children && <span css={bodyModalStyle(theme)}>{this.props.children}</span>}
        </div>
      </div>
    );
  };

  private onCloseModal() {
    this.setState({ open: false });
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

  private handleConfirm = () => {
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
  };

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
        open={this.state.open}
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

export const RemoveConfirmationModal = withLoc(withTheme(RemoveConfirmationModalComponent));
