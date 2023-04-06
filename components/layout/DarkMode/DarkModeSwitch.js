import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";

import React from "react";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-3 text-lg cursor-pointer">
      {theme === "dark" ? (
        <FaSun
          className="text-yellow-200 hover:text-yellow-500"
          onClick={() => setTheme("light")}
        />
      ) : (
        <FaMoon
          className="text-gray-500 hover:text-gray-900"
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  );
}
