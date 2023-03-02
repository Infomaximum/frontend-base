import { createContext } from "react";
import type { ESpaceSize } from "../../fields/FormOption/FormOption";

export const SpaceSizeContext = createContext<ESpaceSize | undefined>(undefined);
