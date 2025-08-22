import { PureComponent } from "react";
import { CloseCircleFilled } from "@infomaximum/base/src/components/Icons/Icons";
import { Button } from "@infomaximum/base/src/components/Button/Button";
import { Modal } from "@infomaximum/base/src/components/modals/Modal/Modal";
import {
  modalStyle,
  titleModalStyle,
  iconDefaultStyle,
  bodyModalStyle,
  modalContentStyle,
} from "./RemoveConfirmationModal.styles";
import { CANCEL, DELETE, DELETION } from "@infomaximum/base/src/utils/Localization/Localization";
import { withLoc } from "@infomaximum/base/src/decorators/hocs/withLoc/withLoc";
import { ModalAnimationInterval } from "@infomaximum/base/src/utils/const";
import { isFunction } from "lodash";
import {
  removeConfirmationModalCancelButtonTestId,
  removeConfirmationModalRemoveButtonTestId,
} from "@infomaximum/base/src/utils/TestIds";
import type {
  IRemoveConfirmationModalProps,
  IRemoveConfirmationModalState,
} from "./RemoveConfirmationModal.types";
import { withTheme } from "@infomaximum/base/src/decorators/hocs/withTheme";
import { Space } from "antd";
import type { Interpolation } from "@emotion/react";

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
    const { localization, title, theme, icon: Icon = CloseCircleFilled, iconStyle } = this.props;
    const styleIcon = [
      iconDefaultStyle(theme),
      isFunction(iconStyle) ? iconStyle(theme) : iconStyle,
    ] as Interpolation<TTheme>;

    return (
      <div css={modalContentStyle}>
        <div>
          <Icon css={styleIcon} />
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
      <Space size={8} key="footer-remove-confirmation-modal">
        <Button
          type="common"
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
      </Space>
    );
  };

  public override render() {
    const { maskTransitionName, className } = this.props;

    return (
      <Modal
        open={this.state.open}
        closable={false}
        styles={modalStyle}
        footer={this.getFooterModal()}
        destroyOnClose={true}
        maskTransitionName={maskTransitionName}
        className={className}
      >
        {this.getContentBodyModal()}
      </Modal>
    );
  }
}

export const RemoveConfirmationModal = withLoc(withTheme(RemoveConfirmationModalComponent));
