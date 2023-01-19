import { ThemeContext } from "@emotion/react";
import type { Context } from "react";
import { useContext } from "react";

export const useTheme = () => useContext(ThemeContext as Context<TTheme>);
