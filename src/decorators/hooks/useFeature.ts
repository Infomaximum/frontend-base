import { FeatureContext } from "../contexts/FeatureContext";
import { useContext } from "react";

export const useFeature = () => {
  const isFeatureEnabled = useContext(FeatureContext);

  return { isFeatureEnabled };
};
