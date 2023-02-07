import React, { useCallback } from "react";
import type { IEditableRowButtonProps } from "./EditableRowButton.types";
import {
  defaultButtonStyle,
  acceptButtonStyle,
  cancelButtonStyle,
  disabledButtonStyle,
  removeButtonStyle,
} from "./EditableRowButton.styles";

enum EEditableRowButtonTypes {
  DEFAULT = "DEFAULT",
  ACCEPT = "ACCEPT",
  CANCEL = "CANCEL",
  REMOVE = "REMOVE",
}

const EditableRowButtonComponent: React.FC<IEditableRowButtonProps> & {
  types: typeof EEditableRowButtonTypes;
} = ({ type, children, onClick, disabled, clickHandlerData, ...rest }) => {
  const handleClick: typeof onClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClick(clickHandlerData);
    },
    [onClick, clickHandlerData]
  );

  let buttonStyle;
  if (disabled) {
    buttonStyle = disabledButtonStyle;
  } else {
    switch (type) {
      case EEditableRowButtonTypes.ACCEPT:
        buttonStyle = acceptButtonStyle;
        break;
      case EEditableRowButtonTypes.CANCEL:
        buttonStyle = cancelButtonStyle;
        break;
      case EEditableRowButtonTypes.REMOVE:
        buttonStyle = removeButtonStyle;
        break;
      default:
        buttonStyle = defaultButtonStyle;
    }
  }

  return (
    <div
      css={buttonStyle}
      onClick={!disabled ? handleClick : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};

EditableRowButtonComponent.defaultProps = {
  type: EEditableRowButtonTypes.DEFAULT,
};

EditableRowButtonComponent.types = EEditableRowButtonTypes;

const EditableRowButton = EditableRowButtonComponent;

export { EditableRowButton, EEditableRowButtonTypes };
