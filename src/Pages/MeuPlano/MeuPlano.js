import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../Styles/MeuPlanoStyles';


const MeuPlano = ({ navigation }) => {
  const plano = {
    tipo: 'ESSENCIAL',
    duracao: '2 meses',
    vencimento: '25/10/2025',
    valor: 'R$159,90',
  };

  const onBack = () => navigation && navigation.goBack();
  const onMudarPlano = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Meu plano</Text>
      </View>

      {/* Conteúdo branco */}
      <View style={styles.whiteSection}>
        <View style={styles.rowBetween}> 
          <View>
            <Text style={styles.smallLabel}>Tipo do plano:</Text>
            <Text style={styles.planType}>{plano.tipo}</Text>
          </View>
        </View>

        <View style={[styles.rowBetween, styles.mt16]}> 
          <View>
            <Text style={styles.smallLabel}>Duração:</Text>
            <Text style={styles.valueStrong}>{plano.duracao}</Text>
          </View>
          <View>
            <Text style={styles.smallLabel}>Vencimento:</Text>
            <Text style={styles.valueStrong}>{plano.vencimento}</Text>
          </View>
        </View>

        <View style={styles.mt16}>
          <Text style={styles.smallLabel}>Valor do plano:</Text>
          <Text style={styles.valueStrong}>{plano.valor}</Text>
        </View>
      </View>

      {/* Triângulo separador */}
      <View style={styles.triangleSeparator} />

      {/* Seção azul */}
      <View style={styles.blueSection}>
        <Text style={styles.renewTitle}>RENOVAÇÃO DO{ '\n' }PLANO</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onMudarPlano}>
          <Text style={styles.primaryButtonText}>Mudar de plano</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MeuPlano;