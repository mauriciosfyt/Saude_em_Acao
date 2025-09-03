import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlanoStyle as styles } from '../../Styles/PlanoStyle'; 

// Exemplo de como integrar o componente PerfilDesempenho
export default function ExemploIntegracao() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  if (mostrarPerfil) {
    return (
      <PerfilDesempenho 
        navigation={{
          goBack: () => setMostrarPerfil(false)
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu plano</Text>
      </View>

      {/* Seção Superior - Fundo Branco */}
      <View style={styles.topSection}>
        <View style={styles.planInfo}>
          <Text style={styles.planTypeLabel}>Tipo do plano:</Text>
          <Text style={styles.planTypeValue}>ESSENCIAL</Text>
          
          <View style={styles.planDetails}>
            <View style={styles.planDetail}>
              <Text style={styles.planDetailLabel}>Duração:</Text>
              <Text style={styles.planDetailValue}>2 meses</Text>
            </View>
            <View style={styles.planDetail}>
              <Text style={styles.planDetailLabel}>Vencimento:</Text>
              <Text style={styles.planDetailValue}>25/10/2025</Text>
            </View>
          </View>
          
          <Text style={styles.planValueLabel}>Valor do plano:</Text>
          <Text style={styles.planValue}>R$159,90</Text>
        </View>
      </View>

      {/* Seção Inferior - Fundo Azul com corte diagonal */}
      <View style={styles.bottomSection}>
        <View style={styles.diagonalCut} />
        <View style={styles.bottomContent}>
          <Text style={styles.renewalTitle}>RENOVAÇÃO{'\n'}DO PLANO</Text>
          <TouchableOpacity 
            style={styles.changePlanButton}
            onPress={() => setMostrarPerfil(true)}
          >
            <Text style={styles.changePlanButtonText}>Mudar de plano</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}