import type { NCore } from "@im/core";
import { createContext } from "react";

export const RoutesContext = createContext<NCore.IRoutes[] | undefined>([]);
