import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cores para modo claro
const lightTheme = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#A9A9A9',
  primary: '#405CBA',
  secondary: '#4A90E2',
  accent: '#3FA2FF',
  border: '#E9ECEF',
  divider: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  statusBar: 'dark-content',
};

// Cores para modo escuro
const darkTheme = {
  background: '#2C2C2C',
  surface: '#3A3A3A',
  cardBackground: '#3A3A3A',
  textPrimary: '#FFFFFF',
  textSecondary: '#D9D9D9',
  textTertiary: '#A9A9A9',
  primary: '#405CBA',
  secondary: '#405CBA',
  accent: '#405CBA',
  border: '#D9D9D9',
  divider: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.3)',
  statusBar: 'light-content',
};

const ThemeContext = createContext({ 
  isDark: undefined, 
  setIsDark: () => {},
  colors: {},
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const systemIsDark = Appearance.getColorScheme() === 'dark';
  // Initialize with system theme to avoid a flash of the wrong theme
  const [isDark, setIsDark] = useState(systemIsDark);

  // Carregar preferência salva ao inicializar
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Se não há preferência salva, usar o tema do sistema
        setIsDark(systemIsDark);
      }
    } catch (error) {
      setIsDark(systemIsDark);
    }
  };

  // Salvar preferência quando mudar
  const saveThemePreference = async (darkMode) => {
    try {
      await AsyncStorage.setItem('themePreference', darkMode ? 'dark' : 'light');
    } catch (error) {
      // ignore save errors
    }
  };

  // Função para alternar tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveThemePreference(newTheme);
  };

  // Função para definir tema específico
  const setTheme = (darkMode) => {
    setIsDark(darkMode);
    saveThemePreference(darkMode);
  };

  // Obter cores baseadas no tema atual
  const colors = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const value = useMemo(
    () => ({ 
      isDark, 
      setIsDark: setTheme,
      toggleTheme,
      colors,
      systemIsDark 
    }),
    [isDark, colors, systemIsDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);


