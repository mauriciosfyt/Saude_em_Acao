// src/Routes/Routes.js (Adaptado para Autenticação)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/constants';

// 1. IMPORTE O USEAUTH E A TELA DE LOADING
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho se necessário
import LoadingScreen from '../Pages/Loading/LoadingScreen'; // A tela que criámos

// --- Telas de Autenticação ---
import Inicial from '../Pages/Inicial/Inicial';
import TelaLogin from '../Pages/Login/TelaLogin'; //

// --- Telas Principais (App) ---
import Home from '../Pages/Home/Home'; //
import Dados from '../Pages/Dados/Dados';
import Desempenho from '../Pages/Desempenho/Desempenho';
import MeuPlano from '../Pages/MeuPlano/MeuPlano';
import Perfil from '../Pages/Perfil/Perfil';
import Plano from '../Pages/Plano/Plano';
import Chat from '../Pages/Chat/Chat';
import LojaProdutos from '../Pages/Loja/LojaProdutos/loja_produtos';
import LojaFavoritos from '../Pages/Loja/Loja_Favoritos/loja_favoritos';
import Reservas from '../Pages/Loja/Loja_Reservas/loja_reservas';
import Loja from '../Pages/Loja/loja_home/loja';
import MeuTreino from '../Pages/MeuTreino/MeuTreino';
import TreinoSegunda from '../Pages/TreinoSegunda/TreinoSegunda';
import TreinoTerca from '../Pages/TreinoTerca/TreinoTerca';
import TreinoQuarta from '../Pages/TreinoQuarta/TreinoQuarta';
import TreinoQuinta from '../Pages/TreinoQuinta/TreinoQuinta';
import TreinoSexta from '../Pages/TreinoSexta/TreinoSexta';
import Professores from '../Pages/Professores/Professores';
import TelaPlanos from '../Pages/TelaPlanos/TelaPlanos';
import PlanoEssencial from "../Components/PlanoEssencial";
import PlanoGold from "../Components/PlanoGold";
import PlanoBasico from "../Components/PlanoBasico";
import Mensalidades from '../Pages/Mensalidades/Mensalidades';

import LojaVitaminas from "../Pages/Loja/Loja_Categoria/LojaVitaminas";
import LojaWhey from "../Pages/Loja/Loja_Categoria/LojaWhey.js";
import LojaRoupas from "../Pages/Loja/Loja_Categoria/LojaRoupas.js";
import LojaCreatina from "../Pages/Loja/Loja_Categoria/LojaCreatina.js";
import LojaCarrinho from "../Pages/Loja/Loja_Carrinho/LojaCarrinho.js";

const Stack = createNativeStackNavigator();

// 3. DOIS GRUPOS DE TELAS (STACKS) SEPARADOS

// Stack para quem NÃO está logado
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicial" component={Inicial} />
      <Stack.Screen name="TelaLogin" component={TelaLogin} />
    </Stack.Navigator>
  );
}

// Stack para quem ESTÁ logado
// (Usa StackNavigator puro, sem abas)
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Plano" component={Plano} />
      <Stack.Screen name="LojaProdutos" component={LojaProdutos} />
      <Stack.Screen name="LojaFavoritos" component={LojaFavoritos} />
      <Stack.Screen name="LojaReservas" component={Reservas} />
      <Stack.Screen name="MeuTreino" component={MeuTreino} />
      <Stack.Screen name="TreinoSegunda" component={TreinoSegunda} />
      <Stack.Screen name="TreinoTerca" component={TreinoTerca} />
      <Stack.Screen name="TreinoQuarta" component={TreinoQuarta} />
      <Stack.Screen name="TreinoQuinta" component={TreinoQuinta} />
      <Stack.Screen name="TreinoSexta" component={TreinoSexta} />
      <Stack.Screen name="Professores" component={Professores} />
      <Stack.Screen name="TelaPlanos" component={TelaPlanos} />
      <Stack.Screen name="PlanoBasico" component={PlanoBasico} />
      <Stack.Screen name="PlanoEssencial" component={PlanoEssencial} />
      <Stack.Screen name="PlanoGold" component={PlanoGold} />
      <Stack.Screen name="Mensalidades" component={Mensalidades} />
      <Stack.Screen name="MeuPlano" component={MeuPlano} />
      <Stack.Screen name="Dados" component={Dados} />
      <Stack.Screen name="Desempenho" component={Desempenho} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Loja" component={Loja} />
      <Stack.Screen name="LojaVitaminas" component={LojaVitaminas} />
      <Stack.Screen name="LojaWhey" component={LojaWhey} />
      <Stack.Screen name="LojaRoupas" component={LojaRoupas} />
      <Stack.Screen name="LojaCreatina" component={LojaCreatina} />
      <Stack.Screen name="LojaCarrinho" component={LojaCarrinho} />
    </Stack.Navigator>
  );
}

// 4. O SEU COMPONENTE DE ROTAS (O "PORTEIRO")
export default function Routes() {
  // 5. OUVIR O ESTADO DE AUTENTICAÇÃO
  const { isAuthenticated, loading } = useAuth();

  // 6. MOSTRAR LOADING ENQUANTO VERIFICA O TOKEN
  if (loading) {
    return <LoadingScreen />;
  }

  // 7. DECIDIR QUAL STACK MOSTRAR
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}