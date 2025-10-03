import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext({ isDark: undefined, setIsDark: () => {} });

export const ThemeProvider = ({ children }) => {
  const systemIsDark = Appearance.getColorScheme() === 'dark';
  const [isDark, setIsDark] = useState(undefined);

  const value = useMemo(
    () => ({ isDark, setIsDark, systemIsDark }),
    [isDark, setIsDark, systemIsDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemePreference = () => useContext(ThemeContext);


