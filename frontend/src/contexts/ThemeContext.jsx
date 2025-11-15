import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const getInitial = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  };

  const [isDark, setIsDark] = useState(getInitial);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ensure the document class matches the state (safe to run after hydration)
    document.documentElement.classList.toggle('dark', isDark);
    setMounted(true);
  }, [isDark]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };

  const value = {
    isDark,
    toggleTheme,
    mounted
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
