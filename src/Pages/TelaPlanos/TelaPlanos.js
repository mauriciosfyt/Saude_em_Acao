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
import Header from "../../Components/header_planos/Header";

const TelaPlanos = ({ navigation }) => {
  const onBack = () => navigation && navigation.goBack();

  const onSaibaMais = (plano) => {
    if (plano.id === "basico") {
      navigation.navigate("PlanoBasico");
    } 
    else if (plano.id === "essencial") {
      navigation.navigate("PlanoEssencial");
    } 
    else if (plano.id === "gold") {
      navigation.navigate("PlanoGold");
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

        {/* Título */}
        {plano.id === "gold" ? (
          <Text style={styles.planTitle}>
            <Text style={{ color: "#ffffff" }}>Plano </Text>
            <Text style={{ color: "#fbbf24" }}>Gold</Text>
          </Text>
        ) : (
          <Text style={[styles.planTitle, { color: "#111827" }]}>
            {plano.titulo}
          </Text>
        )}

        {/* Descrição */}
        <Text
          style={[
            styles.planDescription,
            { color: plano.id === "gold" ? "#ffffff" : "#6b7280" },
          ]}
        >
          {plano.descricao}
        </Text>

        {/* Por apenas */}
        <Text
          style={[
            styles.porApenasText,
            { color: plano.id === "gold" ? "#fbbf24" : "#6b7280" },
          ]}
        >
          Por apenas
        </Text>

        {/* Preço */}
        <Text
          style={[
            styles.planPrice,
            { color: plano.id === "gold" ? "#ffffff" : "#000000", marginTop: -8 },
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
        <Header title="Planos" onBack={onBack} />
        <View style={styles.diagonalWhite} />
        <ScrollView
          style={[styles.scrollView, { marginTop: 130 }]}
          contentContainerStyle={[styles.content, { paddingTop: 150 }]}
          showsVerticalScrollIndicator={false}
        >
          {planos.map(renderPlano)}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default TelaPlanos;
