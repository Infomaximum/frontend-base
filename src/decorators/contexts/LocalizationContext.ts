import React from "react";
import { Localization } from "@im/localization";

export const LocalizationContext: React.Context<Localization> = React.createContext(
  new Localization({ language: Localization.Language.ru })
);
