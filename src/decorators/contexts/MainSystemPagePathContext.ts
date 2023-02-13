import { createContext } from "react";
import { rootPath } from "../../utils";

export const MainSystemPagePathContext = createContext<string>(rootPath);
