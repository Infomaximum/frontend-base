import { memo, useCallback, useContext, useState } from "react";
import type { SizeType } from "antd/lib/config-provider/SizeContext";
import type { ISubmitFormButtonProps } from "./SubmitFormButton.types";
import { FormContext } from "../../../decorators/contexts/FormContext";
import type { TButtonType } from "../../Button/Button.types";
import { assertSimple } from "@infomaximum/assert";
import { Button } from "../../Button/Button";
import { submitFormButtonTestId } from "../../../utils/TestIds";
import { useFormButtonState } from "./hooks/useFormButtonState";

/**
 * Кнопка, которая делает submit текущих значений формы
 */
const SubmitFormButtonComponent: React.FC<ISubmitFormButtonProps> = memo(
  ({
    disableOnPristine = true,
    disableOnInvalid = false,
    size = "default" as SizeType,
    type = "primary-dark" as TButtonType,
    styles,
    formProvider: formProviderProp,
    formName: formNameProp,
    disabled,
    loading,
    ghost,
    icon: Icon,
    caption,
  }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    return (
      <Button
        key="button"
        css={styles}
        onClick={handleClick}
        type={type}
        disabled={isDisabled || isSubmitting}
        loading={loading ?? submitting}
        size={size}
        ghost={ghost}
        icon={Icon ? <Icon key={Icon?.name} /> : null}
        test-id={`${formName}_${submitFormButtonTestId}`}
      >
        {caption || ""}
      </Button>
    );
  }
);

export const SubmitFormButton = SubmitFormButtonComponent;
