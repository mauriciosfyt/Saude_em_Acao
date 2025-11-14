import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground, ScrollView, Image, useColorScheme } from 'react-native';

import cardStyles from '../Styles/PlanoGoldStyles';
import screenStyles from '../Styles/TelaPlanosStyles';
import Header from "./header_planos/Header";
import { useTheme } from "../context/ThemeContext";

export default function PlanoGold({ navigation, onContratar }) {
  const colorScheme = useColorScheme();
  const { isDark, colors } = useTheme();
  const handleContratar = () => { if (onContratar) onContratar(); };
  const onBack = () => navigation && navigation.goBack && navigation.goBack();

  return (
    <SafeAreaView style={[screenStyles.container, isDark && { backgroundColor: '#000000' }]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/banner_logos.jpg')}
        style={screenStyles.backgroundImage}
        fadeDuration={0}
        defaultSource={require('../../assets/banner_logos.jpg')}
      >
        <Header title="Planos" onBack={onBack} />
        <View style={[screenStyles.diagonalWhite, isDark && { borderBottomColor: '#3A3A3A', opacity: 1 }]} />
        <ScrollView
          style={[screenStyles.scrollView, { marginTop: 130 }]}
          contentContainerStyle={[screenStyles.content, { paddingTop: 80 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[cardStyles.card, isDark && { backgroundColor: '#3A3A3A', borderColor: '#405CBA' }]}>
              <View style={cardStyles.banner}> 
              <Image source={require('../../assets/icons/completo.png')} style={{ width: 16, height: 16, marginRight: 6 }} />
              <Text style={cardStyles.bannerText}>O mais completo</Text>
              
              </View>

        
          <View style={cardStyles.titleRowContainer}>
            <Text style={[cardStyles.titleRow, { color: '#ffffff' }]}>Plano </Text>
            <Text style={[cardStyles.titleRow, { color: '#fbbf24' }]}>Gold</Text>
          </View>

            <Text style={[cardStyles.description, isDark && { color: '#D1D5DB' }]}>
             O plano de academia ideal, que oferecer resultados completo por  um preço acessível. Nele inclui acesso a todas as modalidades e acompanhamento profissional de um professor para montar seus treino presonalizados.
            </Text>

            <Text style={[cardStyles.priceLabel, isDark && { color: '#C7C7C7' }]}>A partir de</Text>
            <View style={cardStyles.priceRow}>
              <Text style={[cardStyles.priceValue, isDark && { color: '#FFFFFF' }]}>R$300,00</Text>
              <Text style={cardStyles.pricePerMonth}>/mês</Text>
            </View>

            <Text style={[cardStyles.sectionTitle, isDark && { color: '#9CA3AF' }]}>Benefícios desse plano</Text>
            <Text style={[cardStyles.modalidadeHint, isDark && { color: '#E5E7EB' }]}>Todas as modalidades:</Text>

            {[ 'Funcional', 'Thay Fit', 'Pilates', 'Treino personalizado' ].map((item) => (
              <View key={item} style={cardStyles.benefitRow}>
                <Image source={require('../../assets/beneficios.png')} style={{ width: 24, height: 24 }} />
                <Text style={[cardStyles.benefitText, isDark && { color: '#FFFFFF' }]}>{item}</Text>
              </View>
            ))}

            <TouchableOpacity style={cardStyles.ctaButton} onPress={handleContratar}>
              <Text style={cardStyles.ctaText}>Contratar plano</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}


