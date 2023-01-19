import { LocalizationContext } from "@im/utils";
import { useContext } from "react";

export const useLocalization = () => {
  const localization = useContext(LocalizationContext);

  return localization;
};
