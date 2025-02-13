import { memo, useCallback, useContext } from "react";
import type { ICancelChangesFormButtonProps } from "./CancelChangesFormButton.types";
import { Button } from "../../Button";
import { assertSimple } from "@infomaximum/assert";
import { useFormButtonState } from "../hooks/useFormButtonState";
import { FormContext, useLocalization } from "../../../decorators";
import { CANCEL_CHANGES, cancelChangesFormButtonTestId } from "../../../utils";
import type { TButtonType } from "../../Button/Button.types";
import type { SizeType } from "antd/lib/config-provider/SizeContext";

/**
 * Кнопка, которая очищает форму от текущих изменений
 */
const CancelChangesFormButtonComponent: React.FC<ICancelChangesFormButtonProps> = memo(
  ({
    size = "default" as SizeType,
    type = "ghost-white" as TButtonType,
    key,
    styles,
    disabled,
    caption,
    formProvider: formProviderProp,
    formName: formNameProp,
    className,
    disableOnPristine = true,
    icon: Icon,
    ghost,
  }) => {
    const localization = useLocalization();

    const formData = useContext(FormContext);
    const formProvider = formProviderProp ?? formData.formProvider;
    const formName = formNameProp ?? formData.formName;

    if (!formProvider || !formName) {
      assertSimple(
        false,
        "CancelChangesFormButton должен находится внутри Form или принимать formProvider и formName в качестве props"
      );
    }

    const { submitting, pristine } = useFormButtonState(formProvider);

    const isDisabled = disabled ?? (submitting || (disableOnPristine && pristine));

    const handleClick = useCallback(() => {
      // ! Костыль, необходимый из-за флага keepDirtyOnReinitialize = true
      formProvider.setConfig("keepDirtyOnReinitialize", false);
      formProvider.reset();
      formProvider.setConfig("keepDirtyOnReinitialize", true);
    }, [formProvider]);

    return (
      <Button
        key={key ?? "cancel-changes-form-button"}
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
        className={className}
        size={size}
        ghost={ghost}
        icon={Icon ? <Icon key={Icon?.name} /> : null}
        test-id={`${formName}_${cancelChangesFormButtonTestId}`}
        styles={styles}
      >
        {caption || localization.getLocalized(CANCEL_CHANGES)}
      </Button>
    );
  }
);

export const CancelChangesFormButton = CancelChangesFormButtonComponent;
