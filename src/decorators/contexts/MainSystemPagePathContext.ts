import { createContext } from "react";
import { rootPath } from "@infomaximum/base/src/utils/Routes";

export const MainSystemPagePathContext = createContext<string>(rootPath);
