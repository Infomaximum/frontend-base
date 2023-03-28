import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import { createContext } from "react";

export const FeatureContext = createContext<TFeatureEnabledChecker | undefined>(undefined);
