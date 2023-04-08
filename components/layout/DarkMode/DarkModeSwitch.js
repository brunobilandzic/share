import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";

import React, { useEffect, useState } from "react";

export default function DarkModeSwitch() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-3 text-lg cursor-pointer">
      {mounted && currentTheme === "dark" ? (
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
