import React from "react";
import { ThemeProvider } from "next-themes";

export default function DarkModeProvider({ children }) {
  return (
    <>
      <ThemeProvider enableSystem={true} attribute="class">
        {children}
      </ThemeProvider>
    </>
  );
}
