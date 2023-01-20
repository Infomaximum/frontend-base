import type { TFeatureEnabledChecker } from "@im/utils";
import { createContext } from "react";

export const FeatureContext = createContext<TFeatureEnabledChecker | undefined>(undefined);
