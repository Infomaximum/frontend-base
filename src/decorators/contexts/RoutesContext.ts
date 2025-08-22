import { createContext } from "react";
import type { NCore } from "@infomaximum/base/src/libs/core";

export const RoutesContext = createContext<NCore.IRoute[] | undefined>([]);
