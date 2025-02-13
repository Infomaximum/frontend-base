import { FeatureContext } from "../contexts/FeatureContext";
import { useContext } from "react";
import { LicenseFeatureContext } from "../contexts/LicenseFeatureContext";

export const useFeature = () => {
  const isFeatureEnabled = useContext(FeatureContext);
  const isLicenseFeatureEnabled = useContext(LicenseFeatureContext);

  return { isFeatureEnabled, isLicenseFeatureEnabled };
};
