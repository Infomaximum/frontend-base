import React from "react";
import { Localization } from "@im/utils";

const LocalizationContext: React.Context<Localization> = React.createContext(
  new Localization({ language: Localization.Language.ru })
);

export default LocalizationContext;
