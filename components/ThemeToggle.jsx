import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";
  return (
    <button
      className="btn-ghost flex items-center gap-2"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
