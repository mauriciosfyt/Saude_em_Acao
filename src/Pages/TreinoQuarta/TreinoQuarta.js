import React, { useState, useEffect, useMemo } from 'react';
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
import { useTreinos } from '../../context/TreinosContext';

const TreinoQuarta = ({ navigation, route }) => {
  const { isDark, colors } = useTheme();
  const { marcarTreinoComoConcluido, marcarTreinoComoIncompleto, salvarProgresso, obterProgresso, progressoTreinos } = useTreinos();

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
    menuBg: isDark ? '#2C2C2C' : '#FFFFFF',
    menuText: isDark ? '#fafafa' : '#000000',
    iconColor: isDark ? '#FFFFFF' : '#333333',
  };

  // Se vierem exercícios da API via route.params, usar como única fonte; caso contrário, usar hardcoded
  const getExerciciosPorCategoria = () => {
    if (route?.params?.exercicios && Array.isArray(route.params.exercicios)) {
      const apiExercicios = route.params.exercicios;
      const agrupado = apiExercicios.reduce((acc, ex, idx) => {
        const grupo = (ex.grupo || ex.categoria || 'geral').toLowerCase();
        if (!acc[grupo]) acc[grupo] = [];
        const safeId = ex.id ?? ex._id ?? ex.uid ?? `api_${idx}`;
        const imagemUri = ex.img || ex.imagem || null;
        acc[grupo].push({
          id: safeId,
          nome: ex.nome || `Exercício ${safeId}`,
          series: ex.series || 4,
          repeticoes: ex.repeticoes || 15,
          carga: ex.carga || 0,
          imagem: imagemUri ? { uri: imagemUri } : require('../../../assets/banner_whey_piqueno.jpg'),
          descricao: ex.descricao || 'Realize o exercício conforme instruído.',
        });
        return acc;
      }, {});
      return agrupado;
    }
    
    return {
    perna: [
      {
        id: 1,
        nome: 'Agachamento (Perna)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
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
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
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
  };

  const exercicios = useMemo(() => getExerciciosPorCategoria(), [route?.params?.exercicios]);
  const totalExercicios = Object.values(exercicios).reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0) || 6;
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState({});
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
  const [modalExercicio, setModalExercicio] = useState({ visivel: false, exercicio: null });
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  useEffect(() => {
    const treinoKey = route?.params?.treinoId || 'Quarta';
    const saved = obterProgresso(treinoKey) || [];
    if (saved && saved.length) {
      const inicial = {};
      Object.entries(exercicios).forEach(([grupo, arr]) => {
        if (Array.isArray(arr)) arr.forEach(e => {
          if (saved.includes(String(e.id)) || saved.includes(e.id)) inicial[`${grupo}_${e.id}`] = true;
        });
      });
      setExerciciosSelecionados(inicial);
      setExerciciosConcluidos(Object.keys(inicial).length);
    }
  }, [route?.params?.treinoId, progressoTreinos, exercicios]);

  const toggleExercicio = (id) => {
    setExerciciosSelecionados(prev => {
      const novoEstado = { ...prev };
      if (novoEstado[id]) delete novoEstado[id];
      else novoEstado[id] = true;

      setExerciciosConcluidos(Object.keys(novoEstado).length);
      return novoEstado;
    });
  };

  const handleSelecionarExercicios = () => {
    if (exerciciosConcluidos === totalExercicios) {
      setExerciciosSelecionados({});
      setExerciciosConcluidos(0);
    } else {
      const todos = {};
      // Iterar sobre todas as categorias em exercicios
      Object.entries(exercicios).forEach(([grupo, arr]) => {
        if (Array.isArray(arr)) {
          arr.forEach((e) => (todos[`${grupo}_${e.id}`] = true));
        }
      });
      setExerciciosSelecionados(todos);
      setExerciciosConcluidos(totalExercicios);
    }
  };

  const handleFinalizarTreino = () => {
    if (exerciciosConcluidos > 0) setModalFinalizar(true);
    else setModalAviso(true);
  };

  const handleConfirmarFinalizar = () => {
    (async () => {
      setModalFinalizar(false);
      playSuccessSound();

      const treinoId = route?.params?.treinoId || null;
      const selecionados = Object.keys(exerciciosSelecionados || {}).map(k => k.split('_').slice(1).join('_'));
      try {
        const treinoKey = treinoId || 'Quarta';
        salvarProgresso(treinoKey, selecionados);
      } catch (err) {
        console.error('Erro ao salvar progresso localmente:', err);
      }

      if (exerciciosConcluidos === totalExercicios) {
        marcarTreinoComoConcluido && marcarTreinoComoConcluido('Quarta');
      } else {
        marcarTreinoComoIncompleto && marcarTreinoComoIncompleto('Quarta');
      }

      navigation.navigate('MeuTreino');
    })();
  };

  const [menuVisivel, setMenuVisivel] = useState(false);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.contentBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
      <HeaderSeta navigation={navigation} mesAno={null} isDark={isDark} onPressMenu={handleAbrirMenu} />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.contentBg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Seções dinâmicas */}
        {Object.entries(exercicios).map(([grupo, lista]) => (
          <View key={grupo} style={styles.secaoContainer}>
            {lista.map((exercicio) => (
              <View
                key={`${grupo}_${exercicio.id}`}
                style={[
                  styles.exercicioCard,
                  { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1 },
                ]}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleExercicio(`${grupo}_${exercicio.id}`)}
                >
                  <Ionicons
                    name={exerciciosSelecionados[`${grupo}_${exercicio.id}`] ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={exerciciosSelecionados[`${grupo}_${exercicio.id}`] ? colors.primary : colors.divider}
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
                  <Ionicons name="information-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
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
                  backgroundColor: colors.primary,
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
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
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
                    color: colors.primary,
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
                  backgroundColor: colors.primary,
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
                    backgroundColor: colors.primary,
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

      {/* Menu lateral */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={handleFecharMenu}>
          <View style={[styles.menuContent, { backgroundColor: theme.menuBg }]}>
            <Text style={[styles.menuTitle, { color: theme.menuText }]}>Menu</Text>

            {[
              { nome: 'MainTabs', label: 'Home', icon: 'home-outline' },
              { nome: 'Perfil', label: 'Meu Perfil', icon: 'person-outline' },
              { nome: 'Chat', label: 'Chat', icon: 'chatbubble-ellipses-outline' },
              { nome: 'Desempenho', label: 'Desempenho', icon: 'bar-chart-outline' },
              { nome: 'MeuTreino', label: 'Meus Treinos', icon: 'fitness-outline' },
            ].map((item) => (
              <TouchableOpacity
                key={item.nome}
                style={styles.menuItem}
                onPress={() => handleNavegar(item.nome)}
              >
                <Ionicons name={item.icon} size={24} color={theme.iconColor} />
                <Text style={[styles.menuItemText, { color: theme.menuText }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default TreinoQuarta;
