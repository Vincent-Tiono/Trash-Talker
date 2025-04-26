"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <button
          className={`${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          } inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="h-3 w-3 text-primary" />
          ) : (
            <Sun className="h-3 w-3 text-primary" />
          )}
        </button>
      </div>
    </div>
  );
}
