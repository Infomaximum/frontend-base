import { createContext } from "react";

export enum ESpaceSize {
  small = "small",
  large = "large",
}

export const SpaceSizeContext = createContext<ESpaceSize>(ESpaceSize.large);
