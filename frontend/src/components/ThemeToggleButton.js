"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleButton() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
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

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 sm:p-2.5 rounded-full border transition-all active:scale-95 shadow-md cursor-pointer ${isDarkMode
                    ? "bg-slate-800/80 border-purple-500/30 text-slate-300 hover:text-white hover:border-purple-400"
                    : "bg-white border-slate-300 text-slate-700 hover:text-black hover:border-purple-500"
                }`}
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            )}
        </button>
    );
}