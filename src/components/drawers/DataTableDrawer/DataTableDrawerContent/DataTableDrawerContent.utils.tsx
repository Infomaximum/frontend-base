import type { Localization } from "@infomaximum/localization";
import { handleErrorInternal } from "@infomaximum/base/src/managers/Errors/Errors";
import { alertStyle } from "./DataTableDrawerContent.styles";
import type { NCore } from "@infomaximum/base/src/libs/core";
import { Alert } from "@infomaximum/ui-kit";

export function renderErrorAlert(error: NCore.TError, localization: Localization) {
  const preparedError = handleErrorInternal(error, localization);

  if (preparedError) {
    const combinedMessage = (
      <>
        {preparedError.title}
        {preparedError.title && preparedError.message && <br />}
        {preparedError.message}
      </>
    );

    return (
      <Alert
        type="error"
        showIcon={true}
        message={combinedMessage}
        styles={alertStyle}
        test-id={preparedError.code}
      />
    );
  }
}
