import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { titleAndInfoStyle, iconStyle } from "./FormConfirmationModal.styles";
import type { IFormConfirmationModalProps } from "./FormConfirmationModal.types";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { contains } from "../../../utils/URI/URI";
import { useMountEffect } from "../../../decorators/hooks/useMountEffect";
import { ModalAnimationInterval, Z_INDEX_FORM_CONFIRMATION_MODAL } from "../../../utils/const";
import {
  SAVE,
  UNABLE_TO_SAVE_CHANGE,
  SAVE_CHANGES,
  MAKE_SURE_FIELDS_FILLED_CORRECTLY,
} from "../../../utils/Localization/Localization";
import { useBlocker } from "react-router";
import { useBeforeUnload } from "react-router-dom";
import { usePrevious } from "../../../decorators";

const FormConfirmationModalComponent: React.FC<IFormConfirmationModalProps> = ({
  formProvider,
  when,
  blockUri,
}) => {
  const localization = useLocalization();
  const [hasSubmitErrors, setHasSubmitErrors] = useState<boolean>(
    formProvider?.getState().hasSubmitErrors
  );
  const [invalid, setInvalid] = useState<boolean>(formProvider?.getState().invalid);

  const prevHasSubmitErrors = usePrevious(hasSubmitErrors);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (when) {
          event.preventDefault();
        }
      },
      [when]
    ),
    { capture: true }
  );

  const blocker = useBlocker(({ nextLocation, currentLocation }) => {
    const pathname = nextLocation.pathname;
    const { hasValidationErrors, errors } = formProvider.getState();
    const mutators = formProvider.mutators;

    // Если пытаемся перейти по пути, который не соответствует blockUri
    // и не является его дочерней страницей, то блокируем переход
    if (
      when &&
      contains(currentLocation.pathname, blockUri) &&
      (blockUri !== pathname || !contains(pathname, blockUri as string))
    ) {
      if (hasValidationErrors && mutators?.touch && errors) {
        mutators.touch(Object.keys(errors));
      }

      return true;
    }

    return false;
  });

  useMountEffect(() => {
    if (formProvider) {
      formProvider.subscribe(
        ({ hasSubmitErrors, invalid }) => {
          setHasSubmitErrors(hasSubmitErrors);
          setInvalid(invalid);
        },
        {
          hasSubmitErrors: true,
          invalid: true,
        }
      );
    }
  });

  const handleHide = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  const handleSuccess = useCallback(() => {
    if (!formProvider.getState().invalid && !formProvider.getState().hasSubmitErrors) {
      blocker.proceed?.();
    }
  }, [formProvider, blocker]);

  const handleSaveButtonClick = useCallback(
    () =>
      new Promise<TDictionary>((res, rej) => {
        if (formProvider) {
          formProvider.submit()?.then(res, rej);
        }
      }),
    [formProvider]
  );

  const handleResumeButtonClick = useCallback(() => {
    blocker.proceed?.();
  }, [blocker]);

  useEffect(() => {
    if (prevHasSubmitErrors !== hasSubmitErrors) {
      setTimeout(handleHide, ModalAnimationInterval);
    }
  }, [handleHide, hasSubmitErrors, prevHasSubmitErrors]);

  const title = useMemo(
    () => (
      <span css={titleAndInfoStyle}>
        {invalid || hasSubmitErrors
          ? localization.getLocalized(UNABLE_TO_SAVE_CHANGE)
          : localization.getLocalized(SAVE_CHANGES)}
      </span>
    ),
    [invalid, hasSubmitErrors, localization]
  );

  return blocker.state === "blocked" ? (
    <ConfirmationModal
      isWithoutSaveMode={invalid || hasSubmitErrors}
      onConfirm={handleSaveButtonClick}
      onAfterCancel={handleHide}
      withAdditionalButton={!(invalid || hasSubmitErrors)}
      onAdditionalButtonClick={handleResumeButtonClick}
      iconStyle={iconStyle}
      buttonOkText={SAVE}
      onAfterConfirm={handleSuccess}
      title={title}
      zIndex={Z_INDEX_FORM_CONFIRMATION_MODAL}
    >
      {(invalid || hasSubmitErrors) && (
        <span css={titleAndInfoStyle}>
          {localization.getLocalized(MAKE_SURE_FIELDS_FILLED_CORRECTLY)}
        </span>
      )}
    </ConfirmationModal>
  ) : null;
};

export const FormConfirmationModal = FormConfirmationModalComponent;
