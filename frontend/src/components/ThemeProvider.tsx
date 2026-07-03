
import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: true });

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  isDark: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, isDark }) => {
  return (
    <ThemeContext.Provider value={{ isDark }}>
      <div className={isDark ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
