import type { NCore } from "@infomaximum/module-expander";
import { createContext } from "react";

export const RoutesContext = createContext<NCore.IRoutes[] | undefined>([]);
