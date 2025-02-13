import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { SizeType } from "antd/lib/config-provider/SizeContext";
import type { ISubmitFormButtonProps } from "./SubmitFormButton.types";
import { FormContext, useLocalization } from "../../../decorators";
import type { TButtonType } from "../../Button/Button.types";
import { assertSimple } from "@infomaximum/assert";
import { Button } from "../../Button/Button";
import { submitFormButtonTestId } from "../../../utils/TestIds";
import { useFormButtonState } from "../hooks/useFormButtonState";
import { SAVE } from "../../../utils";

/**
 * Кнопка, которая делает submit текущих значений формы
 */
const SubmitFormButtonComponent: React.FC<ISubmitFormButtonProps> = memo(
  ({
    disableOnPristine = true,
    disableOnInvalid = false,
    size = "default" as SizeType,
    type = "primary-dark" as TButtonType,
    key,
    styles,
    className,
    formProvider: formProviderProp,
    formName: formNameProp,
    disabled,
    loading,
    ghost,
    icon: Icon,
    caption,
    focusable,
    focus,
  }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const localization = useLocalization();
    const formData = useContext(FormContext);
    const formProvider = formProviderProp ?? formData.formProvider;
    const formName = formNameProp ?? formData.formName;

    if (!formProvider || !formName) {
      assertSimple(
        false,
        "SubmitFormButton должен находится внутри Form или принимать formProvider и formName в качестве props"
      );
    }

    const { submitting, pristine, hasValidationErrors } = useFormButtonState(formProvider);

    const isDisabled =
      disabled ??
      (submitting || (disableOnPristine && pristine) || (disableOnInvalid && hasValidationErrors));

    const handleClick = useCallback(async () => {
      setIsSubmitting(true);

      try {
        await formProvider.submit();
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 100);
      }
    }, [formProvider]);

    const validState = formProvider.getState().valid;
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (focusable) {
        const activeElement = document.activeElement as HTMLElement;
        const isValidElementType =
          activeElement.getAttribute("type") !== "text" &&
          activeElement.getAttribute("type") !== "password" &&
          activeElement.getAttribute("type") !== "checkbox" &&
          !activeElement.hasAttribute("step");

        if ((!isDisabled && validState && isValidElementType) || focus) {
          buttonRef?.current?.focus();
        }
      }
    }, [focus, focusable, formProvider, isDisabled, isSubmitting, validState]);

    return (
      <Button
        key={key ?? "submit-form-button"}
        className={className}
        onClick={handleClick}
        type={type}
        disabled={isDisabled || isSubmitting}
        loading={loading ?? submitting}
        size={size}
        ghost={ghost}
        icon={Icon ? <Icon key={Icon?.name} /> : null}
        test-id={`${formName}_${submitFormButtonTestId}`}
        styles={styles}
        ref={buttonRef}
      >
        {caption || localization.getLocalized(SAVE)}
      </Button>
    );
  }
);

export const SubmitFormButton = SubmitFormButtonComponent;
