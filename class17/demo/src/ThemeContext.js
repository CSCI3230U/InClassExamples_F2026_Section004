import { createContext } from "react";

// Rarely changes, needed everywhere: a good fit for Context.
// "light" is the default for components with no Provider above them.
export const ThemeContext = createContext("light");
