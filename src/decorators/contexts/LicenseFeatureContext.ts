import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import { createContext } from "react";

export const defaultLicenseFeatureChecker = () => true;

export const LicenseFeatureContext = createContext<TFeatureEnabledChecker>(
  defaultLicenseFeatureChecker
);
