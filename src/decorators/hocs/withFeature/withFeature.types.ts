import type { TFeatureEnabledChecker } from "@infomaximum/utility";

export interface IWithFeatureProps {
  isFeatureEnabled: TFeatureEnabledChecker;
}
