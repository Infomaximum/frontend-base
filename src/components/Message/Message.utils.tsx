import type React from "react";
import type { Localization, TLocalizationDescription } from "@infomaximum/localization";
import { SWITCHED_OFF, SWITCHED_ENABLED } from "../../utils/Localization/Localization";
import { switchedEnabledStyles, switchedOffStyles } from "./Message.styles";

export const getStyledAndLocalizedEntities = (
  status: boolean,
  localization: Localization,
  locTerm?: TLocalizationDescription
): React.ReactNode => {
  let statusLoc;

  if (locTerm) {
    statusLoc = <span>{localization.getLocalized(locTerm)}</span>;
  }

  if (status) {
    statusLoc = (
      <span css={switchedEnabledStyles}>{localization.getLocalized(SWITCHED_ENABLED)}</span>
    );
  } else if (!locTerm) {
    statusLoc = <span css={switchedOffStyles}>{localization.getLocalized(SWITCHED_OFF)}</span>;
  }

  return statusLoc;
};
