import { createContext } from "react";
import type { NCore } from "../../libs/core";

export const RoutesContext = createContext<NCore.IRoute[] | undefined>([]);
