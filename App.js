
import React from 'react';
import Routes from './src/Routes/Routes';
import { FavoritosProvider } from './src/context/FavoritosContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <FavoritosProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </FavoritosProvider>
  );
}
