import { useCallback, memo, useContext } from "react";
import type { IEditableRowResetButtonProps } from "./EditableRowResetButton.types";
import { EditableRowButton } from "../EditableRowButton/EditableRowButton";
import { useFormButtonState } from "../../../forms/SubmitFormButton/hooks/useFormButtonState";
import { assertSimple } from "@im/asserts";
import { FormContext } from "../../../../decorators/contexts/FormContext";

const EditableRowResetButtonComponent: React.FC<IEditableRowResetButtonProps> = ({
  onCancel,
  formProvider: formProviderProp,
  formName: formNameProp,
  disabled,
  children,
}) => {
  const formData = useContext(FormContext);
  const formProvider = formProviderProp ?? formData.formProvider;
  const formName = formNameProp ?? formData.formName;

  if (!formProvider || !formName) {
    assertSimple(
      false,
      "EditableRowSubmitButton должен находится внутри Form или принимать formProvider и formName в качестве props"
    );
  }

  const { submitting } = useFormButtonState(formProvider);

  const handleClick = useCallback(() => {
    onCancel();
    formProvider.reset();
  }, [onCancel, formProvider]);

  return (
    <EditableRowButton
      key="button"
      onClick={handleClick}
      type={EditableRowButton.types.CANCEL}
      disabled={disabled || submitting}
      test-id={`${formName}_editable_form_button`}
    >
      {children}
    </EditableRowButton>
  );
};

const EditableRowResetButton = memo(EditableRowResetButtonComponent);

export { EditableRowResetButton };
