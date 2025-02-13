import type { IPasswordWithButtonFieldProps } from "./PasswordWithButtonField.types";
import { PASSWORD, CHANGE_PASSWORD } from "../../../utils/Localization/Localization";
import { useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  changePasswordButtonTestId,
  passwordFieldsPasswordVisibilityIconTestId,
} from "../../../utils/TestIds";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { useForm } from "../../../decorators/hooks/useForm";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { FormOption } from "../FormOption/FormOption";
import { Button } from "../../Button/Button";
import { FormField } from "../FormField/FormField";
import { InputFieldComponent } from "../InputField/InputField";
import { Input } from "../../Input/Input";
import { EyeInvisibleOutlined, EyeOutlined } from "../../Icons";

/**
 * Компонент для ввода пароля с кнопкой
 * Если пароль был задан, то отображается кнопка для смены пароля
 * если нет, то отображается инпут
 */
const PasswordWithButtonFormFieldComponent: React.FC<IPasswordWithButtonFieldProps> = ({
  hasPassword,
  buttonLabel,
  buttonCaption,
  priority,
  ...rest
}) => {
  const localization = useLocalization();

  const [isEditablePassword, setEditablePasswordState] = useState(false);

  const [isSubmitSuccesses, setSubmitSuccessesState] = useState(false);

  const formData = useContext(FormContext);

  const { setFormData } = useForm<TDictionary>(
    ({ submitSucceeded, hasSubmitErrors }) => {
      setSubmitSuccessesState(submitSucceeded && !hasSubmitErrors);
    },
    { submitSucceeded: true, hasSubmitErrors: true }
  );

  useEffect(() => {
    if (hasPassword && isSubmitSuccesses && isEditablePassword) {
      setEditablePasswordState(false);
    }
  }, [hasPassword, isEditablePassword, isSubmitSuccesses]);

  useEffect(() => {
    if (formData) {
      setFormData(formData);
    }
  }, [formData, setFormData]);

  const renderVisibilityIcon = useCallback((visible: ReactNode) => {
    const PasswordIcon = visible ? EyeOutlined : EyeInvisibleOutlined;

    return <PasswordIcon test-id={passwordFieldsPasswordVisibilityIconTestId} />;
  }, []);

  const handleClick = useCallback(() => {
    setEditablePasswordState(true);
  }, []);

  if (hasPassword && !isEditablePassword) {
    return (
      <FormOption
        key="set_password"
        priority={priority}
        label={buttonLabel || localization.getLocalized(PASSWORD)}
      >
        <Button
          onClick={handleClick}
          test-id={changePasswordButtonTestId}
          disabled={rest?.disabled || rest?.readOnly}
        >
          {buttonCaption || localization.getLocalized(CHANGE_PASSWORD)}
        </Button>
      </FormOption>
    );
  }

  return (
    <FormField
      component={InputFieldComponent}
      label={buttonLabel || localization.getLocalized(PASSWORD)}
      colon={false}
      labelAlign="left"
      inputComponent={Input.Password}
      autoFocus={isEditablePassword}
      priority={priority}
      iconRender={renderVisibilityIcon}
      {...rest}
    />
  );
};

export const PasswordWithButtonFormField = PasswordWithButtonFormFieldComponent;
