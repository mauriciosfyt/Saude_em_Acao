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
              <Image source={require('../../assets/icons/completo.png')} style={{ width: 16, height: 16, marginRight: 6 }} />
              <Text style={cardStyles.bannerText}>O mais completo</Text>
              
              </View>

        
          <View style={cardStyles.titleRowContainer}>
            <Text style={[cardStyles.titleRow, { color: '#ffffff' }]}>Plano </Text>
            <Text style={[cardStyles.titleRow, { color: '#fbbf24' }]}>Gold</Text>
          </View>

            <Text style={cardStyles.description}>
             O plano de academia ideal, que oferecer resultados completo por  um preço acessível. Nele inclui acesso a todas as modalidades e acompanhamento profissional de um professor para montar seus treino presonalizados.
            </Text>

            <Text style={cardStyles.priceLabel}>Por apenas</Text>
            <View style={cardStyles.priceRow}>
              <Text style={cardStyles.priceValue}>R$300,00</Text>
              <Text style={cardStyles.pricePerMonth}>/mês</Text>
            </View>

            <Text style={cardStyles.sectionTitle}>Benefícios desse plano</Text>
            <Text style={cardStyles.modalidadeHint}>Todas as modalidades:</Text>

            {[ 'Funcional', 'Thay Fit', 'Pilates', 'Treino personalizado' ].map((item) => (
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


