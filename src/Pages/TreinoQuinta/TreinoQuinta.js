import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderSeta from '../../Components/header_seta/header_seta';
import styles from '../../Styles/TreinoQuintaStyle';
import { playSuccessSound } from '../../Components/Sounds';
import { useTheme } from '../../context/ThemeContext';

const TreinoQuinta = ({ navigation, route }) => {
  const { isDark, colors } = useTheme();
  const theme = {
    contentBg: isDark ? '#2B2F36' : '#F5F5F5',
    cardBg: isDark ? '#3A3F47' : '#FFFFFF',
    cardBorder: isDark ? '#525862' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#C9CEDA' : '#666666',
    modalBg: isDark ? '#1A1F2E' : '#FFFFFF',
    modalTitle: isDark ? '#FFFFFF' : '#000000',
    modalText: isDark ? '#C9CEDA' : '#222222',
  };

  // Exercícios conforme imagem enviada
  const exercicios = {
    cardio: [
      {
        id: 1,
        nome: 'Esteira(Perna)',
        series: 4,
        repeticoes: '20 min',
        carga: 0,
        imagem: require('../../../assets/banner_roupas.jpg'),
        descricao: 'Caminhada ou corrida na esteira, mantendo ritmo constante.',
      },
      {
        id: 2,
        nome: 'Bicicleta',
        series: 4,
        repeticoes: '15 min',
        carga: 0,
        imagem: require('../../../assets/banner_camisas.png'),
        descricao: 'Pedale na bicicleta ergométrica, mantendo intensidade moderada.',
      },
    ],
    ombro: [
      {
        id: 3,
        nome: 'Desenvolvimento - Máquina Articulada(Ombro)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey.jpg'),
        descricao: 'Sente-se na máquina, segure as alças e empurre para cima até estender os braços.',
      },
      {
        id: 4,
        nome: 'Elevação Lateral(Ombro)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey.jpg'),
        descricao: 'Em pé, segure os halteres ao lado do corpo e eleve-os lateralmente até a altura dos ombros.',
      },
      {
        id: 5,
        nome: 'Elevação Fronta(ombro)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_creatina1.jpg'),
        descricao: 'Em pé, segure os halteres à frente das coxas e eleve-os à frente até a altura dos ombros.',
      },
      {
        id: 6,
        nome: 'Crucifixo Inverso(Costas)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_vitaminas.png'),
        descricao: 'Sentado, incline o tronco à frente e abra os braços lateralmente, contraindo as costas.',
      },
    ],
  };
  const totalExercicios = exercicios.cardio.length + exercicios.ombro.length;
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState({});
  const [modalExercicio, setModalExercicio] = useState({ visivel: false, exercicio: null });
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  // Funções de controle do menu
  const handleAbrirMenu = () => {
    setMenuVisivel(true);
  };

  const handleFecharMenu = () => {
    setMenuVisivel(false);
  };

  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  // Função para marcar/desmarcar exercício
  const toggleExercicio = (id) => {
    const novoEstado = { ...exerciciosSelecionados };
    if (novoEstado[id]) {
      delete novoEstado[id];
    } else {
      novoEstado[id] = true;
    }
    setExerciciosSelecionados(novoEstado);
    setExerciciosConcluidos(Object.keys(novoEstado).length);
  };

  // Função para selecionar/desmarcar todos os exercícios
  const handleSelecionarExercicios = () => {
    if (exerciciosConcluidos === totalExercicios) {
      // Se todos já estão selecionados, desmarcar todos
      setExerciciosSelecionados({});
      setExerciciosConcluidos(0);
    } else {
      // Selecionar todos os exercícios
      const todosExercicios = {};
      exercicios.cardio.forEach(exercicio => {
        todosExercicios[exercicio.id] = true;
      });
      exercicios.ombro.forEach(exercicio => {
        todosExercicios[exercicio.id] = true;
      });
      setExerciciosSelecionados(todosExercicios);
      setExerciciosConcluidos(totalExercicios);
    }
  };

  // Função para finalizar treino - agora permite finalizar com pelo menos 1 exercício
  const handleFinalizarTreino = () => {
    if (exerciciosConcluidos > 0) {
      setModalFinalizar(true);
    } else {
      setModalAviso(true);
    }
  };

  const handleFecharAviso = () => {
    setModalAviso(false);
  };

  const handleConfirmarFinalizar = () => {
    setModalFinalizar(false);
    playSuccessSound();
    
    // Verifica se todos os exercícios foram concluídos
    if (exerciciosConcluidos === totalExercicios) {
      // Marcar treino como concluído se a função estiver disponível
      if (route?.params?.onTreinoConcluido) {
        route.params.onTreinoConcluido('Quinta-Feira');
      }
    } else {
      // Marcar treino como incompleto se a função estiver disponível
      if (route?.params?.onTreinoIncompleto) {
        route.params.onTreinoIncompleto('Quinta-Feira');
      }
    }
    
    navigation.navigate('MeuTreino');
  };

  const handleCancelarFinalizar = () => {
    setModalFinalizar(false);
  };

  // Funções do modal de exercício
  const handleAbrirModalExercicio = (exercicio) => {
    setModalExercicio({ visivel: true, exercicio });
  };

  const handleFecharModalExercicio = () => {
    setModalExercicio({ visivel: false, exercicio: null });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="#405CBA" />

      {/* Header com seta de voltar e menu */}
      <HeaderSeta navigation={navigation} mesAno={null} />


      {/* Conteúdo Principal */}
      <ScrollView style={[styles.content, { backgroundColor: theme.contentBg }]} showsVerticalScrollIndicator={false}>
        {/* Seção Cardio */}
        <View style={styles.secaoContainer}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitle}>Cardio</Text>
          </View>
          {exercicios.cardio.map((exercicio) => (
            <View key={exercicio.id} style={[styles.exercicioCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1 }]}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => toggleExercicio(exercicio.id)}
              >
                <Ionicons 
                  name={exerciciosSelecionados[exercicio.id] ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={exerciciosSelecionados[exercicio.id] ? "#405CBA" : "#ccc"} 
                />
              </TouchableOpacity>
              {exercicio.imagem && (
                <Image source={exercicio.imagem} style={styles.exercicioImage} />
              )}
              <View style={styles.exercicioInfo}>
                <Text style={[styles.exercicioNome, { color: theme.textPrimary }]}>{exercicio.id} {exercicio.nome}</Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Série: {exercicio.series}</Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Repetição: {exercicio.repeticoes}</Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Carga: {exercicio.carga}(kg)</Text>
              </View>
              <TouchableOpacity style={styles.infoButton} onPress={() => handleAbrirModalExercicio(exercicio)}>
                <Ionicons name="information-circle" size={24} color="#405CBA" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Seção Ombro */}
        <View style={styles.secaoContainer}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitle}>Ombro</Text>
          </View>
          {exercicios.ombro.map((exercicio) => (
            <View key={exercicio.id} style={[styles.exercicioCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1 }]}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => toggleExercicio(exercicio.id)}
              >
                <Ionicons 
                  name={exerciciosSelecionados[exercicio.id] ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={exerciciosSelecionados[exercicio.id] ? "#405CBA" : "#ccc"} 
                />
              </TouchableOpacity>
              {exercicio.imagem && (
                <Image source={exercicio.imagem} style={styles.exercicioImage} />
              )}
              <View style={styles.exercicioInfo}>
                <Text style={[styles.exercicioNome, { color: theme.textPrimary }]}>{exercicio.id} {exercicio.nome}</Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Série: {exercicio.series}</Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Repetição: {exercicio.repeticoes}</Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Carga: {exercicio.carga}(kg)</Text>
              </View>
              <TouchableOpacity style={styles.infoButton} onPress={() => handleAbrirModalExercicio(exercicio)}>
                <Ionicons name="information-circle" size={24} color="#405CBA" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
              

      {/* Barra de Progresso fora do header, antes do footer */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{exerciciosConcluidos} de {totalExercicios} Treinos concluídos</Text>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${(exerciciosConcluidos / totalExercicios) * 100}%` }]} 
          />
        </View>
      </View>

      {/* Footer com Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.comecarButton} onPress={handleSelecionarExercicios}>
          <Text style={styles.comecarButtonText}>Selecionar tudo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.finalizarButton,
            exerciciosConcluidos === totalExercicios && { backgroundColor: '#4CAF50' } // Verde se todos selecionados
          ]}
          onPress={handleFinalizarTreino}
        >
          <Text style={[
            styles.finalizarButtonText,
            exerciciosConcluidos === totalExercicios && { color: 'white' } // Texto branco no botão verde
          ]}>
            Finalizar
          </Text>
          <Ionicons name="checkmark-circle" size={20} color={exerciciosConcluidos === totalExercicios ? "white" : "#666"} />
        </TouchableOpacity>
      </View>

      {/* Modal do Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("MainTabs")}
            >
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Desempenho</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("MeuTreino")}
            >
              <Ionicons name="fitness-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Meus Treinos</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Sobre o Exercício */}
      <Modal
       visible={modalExercicio.visivel}
        transparent={true}
        animationType="fade"
        onRequestClose={handleFecharModalExercicio}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.modalBg, borderRadius: 16, padding: 24, width: 300, alignItems: 'flex-start' }}>
            <Text style={{ color: theme.modalText, fontSize: 12, marginBottom: 8 }}>Sobre o Exercício</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#405CBA', marginRight: 8 }} />
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.modalTitle }}>
                {modalExercicio.exercicio?.nome}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: theme.modalText, marginBottom: 16 }}>
              {modalExercicio.exercicio?.descricao || 'Descrição do exercício.'}
            </Text>
            <TouchableOpacity onPress={handleFecharModalExercicio} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <Text style={{ color: '#405CBA', fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Finalizar Treino - Breve e Direto */}
      <Modal
        visible={modalFinalizar}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelarFinalizar}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.modalBg, borderRadius: 16, padding: 20, alignItems: 'center', width: 280 }}>
            <MaterialIcons name="check-circle" size={40} color="#405CBA" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: theme.modalTitle }}>
              Finalizar treino?
            </Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ backgroundColor: isDark ? '#2B2F36' : '#F0F0F0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, flex: 0.45 }}
                onPress={handleCancelarFinalizar}
              >
                <Text style={{ color: '#405CBA', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#405CBA', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, flex: 0.45 }}
                onPress={handleConfirmarFinalizar}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Aviso de Exercícios não selecionados */}
      <Modal
        visible={modalAviso}
        animationType="fade"
        transparent={true}
        onRequestClose={handleFecharAviso}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.modalBg, borderRadius: 16, padding: 24, alignItems: 'center', width: 300 }}>
            <MaterialIcons name="error-outline" size={48} color="#F5A623" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: theme.modalTitle }}>
              Você ainda não completou todos os exercícios.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24, color: theme.modalText }}>
              Complete todos os exercícios antes de finalizar o treino.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#405CBA', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, width: '100%' }}
              onPress={handleFecharAviso}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TreinoQuinta;