import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../Styles/PlanoGoldStyles';
import screenStyles from '../Styles/TelaPlanosStyles';

export default function PlanoGold({ navigation, onContratar }) {
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
        <View style={screenStyles.diagonalWhite} />

        <View style={screenStyles.header}>
          {navigation && (
            <TouchableOpacity onPress={onBack} style={screenStyles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          <Text style={screenStyles.headerTitle}>Planos</Text>
        </View>

        <ScrollView contentContainerStyle={[screenStyles.content, { paddingTop: 160 }]} showsVerticalScrollIndicator={false}>
          <View style={cardStyles.card}>
            <View style={cardStyles.banner}>
              <Ionicons name="ribbon" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={cardStyles.bannerText}>O mais completo</Text>
            </View>

            <Text style={cardStyles.titleRow}>Plano Gold</Text>
            <Text style={cardStyles.description}>
              O plano completo com todos os benefícios e suporte premium para seus objetivos.
            </Text>

            <Text style={cardStyles.priceLabel}>Por apenas</Text>
            <View style={cardStyles.priceRow}>
              <Text style={cardStyles.priceValue}>R$300,00</Text>
              <Text style={cardStyles.pricePerMonth}>/mês</Text>
            </View>

            <Text style={cardStyles.sectionTitle}>Benefícios desse plano</Text>
            <Text style={cardStyles.modalidadeHint}>Todas as modalidades:</Text>

            {[ 'Funcional', 'Thay Fit', 'Pilates' ].map((item) => (
              <View key={item} style={cardStyles.benefitRow}>
                <Image source={require('../../assets/beneficios.png')} style={{ width: 24, height: 24 }} />
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


