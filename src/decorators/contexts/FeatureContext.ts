import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import { createContext } from "react";

export const defaultFeatureChecker = () => true;

export const FeatureContext = createContext<TFeatureEnabledChecker>(defaultFeatureChecker);
