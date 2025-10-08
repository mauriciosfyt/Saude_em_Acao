import React from 'react';
import Routes from './src/Routes/Routes';
import { FavoritosProvider } from './src/context/FavoritosContext';
import { TreinosProvider } from './src/context/TreinosContext';
import { ThemeProvider } from './src/context/ThemeContext';


export default function App() {
  return (
    <FavoritosProvider>
      <TreinosProvider>
        <Routes />
      </TreinosProvider>
    </FavoritosProvider>
  );
}
