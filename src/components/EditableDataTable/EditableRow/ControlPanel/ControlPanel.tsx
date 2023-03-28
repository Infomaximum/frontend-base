import { PureComponent } from "react";
import type { IControlPanelProps } from "./ControlPanel.types";
import { EditableRowSubmitButton } from "../EditableRowSubmitButton/EditableRowSubmitButton";
import { EditableRowResetButton } from "../EditableRowResetButton/EditableRowResetButton";
import { containerStyle } from "./ControlPanel.styles.";
import { CheckOutlined, CloseOutlined } from "../../../Icons/Icons";

class ControlPanel extends PureComponent<IControlPanelProps> {
  private get formButtons() {
    const { onCancel } = this.props;

    return (
      <>
        <EditableRowSubmitButton disableOnInvalid={true}>
          <CheckOutlined />
        </EditableRowSubmitButton>
        <EditableRowResetButton onCancel={onCancel}>
          <CloseOutlined />
        </EditableRowResetButton>
      </>
    );
  }

  public override render() {
    const { isEditing, children } = this.props;

    return <div css={containerStyle}>{isEditing ? this.formButtons : children}</div>;
  }
}

export { ControlPanel };
