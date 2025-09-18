import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../Styles/PlanoBasicoStyles";
import screenStyles from "../Styles/TelaPlanosStyles";
import Header from "./header_planos/Header";

export default function PlanoBasico({ navigation, onContratar }) {
  const handleContratar = () => {
    if (onContratar) onContratar();
  };

  const onBack = () => navigation && navigation.goBack && navigation.goBack();

  return (
    <SafeAreaView style={screenStyles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../assets/banner_logos.jpg")}
        style={screenStyles.backgroundImage}
        fadeDuration={0}
        defaultSource={require("../../assets/banner_logos.jpg")}
      >
        <Header title="Planos" onBack={onBack} />
        <View style={screenStyles.diagonalWhite} />
        <ScrollView
          style={[screenStyles.scrollView, { marginTop: 130 }]}
          contentContainerStyle={[screenStyles.content, { paddingTop: 80 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.banner}>
              <Image
                source={require("../../assets/icons/vantajoso.png")}
                style={{
                  width: 20,
                  height: 23,
                  marginRight: 6,
                  resizeMode: "contain",
                }}
              />
              <Text style={styles.bannerText}>O mais vantajoso</Text>
            </View>

            <Text style={styles.title}>Plano Básico</Text>
            <Text style={styles.description}>
              O plano de academia ideal, que oferece resultados completo por um
              preço acessível. Nele inclui acesso a todas as modalidades e
              acompanhamento profissional de um professor para montar seus
              treino presonalizados.
            </Text>

            <Text style={styles.priceLabel}>Por apenas</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>R$120,00</Text>
              <Text style={styles.pricePerMonth}>/mês</Text>
            </View>

            <Text style={styles.sectionTitle}>Benefícios desse plano</Text>
            <Text style={styles.modalidadeHint}>Escolha uma modalidade:</Text>

            {["Funcional", "Thay Fit", "Pilates"].map((item) => (
              <View key={item} style={styles.benefitRow}>
                <Image
                  source={require("../../assets/beneficios.png")}
                  style={{ width: 26, height: 26 }}
                />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleContratar}
            >
              <Text style={styles.ctaText}>Contratar plano</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
