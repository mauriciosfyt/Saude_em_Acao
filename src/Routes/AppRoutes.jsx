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
import PerfilPersonal from '../pages/PerfilPersonal/PerfilPersonal.jsx';

import ResultadosBusca from '../pages/Busca/index.jsx';

import GerenciarProduto from '../pages/Tela Adm/GerenciarProduto/index.jsx';

import CategoriaCreatina from '../pages/CategoriaCreatina/index.jsx';
import CategoriaCamisa from '../pages/CategoriaCamisa/index.jsx';
import CategoriaVitaminas from '../pages/CategoriaVitaminas/index.jsx';
import CategoriaWhey from '../pages/CategoriaWhey/index.jsx';
import Professores from '../pages/Professores/index.jsx';
import GerenciarReservas from '../pages/Tela Adm/Gerenciar_Reservas/index.jsx';


import AdicionarTreino from '../pages/Tela Adm/AdicionarTreino/index.jsx';
import AdicionarProduto from '../pages/Tela Adm/Adicionar_Produto/index.jsx';
import GerenciarPersonal from '../pages/Tela Adm/GerenciarPersonal/GerenciarPersonal.jsx';
import AdicionarPersonal from '../pages/Tela Adm/AdicionarProfessor/AdicionarPersonal.jsx';
import Dashboard from '../pages/Tela Adm/Dashboard/index.jsx';
import GerenciarAlunos from '../pages/Tela Adm/GerenciarAluno/GerenciarAlunos.jsx';
import Reservas from '../pages/Reservas/Reservas.jsx';
import AdicionarAluno from '../pages/Tela Adm/AdicionarAluno/AdicionarAluno.jsx';
import EditarAluno from '../pages/Tela Adm/EditarAluno/EditarAluno.jsx';
import EditarProduto from '../pages/Tela Adm/Editar_Produto/index.jsx';
import EditarPersonal from '../pages/Tela Adm/EditarPersonal/EditarPersonal.jsx';
import GerenciarTreino from '../pages/Tela Adm/GerenciarTreino/index.jsx';
import PersonalizarTreino from '../pages/Tela Adm/PersonalizarTreino/index.jsx';
import ReservasPendentes from '../pages/Tela Adm/Reservas_Pendentes/ReservasPendentes.jsx';
import ThayFit from '../pages/ThayFit/ThayFit.jsx';
import Pilates from '../pages/Pilates/Pilates.jsx';
import Funcional from '../pages/Funcional/Funcional.jsx';

import AdministrarAluno from '../pages/Tela_Personal/AdministrarAluno/AdministrarAluno.jsx';
import AdministrarTreino from '../pages/Tela_Personal/AdministrarTreino/AdministrarTreino.jsx';
import ImplementarTreino from '../pages/Tela_Personal/implementarTreino/implementarTreino.jsx';
import AdminRoute from '../components/AdminRoute.jsx';
import PersonalRoute from '../components/PersonalRoute.jsx';
import NaoAutorizado from '../pages/NaoAutorizado/index.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Loja" element={<Loja />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/PerfilAdm" element={<PerfilAdm />} />
        <Route path="/PerfilPersonal" element={
          <PersonalRoute>
            <PerfilPersonal />
          </PersonalRoute>
        } />
        <Route path="/SobreNos" element={<SobreNos />} />
        <Route path="/LojaProduto/:id" element={<LojaProduto />} />
        <Route path="/SobrenosLoja" element={<SobrenosLoja />} />
        <Route path="/Carrinho" element={<Carrinho />} />
        <Route path="/Planos" element={<Planos />} />
        <Route path="/Professores" element={<Professores />} />
        <Route path="/Reservas" element={<Reservas />} /> {/* Adicione esta linha */}
        <Route path="*" element={<Erro404 />} /> {/* Adicione esta linha */}
        <Route path="/ThayFit" element={<ThayFit/>} /> {/* Adicione esta linha */}
        <Route path="/Pilates" element={<Pilates/>} /> {/* Adicione esta linha */}
        <Route path="/Funcional" element={<Funcional/>} /> {/* Adicione esta linha */}
        <Route path="/Busca" element={<ResultadosBusca/>} /> {/* Adicione esta linha */}


        <Route path="/CategoriaCreatina" element={<CategoriaCreatina />} />
        <Route path="/CategoriaCamisa" element={<CategoriaCamisa />} />
        <Route path="/CategoriaWhey" element={<CategoriaWhey />} />
        <Route path="/CategoriaVitaminas" element={<CategoriaVitaminas />} />
       
        <Route path="/AdicionarTreino" element={<AdicionarTreino />} /> {/* Adicione esta linha */}
        <Route path="/ReservasPendentes" element={<ReservasPendentes />} /> {/* Adicione esta linha */}
        <Route path="/GerenciarReservas" element={<GerenciarReservas />} /> {/* Adicione esta linha */}
          <Route path="/AdicionarProduto" element={
            <AdminRoute>
              <AdicionarProduto />
            </AdminRoute>
          } />
          <Route path="/GerenciarProduto" element={
            <AdminRoute>
              <GerenciarProduto />
            </AdminRoute>
          } />
          <Route path="/GerenciarPersonal" element={
            <AdminRoute>
              <GerenciarPersonal />
            </AdminRoute>
          } />
          <Route path="/AdicionarPersonal" element={
            <AdminRoute>
              <AdicionarPersonal />
            </AdminRoute>
          } />
          <Route path="/Dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/GerenciarAlunos" element={
            <AdminRoute>
              <GerenciarAlunos />
            </AdminRoute>
          } />
          <Route path="/AdicionarAluno" element={
            <AdminRoute>
              <AdicionarAluno />
            </AdminRoute>
          } />
          <Route path="/EditarAluno/:id" element={
            <AdminRoute>
              <EditarAluno />
            </AdminRoute>
          } />
        <Route path="/EditarProduto" element={<EditarProduto />} />
        <Route path="/EditarPersonal/:id" element={<EditarPersonal />} /> {/* Nova rota */}
        <Route path="/GerenciarTreino" element={<GerenciarTreino />} /> {/* Nova rota */}
        <Route path="/PersonalizarTreino" element={<PersonalizarTreino />} />

         <Route path="/AdministrarAluno" element={
           <PersonalRoute>
             <AdministrarAluno />
           </PersonalRoute>
         } />
         <Route path="/AdministrarTreino" element={
           <PersonalRoute>
             <AdministrarTreino />
           </PersonalRoute>
         } />
         <Route path="/ImplementarTreino" element={
           <PersonalRoute>
             <ImplementarTreino />
           </PersonalRoute>
         } />

          <Route path="/nao-autorizado" element={<NaoAutorizado />} />
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
