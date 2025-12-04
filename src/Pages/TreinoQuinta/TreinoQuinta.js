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
  Vibration,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderSeta from '../../Components/header_seta/header_seta';
import styles from '../../Styles/TreinoQuintaStyle';
import { playSuccessSound } from '../../Components/Sounds';
import { useTheme } from '../../context/ThemeContext';
import { useTreinos } from '../../context/TreinosContext';
import { registrarTreinoRealizado } from '../../Services/api';

const TreinoQuinta = ({ navigation, route }) => {
  const { isDark, colors } = useTheme();
  const { marcarTreinoComoConcluido, marcarTreinoComoIncompleto, salvarProgresso, obterProgresso, progressoTreinos } = useTreinos();

  const theme = {
    contentBg: isDark ? '#2C2C2C' : '#F5F5F5',
    cardBg: isDark ? '#3A3A3A' : '#FFFFFF',
    cardBorder: isDark ? '#555' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#C9CEDA' : '#555555',
    modalBg: isDark ? '#1E1E1E' : '#FFFFFF',
    modalTitle: isDark ? '#FFFFFF' : '#000000',
    modalText: isDark ? '#C9CEDA' : '#222222',
    footerBg: isDark ? '#2C2C2C' : '#FFFFFF',
    menuBg: isDark ? '#2C2C2C' : '#FFFFFF',
    menuText: isDark ? '#fafafa' : '#000000',
    iconColor: colors.primary,
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
    cardio: [
      {
        id: 1,
        nome: 'Esteira (Perna)',
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
        nome: 'Desenvolvimento - Máquina Articulada (Ombro)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
        descricao: 'Sente-se na máquina, segure as alças e empurre para cima até estender os braços.',
      },
      {
        id: 4,
        nome: 'Elevação Lateral (Ombro)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
        descricao: 'Em pé, segure os halteres ao lado do corpo e eleve-os lateralmente até a altura dos ombros.',
      },
      {
        id: 5,
        nome: 'Elevação Frontal (Ombro)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_creatina1.jpg'),
        descricao: 'Em pé, segure os halteres à frente das coxas e eleve-os à frente até a altura dos ombros.',
      },
      {
        id: 6,
        nome: 'Crucifixo Inverso (Costas)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_vitaminas.png'),
        descricao: 'Sentado, incline o tronco à frente e abra os braços lateralmente, contraindo as costas.',
      },
    ],
    };
  };

  const exercicios = useMemo(() => getExerciciosPorCategoria(), [route?.params?.exercicios]);

  const totalExercicios = Object.values(exercicios).reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0) || 6;

  // estados
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState({});
  const [modalExercicio, setModalExercicio] = useState({ visivel: false, exercicio: null });
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  useEffect(() => {
    const treinoKey = String(route?.params?.treinoId || 'Quinta');
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

  // ---------- Funções do menu ----------
  const handleAbrirMenu = () => {
    setMenuVisivel(true);
  };

  const handleFecharMenu = () => {
    setMenuVisivel(false);
  };

  const handleNavegar = (nomeDaTela) => {
    setMenuVisivel(false);
    navigation.navigate(nomeDaTela);
  };

  // ---------- Funções de seleção de exercício ----------
  const toggleExercicio = (id) => {
    setExerciciosSelecionados(prev => {
      const novoEstado = { ...prev };
      if (novoEstado[id]) {
        delete novoEstado[id];
      } else {
        novoEstado[id] = true;
      }
      setExerciciosConcluidos(Object.keys(novoEstado).length);
      return novoEstado;
    });
  };

  const handleSelecionarExercicios = () => {
    if (exerciciosConcluidos === totalExercicios) {
      // desmarcar todos
      setExerciciosSelecionados({});
      setExerciciosConcluidos(0);
    } else {
      // marcar todos
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

  // ---------- Finalizar treino ----------
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
    (async () => {
      setModalFinalizar(false);
      playSuccessSound();

      // Extrair o ID real do treino (pode vir como string composta, precisa extrair o número)
      let treinoId = route?.params?.treinoId || null;
      
      // Se o treinoId for uma string composta (ex: "1_SEGUNDA_2"), extrair apenas o número inicial
      if (treinoId && typeof treinoId === 'string' && treinoId.includes('_')) {
        const match = treinoId.match(/^(\d+)/);
        if (match) {
          treinoId = match[1];
        }
      }
      
      // Converter para número se for string numérica
      if (treinoId && typeof treinoId === 'string' && !isNaN(treinoId)) {
        treinoId = parseInt(treinoId, 10);
      }
      const selecionados = Object.keys(exerciciosSelecionados || {}).map(k => k.split('_').slice(1).join('_'));
      
      // Salvar localmente (progresso parcial)
      try {
        const treinoKey = String(treinoId || 'Quinta');
        salvarProgresso(treinoKey, selecionados);
      } catch (err) {
        // falha ao salvar progresso localmente — ignorar
      }

      // Registrar treino na API se tiver treinoId
      if (treinoId) {
        try {
          const payload = {
            exercicios: selecionados,
            parcial: exerciciosConcluidos < totalExercicios,
          };
          await registrarTreinoRealizado(treinoId, payload);
          // Executar vibração quando treino é concluído
          if (exerciciosConcluidos === totalExercicios) {
            try {
              Vibration.vibrate([0, 200, 100, 200]);
            } catch (vibError) {
              // vibrate não disponível — ignorar
            }
          }
        } catch (error) {
          // falha ao registrar — não bloquear fluxo
        }
      } else {
        // treinoId não disponível — nada a registrar remotamente
      }

      if (exerciciosConcluidos === totalExercicios) {
        marcarTreinoComoConcluido && marcarTreinoComoConcluido('Quinta');
      } else {
        marcarTreinoComoIncompleto && marcarTreinoComoIncompleto('Quinta');
      }

      if (navigation.reset) {
        navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'MeuTreino' }] });
      } else {
        navigation.replace ? navigation.replace('MeuTreino') : navigation.navigate('MeuTreino');
      }
    })();
  };

  const handleCancelarFinalizar = () => {
    setModalFinalizar(false);
  };

  // ---------- Modais de exercício ----------
  const handleAbrirModalExercicio = (exercicio) => {
    setModalExercicio({ visivel: true, exercicio });
  };

  const handleFecharModalExercicio = () => {
    setModalExercicio({ visivel: false, exercicio: null });
  };

  // ---------- Render ----------
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.contentBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.contentBg}
      />

      {/* Header - passei iconColor para HeaderSeta para controlar cor da seta/menu */}
      <HeaderSeta navigation={navigation} mesAno={null} isDark={isDark} iconColor={theme.iconColor} onPressMenu={handleAbrirMenu} extraMarginTop={40} />

      {/* Conteúdo principal */}
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
                <TouchableOpacity style={styles.checkbox} onPress={() => toggleExercicio(`${grupo}_${exercicio.id}`)}>
                  <Ionicons
                    name={exerciciosSelecionados[`${grupo}_${exercicio.id}`] ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={exerciciosSelecionados[`${grupo}_${exercicio.id}`] ? colors.primary : colors.divider}
                  />
                </TouchableOpacity>

                {exercicio.imagem && <Image source={exercicio.imagem} style={styles.exercicioImage} />}

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

                <TouchableOpacity style={styles.infoButton} onPress={() => handleAbrirModalExercicio(exercicio)}>
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
            color={exerciciosConcluidos === totalExercicios ? 'white' : theme.iconColor}
          />
        </TouchableOpacity>
      </View>

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

      {/* Modal do exercício */}
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

      {/* Modal Finalizar */}
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

      {/* Modal Aviso */}
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
              Você ainda não selecionou exercícios.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24, color: theme.modalText }}>
              Selecione ao menos um exercício antes de finalizar o treino.
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
