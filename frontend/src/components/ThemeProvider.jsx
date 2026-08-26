"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("me_vocatio_theme");
    const darkEnabled = savedTheme ? savedTheme === "dark" : true;
    setIsDarkMode(darkEnabled);
    if (darkEnabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newThemeState = !isDarkMode;
    setIsDarkMode(newThemeState);
    if (newThemeState) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("me_vocatio_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("me_vocatio_theme", "light");
    }
  };

  const bodyClass = mounted
    ? isDarkMode
      ? "bg-[#0b1329] text-slate-100"
      : "bg-slate-100 text-slate-900"
    : "bg-[#0b1329] text-slate-100";

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <body
        className={`antialiased font-sans transition-colors duration-300 ${bodyClass}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </ThemeContext.Provider>
  );
}
