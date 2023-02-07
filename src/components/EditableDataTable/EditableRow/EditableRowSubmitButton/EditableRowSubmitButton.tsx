import { memo, useContext } from "react";
import type { IEditableRowSubmitButtonProps } from "./EditableRowSubmitButton.types";
import { EditableRowButton } from "../EditableRowButton/EditableRowButton";
import { FormContext } from "../../../../decorators/contexts/FormContext";
import { assertSimple } from "@im/asserts";
import { useFormButtonState } from "../../../forms/SubmitFormButton/hooks/useFormButtonState";
import { submitFormButtonTestId } from "../../../../utils/TestIds";
import { LoadingOutlined } from "../../../Icons/Icons";

/**
 * Кнопка, которая делает submit текущих значений формы-строки таблицы
 */
const EditableRowSubmitButtonComponent: React.FC<
  IEditableRowSubmitButtonProps
> = ({
  disableOnPristine = true,
  disableOnInvalid = false,
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

  const { submitting, pristine, hasValidationErrors } =
    useFormButtonState(formProvider);

  const isDisabled =
    disabled ??
    (submitting ||
      (disableOnPristine && pristine) ||
      (disableOnInvalid && hasValidationErrors));

  const handleClick = formProvider.submit;

  return (
    <EditableRowButton
      key="button"
      onClick={handleClick}
      type={EditableRowButton.types.ACCEPT}
      disabled={isDisabled}
      test-id={`${formName}_${submitFormButtonTestId}`}
    >
      {!submitting ? children : <LoadingOutlined />}
    </EditableRowButton>
  );
};

const EditableRowSubmitButton = memo(EditableRowSubmitButtonComponent);

export { EditableRowSubmitButton };
