import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Loja from '../pages/Loja';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop.jsx'; // importe aqui
import Perfil from '../pages/Perfil/index.jsx';
import PerfilAdm from '../pages/PerfilAdm/index.jsx';
import SobreNos from '../pages/SobreNos/index.jsx';
import LojaProduto from '../pages/LojaProduto/index.jsx';
import SobrenosLoja from '../pages/SobreNos_loja/index.jsx';
import Carrinho from '../pages/Carrinho/index.jsx';
import Planos from '../pages/Planos/index.jsx';
import Erro404 from '../pages/Erro404/erro_404.jsx';
import ReservasEfetuadas from '../pages/Tela Adm/Reservas_Efetuada/index.jsx';

import CategoriaCreatina from '../pages/CategoriaCreatina/index.jsx';
import CategoriaCamisa from '../pages/CategoriaCamisa/index.jsx';
import CategoriaVitaminas from '../pages/CategoriaVitaminas/index.jsx';
import CategoriaWhey from '../pages/CategoriaWhey/index.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop /> {/* adicione aqui */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Loja" element={<Loja />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/PerfilAdm" element={<PerfilAdm />} />
        <Route path="/SobreNos" element={<SobreNos />} />
        <Route path="/LojaProduto" element={<LojaProduto />} />
        <Route path="/SobrenosLoja" element={<SobrenosLoja />} />
        <Route path="/Carrinho" element={<Carrinho />} />
        <Route path="/Planos" element={<Planos />} />
        <Route path="*" element={<Erro404 />} /> {/* Adicione esta linha */}

        <Route path="/CategoriaCreatina" element={<CategoriaCreatina />} />
        <Route path="/CategoriaCamisa" element={<CategoriaCamisa />} />
        <Route path="/CategoriaWhey" element={<CategoriaWhey />} />
        <Route path="/CategoriaVitaminas" element={<CategoriaVitaminas />} />
        <Route path="/ReservasEfetuadas" element={<ReservasEfetuadas />} /> {/* Adicione esta linha */}
        
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
