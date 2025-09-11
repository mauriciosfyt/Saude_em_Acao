import React, { createContext, useContext, useState } from 'react';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const adicionarFavorito = (produto) => {
    setFavoritos((prev) => {
      if (prev.find((p) => p.id === produto.id)) return prev;
      return [...prev, produto];
    });
  };

  const removerFavorito = (produtoId) => {
    setFavoritos((prev) => prev.filter((p) => p.id !== produtoId));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, adicionarFavorito, removerFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
