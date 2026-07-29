import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  type SiteTheme,
  getDarkPageClasses,
  persistSiteTheme,
  readSiteTheme,
} from '../utils/darkPageTheme';

interface SiteThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
  classes: ReturnType<typeof getDarkPageClasses>;
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(() => readSiteTheme());

  const setTheme = useCallback((next: SiteTheme) => {
    setThemeState(next);
    persistSiteTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('page-theme-light', theme === 'light');
    root.classList.toggle('page-theme-dark', theme === 'dark');
    root.style.colorScheme = theme;

    return () => {
      delete root.dataset.theme;
      root.classList.remove('page-theme-light', 'page-theme-dark');
      root.style.colorScheme = '';
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      classes: getDarkPageClasses(theme),
    }),
    [setTheme, theme, toggleTheme],
  );

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>;
}

export function useSiteTheme() {
  const ctx = useContext(SiteThemeContext);
  if (!ctx) {
    throw new Error('useSiteTheme must be used within SiteThemeProvider');
  }
  return ctx;
}

/** @deprecated Use useSiteTheme */
export function useDarkPageTheme() {
  return useSiteTheme();
}
