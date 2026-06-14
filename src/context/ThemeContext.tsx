import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_THEME = "zacart_theme";

type Theme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(STORAGE_THEME);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = () =>
    setTheme((theme) => (theme === "light" ? "dark" : "light"));

  // Apply the theme to  html to make bootstrap  reculor all its component
  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
