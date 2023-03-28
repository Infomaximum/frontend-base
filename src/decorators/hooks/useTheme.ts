import type { Context } from "react";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useTheme = () => useContext(ThemeContext as unknown as Context<TTheme>);
