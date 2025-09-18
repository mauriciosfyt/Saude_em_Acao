import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground, ScrollView, Image } from 'react-native';

import cardStyles from '../Styles/PlanoEssencialStyles';
import screenStyles from '../Styles/TelaPlanosStyles';
import Header from "./header_planos/Header";


export default function PlanoEssencial({ navigation, onContratar }) {
  const handleContratar = () => { if (onContratar) onContratar(); };
  const onBack = () => navigation && navigation.goBack && navigation.goBack();

  return (
    <SafeAreaView style={screenStyles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/banner_logos.jpg')}
        style={screenStyles.backgroundImage}
        fadeDuration={0}
        defaultSource={require('../../assets/banner_logos.jpg')}
      >
        <Header title="Planos" onBack={onBack} />
        <View style={screenStyles.diagonalWhite} />
        <ScrollView
          style={[screenStyles.scrollView, { marginTop: 130 }]}
          contentContainerStyle={[screenStyles.content, { paddingTop: 80 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={cardStyles.card}>
            <View style={[cardStyles.banner, { backgroundColor: '#405CBA' }]}>
              <Image source={require('../../assets/icons/vantajoso.png')} style={{ width: 20, height: 23, marginRight: 6, resizeMode: 'contain' }} />
              <Text style={cardStyles.bannerText}>O mais vantajoso</Text>
            </View>

            <Text style={cardStyles.title}>Plano Essencial</Text>
            <Text style={cardStyles.description}>
              O plano ideal com acesso a modalidades e acompanhamento profissional para seus treinos personalizados.
            </Text>

            <Text style={cardStyles.priceLabel}>Por apenas</Text>
            <View style={cardStyles.priceRow}>
              <Text style={cardStyles.priceValue}>R$159,90</Text>
              <Text style={cardStyles.pricePerMonth}>/mês</Text>
            </View>

            <Text style={cardStyles.sectionTitle}>Benefícios desse plano</Text>
            <Text style={cardStyles.modalidadeHint}>Todas as modalidades:</Text>

            {[ 'Funcional', 'Thay Fit', 'Pilates' ].map((item) => (
              <View key={item} style={cardStyles.benefitRow}>
                <Image source={require('../../assets/beneficios.png')} style={{ width: 26, height: 26 }} />
                <Text style={cardStyles.benefitText}>{item}</Text>
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


