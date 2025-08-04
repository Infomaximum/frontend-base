import type { Localization, TLocalizationDescription } from "@infomaximum/localization";
import {
  SWITCHED_OFF,
  SWITCHED_ENABLED,
  APPLIED_MALE,
  APPLIED_FEMALE,
  APPLIED_NEUTER,
  APPLIED_PLURAL,
} from "../../utils/Localization/Localization";
import { switchedEnabledStyle, switchedOffStyle } from "./Message.styles";
import type { EMassAssignEndings } from "./Message.types";

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
      <span css={switchedEnabledStyle}>{localization.getLocalized(SWITCHED_ENABLED)}</span>
    );
  } else if (!locTerm) {
    statusLoc = <span css={switchedOffStyle}>{localization.getLocalized(SWITCHED_OFF)}</span>;
  }

  return statusLoc;
};

export const getAppliedLocalized = (localization: Localization, ending: EMassAssignEndings) => {
  switch (ending) {
    case "male":
      return localization.getLocalized(APPLIED_MALE);
    case "female":
      return localization.getLocalized(APPLIED_FEMALE);
    case "neuter":
      return localization.getLocalized(APPLIED_NEUTER);
    case "plural":
      return localization.getLocalized(APPLIED_PLURAL);
  }
};
