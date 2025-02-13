import { createContext } from "react";

export enum ESpaceSize {
  default = "default",
  large = "large",
  table = "table",
  modal = "modal",
}

export const SpaceSizeContext = createContext<ESpaceSize>(ESpaceSize.large);
