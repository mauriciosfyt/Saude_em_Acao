import React, { useState, useEffect } from "react";
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
import styles from "../../Styles/MeuPlanoStyles";
import Header from "../../Components/header_planos/Header";
import { obterDesempenhoSemanal } from "../../Services/api";

const TelaPlanos = ({ navigation }) => {
  const [treinos, setTreinos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar treinos do desempenho semanal
  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        setCarregando(true);
        const dados = await obterDesempenhoSemanal();
        setTreinos(Array.isArray(dados) ? dados : dados.treinos || []);
        console.log('✅ Treinos carregados:', dados);
      } catch (error) {
        console.error('❌ Erro ao carregar treinos:', error);
        setTreinos([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarTreinos();
  }, []);
  const onBack = () => navigation && navigation.goBack();

  const onVisualizarTreino = (treino) => {
    console.log('Visualizando treino:', treino);
    // Aqui você pode navegar para uma tela de detalhes do treino se necessário
  };

  const renderTreino = (treino) => {
    return (
      <View key={treino.id} style={styles.planCard}>
        <Text style={styles.planTitle}>{treino.nome || 'Treino'}</Text>
        
        <Text style={styles.planDescription}>
          {treino.descricao || 'Sem descrição disponível'}
        </Text>

        <View style={{ marginVertical: 10 }}>
          {treino.tipo && (
            <Text style={styles.planDescription}>
              <Text style={{ fontWeight: 'bold' }}>Tipo:</Text>
              <Text>{' '}{treino.tipo}</Text>
            </Text>
          )}
          {treino.responsavel && (
            <Text style={styles.planDescription}>
              <Text style={{ fontWeight: 'bold' }}>Professor:</Text>
              <Text>{' '}{treino.responsavel}</Text>
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.saibaMaisButton}
          onPress={() => onVisualizarTreino(treino)}
        >
          <Text style={styles.saibaMaisText}>Visualizar</Text>
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
        <Header title="Meu Plano" onBack={onBack} />
        <View style={styles.diagonalWhite} />
        <ScrollView
          style={[styles.scrollView, { marginTop: 130 }]}
          contentContainerStyle={[styles.content, { paddingTop: 150 }]}
          showsVerticalScrollIndicator={false}
        >
          {carregando ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
                Carregando treinos...
              </Text>
            </View>
          ) : treinos.length > 0 ? (
            treinos.map(renderTreino)
          ) : (
            <View style={{ padding: 20 }}>
              <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
                Nenhum treino disponível no momento
              </Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default TelaPlanos;
