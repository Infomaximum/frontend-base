import type { NCore } from "@im/core";
import type { Localization } from "@im/localization";
import { handleErrorInternal } from "../../../../managers/Errors/Errors";
import { Alert } from "../../../Alert/Alert";
import { errorAlertStyle } from "./DataTableDrawerContent.styles";

export function renderErrorAlert(error: NCore.TError, localization: Localization) {
  const preparedError = handleErrorInternal(error, localization);

  if (preparedError) {
    return (
      <Alert
        type="error"
        showIcon={true}
        message={preparedError.title}
        description={preparedError.message}
        css={errorAlertStyle}
        test-id={preparedError.code}
      />
    );
  }
}
