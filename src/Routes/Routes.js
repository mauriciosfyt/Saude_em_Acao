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
import Professores from "../Pages/Professores/Professores";
import TelaPlanos from "../Pages/TelaPlanos/TelaPlanos";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  // ... (O código do TabNavigator continua exatamente o mesmo)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "Dados")
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          if (route.name === "Desempenho")
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          if (route.name === "Plano")
            iconName = focused ? "document-text" : "document-text-outline";
          if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";
          if (route.name === "Loja")
            iconName = focused ? "cart" : "cart-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.bluePrimary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: { height: 60, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Dados" component={Dados} />
      <Tab.Screen name="Desempenho" component={Desempenho} />
      <Tab.Screen name="Plano" component={Plano} />
      <Tab.Screen name="Loja" component={Loja} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

// Navegador Principal (Stack)
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 2. Defina 'Inicial' como a PRIMEIRA tela do Stack */}
        <Stack.Screen name="Inicial" component={Inicial} />
        <Stack.Screen name="TelaLogin" component={TelaLogin} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Mensalidades" component={Mensalidades} />
        <Stack.Screen name="LojaProdutos" component={LojaProdutos} />
        <Stack.Screen name="LojaFavoritos" component={LojaFavoritos} />
        <Stack.Screen name="LojaReservas" component={Reservas} />
        <Stack.Screen name="MeuTreino" component={MeuTreino} />
        <Stack.Screen name="TreinoSegunda" component={TreinoSegunda} />
        <Stack.Screen name="Professores" component={Professores} />
        <Stack.Screen name="TelaPlanos" component={TelaPlanos} />

        {/* O conjunto de abas agora é a segunda tela, chamada de 'MainTabs' */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Outras telas continuam aqui */}
        <Stack.Screen name="MeuPlano" component={MeuPlano} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
