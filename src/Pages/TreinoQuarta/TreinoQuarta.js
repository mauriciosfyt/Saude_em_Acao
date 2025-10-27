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
import styles from '../../Styles/TreinoQuartaStyle';
import { playSuccessSound } from '../../Components/Sounds';
import { useTheme } from '../../context/ThemeContext';

const TreinoQuarta = ({ navigation, route }) => {
  const { isDark } = useTheme();

  const theme = {
    contentBg: isDark ? '#2C2C2C' : '#F5F5F5',
    cardBg: isDark ? '#3a3a3a' : '#FFFFFF',
    cardBorder: isDark ? '#ffffff' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#C9CEDA' : '#666666',
    modalBg: isDark ? '#2c2c2c' : '#ffffffff',
    modalTitle: isDark ? '#FFFFFF' : '#000000',
    modalText: isDark ? '#C9CEDA' : '#222222',
    footerBg: isDark ? '#2C2C2C' : '#FFFFFF',
  };

  const exercicios = {
    perna: [
      {
        id: 1,
        nome: 'Agachamento (Perna)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey.jpg'),
        descricao:
          'Fique em pé com os pés afastados na largura dos ombros, segure a barra sobre os ombros e agache flexionando os joelhos até formar um ângulo de 90°. Retorne à posição inicial.',
      },
      {
        id: 2,
        nome: 'Leg Press 45°(Perna)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_camisas.png'),
        descricao:
          'Sente-se no aparelho, posicione os pés na plataforma e empurre-a até estender as pernas, depois flexione os joelhos controlando o movimento.',
      },
      {
        id: 3,
        nome: 'Banco Extensor(Perna)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey.jpg'),
        descricao:
          'Sente-se no banco extensor, ajuste o apoio nos tornozelos e eleve as pernas até estender os joelhos, retornando devagar.',
      },
      {
        id: 4,
        nome: 'Mesa Flexora(Perna)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_roupas.jpg'),
        descricao:
          'Deite-se na mesa flexora, posicione os tornozelos sob o apoio e flexione os joelhos trazendo os pés em direção ao glúteo, depois retorne.',
      },
      {
        id: 5,
        nome: 'Abdutora(Perna)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_camisas.png'),
        descricao:
          'Sente-se no aparelho abdutora, posicione as pernas contra os apoios e afaste-as lateralmente, retornando ao centro com controle.',
      },
      {
        id: 6,
        nome: 'Panturrilha - Banco',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_creatina1.jpg'),
        descricao:
          'Sente-se no banco, apoie a ponta dos pés na plataforma e eleve os calcanhares, contraindo a panturrilha. Retorne devagar à posição inicial.',
      },
    ],
  };

  const totalExercicios = exercicios.perna.length;
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState({});
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
  const [modalExercicio, setModalExercicio] = useState({ visivel: false, exercicio: null });
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  const toggleExercicio = (id) => {
    const novoEstado = { ...exerciciosSelecionados };
    if (novoEstado[id]) delete novoEstado[id];
    else novoEstado[id] = true;

    setExerciciosSelecionados(novoEstado);
    setExerciciosConcluidos(Object.keys(novoEstado).length);
  };

  const handleSelecionarExercicios = () => {
    if (exerciciosConcluidos === totalExercicios) {
      setExerciciosSelecionados({});
      setExerciciosConcluidos(0);
    } else {
      const todos = {};
      exercicios.perna.forEach((e) => (todos[e.id] = true));
      setExerciciosSelecionados(todos);
      setExerciciosConcluidos(totalExercicios);
    }
  };

  const handleFinalizarTreino = () => {
    if (exerciciosConcluidos > 0) setModalFinalizar(true);
    else setModalAviso(true);
  };

  const handleConfirmarFinalizar = () => {
    setModalFinalizar(false);
    playSuccessSound();

    if (exerciciosConcluidos === totalExercicios && route?.params?.onTreinoConcluido) {
      route.params.onTreinoConcluido('Quarta-Feira');
    } else if (route?.params?.onTreinoIncompleto) {
      route.params.onTreinoIncompleto('Quarta-Feira');
    }

    navigation.navigate('MeuTreino');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.contentBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="#405CBA" />
      <HeaderSeta navigation={navigation} mesAno={null} />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.contentBg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.secaoContainer}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitle}>Perna</Text>
          </View>

          {exercicios.perna.map((exercicio) => (
            <View
              key={exercicio.id}
              style={[
                styles.exercicioCard,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1 },
              ]}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleExercicio(exercicio.id)}
              >
                <Ionicons
                  name={exerciciosSelecionados[exercicio.id] ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={exerciciosSelecionados[exercicio.id] ? '#405CBA' : '#ccc'}
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
                onPress={() => setModalExercicio({ visivel: true, exercicio })}
              >
                <Ionicons name="information-circle" size={24} color="#405CBA" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Barra de progresso */}
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

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.footerBg }]}>
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

      {/* Modais (mesmos da sua versão, só atualizados para o tema) */}
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
              alignItems: 'flex-start',
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
                  backgroundColor: '#405CBA',
                  marginRight: 8,
                }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.modalTitle }}>
                {modalExercicio.exercicio?.nome}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: theme.modalText, marginBottom: 16 }}>
              {modalExercicio.exercicio?.descricao}
            </Text>
            <TouchableOpacity
              onPress={() => setModalExercicio({ visivel: false, exercicio: null })}
              style={{ alignSelf: 'flex-end', marginTop: 8 }}
            >
              <Text style={{ color: '#405CBA', fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Finalizar */}
      <Modal visible={modalFinalizar} transparent animationType="fade">
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
            <MaterialIcons name="check-circle" size={40} color="#405CBA" style={{ marginBottom: 12 }} />
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
                  backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flex: 0.45,
                }}
                onPress={() => setModalFinalizar(false)}
              >
                <Text
                  style={{
                    color: '#405CBA',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#405CBA',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flex: 0.45,
                }}
                onPress={handleConfirmarFinalizar}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  Finalizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Aviso */}
      <Modal visible={modalAviso} transparent animationType="fade">
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
            <MaterialIcons
              name="error-outline"
              size={48}
              color="#F5A623"
              style={{ marginBottom: 12 }}
            />
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
              Complete pelo menos um exercício antes de finalizar.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#405CBA',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 32,
                width: '100%',
              }}
              onPress={() => setModalAviso(false)}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                }}
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

export default TreinoQuarta;
