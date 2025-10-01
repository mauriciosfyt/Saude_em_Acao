// navigation/Routes.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/constants";

// 1. Importe a nova tela Inicial
import Inicial from "../Pages/Inicial/Inicial";

import Home from "../Pages/Home/Home";
import Dados from "../Pages/Dados/Dados";
import Desempenho from "../Pages/Desempenho/Desempenho";
import MeuPlano from "../Pages/MeuPlano/MeuPlano";
import Perfil from "../Pages/Perfil/Perfil";
import Plano from "../Pages/Plano/Plano";
import TelaLogin from "../Pages/Login/TelaLogin";
import Chat from "../Pages/Chat/Chat";
import Mensalidades from "../Pages/Mensalidade/Mensalidade";
import LojaProdutos from "../Pages/Loja/LojaProdutos/loja_produtos";
import LojaFavoritos from "../Pages/Loja/Loja_Favoritos/loja_favoritos";
import Reservas from "../Pages/Loja/Loja_Reservas/loja_reservas";
import Loja from "../Pages/Loja/loja_home/loja";
import MeuTreino from "../Pages/MeuTreino/MeuTreino";
import TreinoSegunda from "../Pages/TreinoSegunda/TreinoSegunda";
import TreinoTerca from "../Pages/TreinoTerca/TreinoTerca";
import TreinoQuarta from "../Pages/TreinoQuarta/TreinoQuarta";
import TreinoQuinta from "../Pages/TreinoQuinta/TreinoQuinta";
import TreinoSexta from "../Pages/TreinoSexta/TreinoSexta";
import Professores from "../Pages/Professores/Professores";
import TelaPlanos from "../Pages/TelaPlanos/TelaPlanos";
import PlanoEssencial from "../Components/PlanoEssencial";
import PlanoGold from "../Components/PlanoGold";
import PlanoBasico from "../Components/PlanoBasico";

import LojaVitaminas from "../Pages/Loja/Loja_Categoria/LojaVitaminas";
import LojaWhey from "../Pages/Loja/Loja_Categoria/LojaWhey.js";
import LojaRoupas from "../Pages/Loja/Loja_Categoria/LojaRoupas.js";
import LojaCreatina from "../Pages/Loja/Loja_Categoria/LojaCreatina.js";

const Stack = createNativeStackNavigator();


// Navegador Principal (Stack)
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 2. Defina 'Inicial' como a PRIMEIRA tela do Stack */}
            <Stack.Screen name="Inicial" component={Inicial} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Desempenho" component={Desempenho} />
        <Stack.Screen name="Loja" component={Loja} />
        <Stack.Screen name="Plano" component={Plano} />
        <Stack.Screen name="Perfil" component={Perfil} />
        
        <Stack.Screen name="TelaLogin" component={TelaLogin} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Mensalidades" component={Mensalidades} />
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


        {/* Outras telas continuam aqui */}
        <Stack.Screen name="MeuPlano" component={MeuPlano} />
          <Stack.Screen name="LojaVitaminas" component={LojaVitaminas} />
  <Stack.Screen name="LojaWhey" component={LojaWhey} />
  <Stack.Screen name="LojaRoupas" component={LojaRoupas} />
  <Stack.Screen name="LojaCreatina" component={LojaCreatina} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
