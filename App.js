
import React from 'react';
import Routes from './src/Routes/Routes';
import { FavoritosProvider } from './src/context/FavoritosContext';

export default function App() {
  return (
    <FavoritosProvider>
      <Routes />
    </FavoritosProvider>
  );
}
