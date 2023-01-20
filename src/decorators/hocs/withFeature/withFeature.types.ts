import type { TFeatureEnabledChecker } from "@im/utils";

export interface IWithFeatureProps {
  isFeatureEnabled?: TFeatureEnabledChecker;
}
