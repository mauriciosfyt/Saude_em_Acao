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
import styles from '../../Styles/TreinoSegundaStyle';
import { playSuccessSound } from '../../Components/Sounds';
import { useTheme } from '../../context/ThemeContext';
import { useTreinos } from '../../context/TreinosContext';
import BotaoSeta from '../../Components/BotaoSeta';

const TreinoSegunda = ({ navigation, route }) => {
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState({});
  const [modalExercicio, setModalExercicio] = useState({ visivel: false, exercicio: null });
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  const { isDark, colors } = useTheme();
  const { marcarTreinoComoConcluido, marcarTreinoComoIncompleto } = useTreinos();
  const theme = {
    BotaoSeta: colors.HeaderSeta,
    contentBg: colors.background,
    cardBg: colors.cardBackground,
    cardBorder: colors.border,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    modalBg: colors.cardBackground,
    modalTitle: colors.textPrimary,
    modalText: colors.textSecondary,
  };

  const exercicios = {
    peito: [
      {
        id: 1,
        nome: 'Supino Inclinado',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
        descricao:
          'Deite-se no banco inclinado, segure a barra ou halteres acima do peito e desça até próximo ao peitoral. Empurre de volta até a posição inicial mantendo o controle.',
      },
      {
        id: 2,
        nome: 'Crucifixo Reto',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_creatina1.jpg'),
        descricao:
          'Deite-se no banco reto, segure os halteres acima do peito e abra os braços até a linha do peito, retornando ao início com controle.',
      },
      {
        id: 3,
        nome: 'Voador Frontal',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_vitamina.jpg'),
        descricao:
          'Sente-se no aparelho voador, apoie os braços e una-os à frente do peito, retornando devagar à posição inicial.',
      },
    ],
    triceps: [
      {
        id: 4,
        nome: 'Polia Alta',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_roupas.jpg'),
        descricao:
          'Em pé, segure a barra da polia alta com as duas mãos e estenda os cotovelos até o final, retornando devagar.',
      },
      {
        id: 5,
        nome: 'Mergulho em Barras',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_camisas.png'),
        descricao:
          'Apoie-se nas barras paralelas, flexione os cotovelos descendo o corpo e empurre de volta até estender os braços.',
      },
      {
        id: 6,
        nome: 'Rosca Francesa',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_loja.png'),
        descricao:
          'Deitado, segure a barra com as mãos fechadas e flexione os cotovelos levando a barra até a testa, depois estenda novamente.',
      },
    ],
  };

  const totalExercicios = 6;

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

  const handleSelecionarExercicios = () => {
    if (exerciciosConcluidos === totalExercicios) {
      setExerciciosSelecionados({});
      setExerciciosConcluidos(0);
    } else {
      const todosExercicios = {};
      exercicios.peito.forEach((e) => (todosExercicios[e.id] = true));
      exercicios.triceps.forEach((e) => (todosExercicios[e.id] = true));
      setExerciciosSelecionados(todosExercicios);
      setExerciciosConcluidos(totalExercicios);
    }
  };

  const handleFinalizarTreino = () => {
    if (exerciciosConcluidos > 0) setModalFinalizar(true);
    else setModalAviso(true);
  };

  const handleFecharAviso = () => setModalAviso(false);
  const handleCancelarFinalizar = () => setModalFinalizar(false);

  const handleConfirmarFinalizar = () => {
    setModalFinalizar(false);
    playSuccessSound();

    if (exerciciosConcluidos === totalExercicios) {
      marcarTreinoComoConcluido && marcarTreinoComoConcluido('Segunda-Feira');
    } else {
      marcarTreinoComoIncompleto && marcarTreinoComoIncompleto('Segunda-Feira');
    }

    navigation.navigate('MeuTreino');
  };

  const handleAbrirModalExercicio = (exercicio) =>
    setModalExercicio({ visivel: true, exercicio });

  const handleFecharModalExercicio = () =>
    setModalExercicio({ visivel: false, exercicio: null });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.contentBg }]}>
  <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      {/* Header */}
      <HeaderSeta navigation={navigation} mesAno={null} isDark={isDark} />

      {/* Conteúdo principal */}
      <ScrollView
        style={[styles.content, { backgroundColor: theme.contentBg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Peito */}
        <View style={styles.secaoContainer}>
          {exercicios.peito.map((exercicio) => (
            <View
              key={exercicio.id}
              style={[
                styles.exercicioCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleExercicio(exercicio.id)}
              >
                <Ionicons
                  name={exerciciosSelecionados[exercicio.id] ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={exerciciosSelecionados[exercicio.id] ? colors.primary : colors.divider}
                />
              </TouchableOpacity>

              <Image source={exercicio.imagem} style={styles.exercicioImage} />

              <View style={styles.exercicioInfo}>
                <Text style={[styles.exercicioNome, { color: theme.textPrimary }]}>
                  {exercicio.nome}
                </Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>
                  Série: {exercicio.series}
                </Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>
                  Repetição: {exercicio.repeticoes}
                </Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>
                  Carga: {exercicio.carga}(kg)
                </Text>
              </View>

              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleAbrirModalExercicio(exercicio)}
              >
                <Ionicons name="information-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Tríceps */}
        <View style={styles.secaoContainer}>
          {exercicios.triceps.map((exercicio) => (
            <View
              key={exercicio.id}
              style={[
                styles.exercicioCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleExercicio(exercicio.id)}
              >
                <Ionicons
                  name={exerciciosSelecionados[exercicio.id] ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={exerciciosSelecionados[exercicio.id] ? colors.primary : colors.divider}
                />
              </TouchableOpacity>

              <Image source={exercicio.imagem} style={styles.exercicioImage} />

              <View style={styles.exercicioInfo}>
                <Text style={[styles.exercicioNome, { color: theme.textPrimary }]}>
                  {exercicio.nome}
                </Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>
                  Série: {exercicio.series}
                </Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>
                  Repetição: {exercicio.repeticoes}
                </Text>
                <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>
                  Carga: {exercicio.carga}(kg)
                </Text>
              </View>

              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleAbrirModalExercicio(exercicio)}
              >
                <Ionicons name="information-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.textPrimary }]}>
            {exerciciosConcluidos} de {totalExercicios} Treinos concluídos
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(exerciciosConcluidos / totalExercicios) * 100}%` },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botões */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 0, backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF', marginBottom: 20 }}>
        <TouchableOpacity style={styles.comecarButton} onPress={handleSelecionarExercicios}>
          <Text style={styles.comecarButtonText}>Selecionar tudo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.finalizarButton,
            exerciciosConcluidos === totalExercicios && { backgroundColor: '#4CAF50' },
          ]}
          onPress={handleFinalizarTreino}
        >
          <Text
            style={[
              styles.finalizarButtonText,
              exerciciosConcluidos === totalExercicios && { color: 'white' },
            ]}
          >
            Finalizar
          </Text>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={exerciciosConcluidos === totalExercicios ? 'white' : '#666'}
          />
        </TouchableOpacity>
      </View>

      {/* Modal Exercício */}
      <Modal visible={modalExercicio.visivel} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: theme.modalBg,
              borderRadius: 20,
              padding: 24,
              width: '85%',
            }}
          >
            <Text style={{ color: theme.modalText, fontSize: 12, marginBottom: 8 }}>
              Sobre o Exercício
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: colors.primary,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.modalTitle }}>
                {modalExercicio.exercicio?.nome}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: theme.modalText, marginBottom: 16 }}>
              {modalExercicio.exercicio?.descricao || 'Descrição do exercício.'}
            </Text>
            <TouchableOpacity onPress={handleFecharModalExercicio} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Finalizar */}
      <Modal visible={modalFinalizar} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: theme.modalBg,
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              width: 280,
            }}
          >
            <MaterialIcons name="check-circle" size={40} color={colors.primary} style={{ marginBottom: 12 }} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
                color: theme.modalTitle,
              }}
            >
              Finalizar treino?
            </Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? '#2B2F36' : '#F0F0F0',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flex: 0.45,
                }}
                onPress={handleCancelarFinalizar}
              >
                <Text
                  style={{ color: colors.primary, fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flex: 0.45,
                }}
                onPress={handleConfirmarFinalizar}
              >
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}
                >
                  Finalizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Aviso */}
      <Modal visible={modalAviso} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: theme.modalBg,
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              width: 300,
            }}
          >
            <MaterialIcons name="error-outline" size={48} color="#F5A623" style={{ marginBottom: 12 }} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 8,
                color: theme.modalTitle,
              }}
            >
              Você ainda não completou todos os exercícios.
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 24,
                color: theme.modalText,
              }}
            >
              Complete pelo menos um exercício antes de finalizar o treino.
            </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 32,
                    width: '100%',
                  }}
                  onPress={handleFecharAviso}
                >
                  <Text
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TreinoSegunda;
