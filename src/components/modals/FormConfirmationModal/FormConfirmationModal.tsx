import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { titleAndInfoStyle, iconStyle } from "./FormConfirmationModal.styles";
import type { IFormConfirmationModalProps } from "./FormConfirmationModal.types";
import type { Transition } from "history";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { contains } from "../../../utils/URI/URI";
import { useBlocker } from "../../../decorators/hooks/useBlocker";
import { useMountEffect } from "../../../decorators/hooks/useMountEffect";
import { ModalAnimationInterval, Z_INDEX_FORM_CONFIRMATION_MODAL } from "../../../utils/const";
import {
  SAVE,
  UNABLE_TO_SAVE_CHANGE,
  SAVE_CHANGES,
  MAKE_SURE_FIELDS_FILLED_CORRECTLY,
} from "../../../utils/Localization/Localization";

const FormConfirmationModalComponent: React.FC<IFormConfirmationModalProps> = ({
  formProvider,
  when,
  blockUri,
}) => {
  const localization = useLocalization();

  const [open, setOpen] = useState(false);
  const [hasSubmitErrors, setHasSubmitErrors] = useState<boolean>(
    formProvider?.getState().hasSubmitErrors
  );
  const [invalid, setInvalid] = useState<boolean>(formProvider?.getState().invalid);

  const retryRef = useRef<() => void>();

  const blocker = useCallback(
    (tx: Transition) => {
      const pathname = tx.location.pathname;
      const { hasValidationErrors, errors } = formProvider.getState();
      const mutators = formProvider.mutators;

      // Если пытаемся перейти по пути, который не соответствует blockUri
      // и не является его дочерней страницей, то блокируем переход
      if (blockUri !== pathname || !contains(pathname, blockUri as string)) {
        if (hasValidationErrors && mutators?.touch && errors) {
          mutators.touch(Object.keys(errors));
        }

        setOpen(true);
        retryRef.current = tx.retry;
      }
    },
    [blockUri, formProvider]
  );

  useBlocker(blocker, when);

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
    setOpen(false);
  }, []);

  useEffect(() => {
    if (hasSubmitErrors) {
      handleHide();
    }
  }, [handleHide, hasSubmitErrors]);

  const handleSuccess = useCallback(() => {
    if (
      retryRef.current &&
      !formProvider.getState().invalid &&
      !formProvider.getState().hasSubmitErrors
    ) {
      retryRef.current();
    }
  }, [formProvider]);

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
    retryRef.current?.();
  }, []);

  useEffect(() => {
    if (hasSubmitErrors) {
      setTimeout(handleHide, ModalAnimationInterval);
    }
  }, [handleHide, hasSubmitErrors]);

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

  return open ? (
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
