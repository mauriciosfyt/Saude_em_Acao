import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Styles/TelaPlanosStyles";

const TelaPlanos = ({ navigation }) => {
  const onBack = () => navigation && navigation.goBack();

  const onSaibaMais = (plano) => {
    if (plano.id === "basico") {
      navigation.navigate("PlanoBasico"); // Navega para a tela PlanoBasico
    } 
    else if (plano.id === "essencial") {
      navigation.navigate("PlanoEssencial"); // Navega para a tela PlanoEssencial
    } 
    else if (plano.id === "gold") {
      navigation.navigate("PlanoGold"); // Navega para a tela PlanoGold
    }
  };

  const planos = [
    {
      id: "basico",
      titulo: "Plano Básico",
      descricao:
        "Nosso plano mais econômico e acessível para você se exercitar o quanto e quando quiser.",
      preco: "R$120,00",
      bannerText: null,
    },
    {
      id: "essencial",
      titulo: "Plano Essencial",
      descricao:
        "O plano de academia ideal, que oferece resultados completo por um preço acessível. Nele inclui acesso a todas as modalidades e acompanhamento profissional de um professor para montar seus treino presonalizados.",
      preco: "R$159,90",
      bannerText: "O mais vantajoso",
      bannerIcon: require("../../../assets/icons/vantajoso.png"),
    },
    {
      id: "gold",
      titulo: "Plano Gold",
      descricao:
        "O plano de academia ideal, que oferecer resultados completo por um preço acessível. Nele inclui acesso a todas as modalidades e acompanhamento profissional de um professor para montar seus treino presonalizados.",
      preco: "R$300,00",
      bannerText: "O mais completo",
      bannerIcon: require("../../../assets/icons/completo.png"),
    },
  ];

  const renderPlano = (plano) => {
    return (
      <View
        key={plano.id}
        style={[
          styles.planCard,
          plano.id === "basico" ? { marginTop: -110 } : null,
          { backgroundColor: plano.id === "gold" ? "#656565" : "#ffffff" },
        ]}
      >
        {/* Triângulo pequeno no canto superior direito do card do Plano Básico */}
        {plano.id === "basico" && <View style={styles.triangleSmall} />}
        {plano.bannerText && (
          <View style={styles.banner}>
            {plano.bannerIcon && (
              <Image
                source={plano.bannerIcon}
                style={styles.bannerIcon}
                resizeMode="contain"
              />
            )}
            <Text style={styles.bannerText}>{plano.bannerText}</Text>
          </View>
        )}
        <Text
          style={[
            styles.planTitle,
            { color: plano.id === "gold" ? "#fbbf24" : "#111827" },
          ]}
        >
          {plano.titulo}
        </Text>
        <Text
          style={[
            styles.planDescription,
            { color: plano.id === "gold" ? "#d1d5db" : "#6b7280" },
          ]}
        >
          {plano.descricao}
        </Text>
        <Text
          style={[
            styles.planPrice,
            { color: plano.id === "gold" ? "#ffffff" : "#111827" },
          ]}
        >
          Por apenas
        </Text>
        <Text
          style={[
            styles.planPrice,
            {
              color: plano.id === "gold" ? "#ffffff" : "#111827",
              marginTop: -8,
            },
          ]}
        >
          {plano.preco}
        </Text>
        <TouchableOpacity
          style={styles.saibaMaisButton}
          onPress={() => onSaibaMais(plano)}
        >
          <Text style={styles.saibaMaisText}>Saiba mais</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../../assets/banner_logos.jpg")}
        style={styles.backgroundImage}
      >
        {/* Faixa branca diagonal */}
        <View style={styles.diagonalWhite} />
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Planos</Text>
        </View>
        {/* Cards de planos */}
        <ScrollView
          style={[styles.scrollView, { marginTop: 80 }]}
          contentContainerStyle={[styles.content, { paddingTop: 160 }]}
          showsVerticalScrollIndicator={false}
        >
          {planos.map(renderPlano)}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default TelaPlanos;
