import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
// import Carrinho from './pages/Carrinho';
// import Loja from './pages/Loja';
// import LojaProduto from './pages/LojaProduto';
// import Perfil from './pages/Perfil';
// import Professores from './pages/Professores';
// import SobreNos from './pages/SobreNos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />               {/* Página inicial */}
        {/* <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/loja-produto" element={<LojaProduto />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/sobre-nos" element={<SobreNos />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
