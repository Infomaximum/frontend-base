import { FeatureContext } from "@im/base/src/decorators/contexts/FeatureContext";
import { useContext } from "react";

export const useFeature = () => {
  const isFeatureEnabled = useContext(FeatureContext);

  return { isFeatureEnabled };
};
