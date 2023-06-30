import { createContext } from "react";
import { rootPath } from "../../utils/Routes";

export const MainSystemPagePathContext = createContext<string>(rootPath);
