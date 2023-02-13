import { LocalizationContext } from "../contexts/LocalizationContext";
import { useContext } from "react";

export const useLocalization = () => {
  const localization = useContext(LocalizationContext);

  return localization;
};
