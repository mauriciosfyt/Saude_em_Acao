import React, { useState, useEffect, useMemo } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderSeta from '../../Components/header_seta/header_seta';
import styles from '../../Styles/TreinoSextastyle';
import { playSuccessSound } from '../../Components/Sounds';
import { useTheme } from '../../context/ThemeContext';
import { useTreinos } from '../../context/TreinosContext';

const TreinoSexta = ({ navigation, route }) => {
  const { isDark, colors } = useTheme();
  const { marcarTreinoComoConcluido, marcarTreinoComoIncompleto, salvarProgresso, obterProgresso, progressoTreinos } = useTreinos();

  // 🎨 Definição das cores do tema
  const theme = {
    contentBg: isDark ? '#2C2C2C' : '#F5F5F5',
    cardBg: isDark ? '#3A3A3A' : '#FFFFFF',
    cardBorder: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.1)',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#CCCCCC' : '#666666',
    footerBg: isDark ? '#2C2C2C' : '#FFFFFF',
    modalBg: isDark ? '#2c2c2c' : '#ffffff',
    modalTitle: isDark ? '#FFFFFF' : '#000000',
    modalText: isDark ? '#C9CEDA' : '#222222',
    iconColor: isDark ? '#FFFFFF' : '#000000',
    menuBg: isDark ? '#2C2C2C' : '#FFFFFF',
    menuText: isDark ? '#fafafa' : '#000000',
  };
  // Overlay do menu lateral (segue o tema)
  const menuOverlayColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)';

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
    costas: [
      {
        id: 1,
        nome: 'Remada Baixa',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_roupas.jpg'),
        descricao:
          'Sente-se no aparelho, segure a barra e puxe em direção ao abdômen, mantendo as costas retas.',
      },
      {
        id: 2,
        nome: 'Remada Alta',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_camisas.png'),
        descricao:
          'Em pé, segure a barra e puxe-a para cima até a altura do peito, mantendo os cotovelos elevados.',
      },
    ],
    abdomen: [
      {
        id: 3,
        nome: 'Abdominal Cruzado',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
        descricao:
          'Deitado, cruze uma perna sobre a outra e leve o cotovelo ao joelho oposto, alternando os lados.',
      },
      {
        id: 4,
        nome: 'Abdominal Reto',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey_piqueno.jpg'),
        descricao:
          'Deitado, flexione o tronco elevando os ombros em direção ao quadril.',
      },
      {
        id: 5,
        nome: 'Prancha',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_creatina1.jpg'),
        descricao:
          'Apoie os antebraços e a ponta dos pés no chão, mantendo o corpo reto e contraído.',
      },
      {
        id: 6,
        nome: 'Giro Francês (Abdômen)',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_vitaminas.png'),
        descricao:
          'Sentado, segure um peso e gire o tronco de um lado para o outro, trabalhando o abdômen oblíquo.',
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
    const treinoKey = route?.params?.treinoId || 'Sexta';
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
    // Depend on treinoId (primitive), progressoTreinos and memoized exercicios
  }, [route?.params?.treinoId, progressoTreinos, exercicios]);

  // ✅ Alterna o estado de conclusão do exercício
  const toggleExercicio = (id) => {
    setExerciciosSelecionados(prev => {
      const novoEstado = { ...prev };
      if (novoEstado[id]) {
        delete novoEstado[id];
      } else {
        novoEstado[id] = true;
      }
      // Atualiza o contador de forma sincronizada
      const novoContador = Object.keys(novoEstado).length;
      setExerciciosConcluidos(novoContador);
      return novoEstado;
    });
  };

  // ✅ Selecionar ou desmarcar todos
  const handleSelecionarExercicios = () => {
    if (exerciciosConcluidos === totalExercicios) {
      setExerciciosSelecionados({});
      setExerciciosConcluidos(0);
    } else {
      const todos = {};
      Object.entries(exercicios).forEach(([grupo, arr]) => {
        if (Array.isArray(arr)) {
          arr.forEach((e) => (todos[`${grupo}_${e.id}`] = true));
        }
      });
      setExerciciosSelecionados(todos);
      setExerciciosConcluidos(totalExercicios);
    }
  };

  //  Verifica se há exercícios selecionados antes de finalizar
  const handleFinalizarTreino = () => {
    if (exerciciosConcluidos > 0) {
      setModalFinalizar(true);
    } else {
      setModalAviso(true);
    }
  };

  // ✅ Confirma o término do treino
  const handleConfirmarFinalizar = () => {
    (async () => {
      setModalFinalizar(false);
      playSuccessSound();

      const treinoId = route?.params?.treinoId || null;
      const selecionados = Object.keys(exerciciosSelecionados || {}).map(k => k.split('_').slice(1).join('_'));
      try {
        const treinoKey = treinoId || 'Sexta';
        salvarProgresso(treinoKey, selecionados);
      } catch (err) {
        console.error('Erro ao salvar progresso localmente:', err);
      }

      if (exerciciosConcluidos === totalExercicios) {
        marcarTreinoComoConcluido && marcarTreinoComoConcluido('Sexta');
      } else {
        marcarTreinoComoIncompleto && marcarTreinoComoIncompleto('Sexta');
      }

      if (navigation.reset) {
        navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'MeuTreino' }] });
      } else {
        navigation.replace ? navigation.replace('MeuTreino') : navigation.navigate('MeuTreino');
      }
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
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />

      {/* Header com seta adaptável */}
      <HeaderSeta
        navigation={navigation}
        mesAno={null}
        isDark={isDark}
        onPressMenu={handleAbrirMenu}
        extraMarginTop={40}
      />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.contentBg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Seções (Costas e Abdômen) */}
        {Object.entries(exercicios).map(([grupo, lista]) => (
          <View key={grupo} style={styles.secaoContainer}>
            {lista.map((exercicio) => (
              <View
                key={`${grupo}_${exercicio.id}`}
                style={[
                  styles.exercicioCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleExercicio(`${grupo}_${exercicio.id}`)}
                >
                  <Ionicons
                    name={
                      exerciciosSelecionados[`${grupo}_${exercicio.id}`]
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={24}
                    color={exerciciosSelecionados[`${grupo}_${exercicio.id}`] ? colors.primary : colors.textTertiary}
                  />
                </TouchableOpacity>

                {exercicio.imagem && (
                  <Image source={exercicio.imagem} style={styles.exercicioImage} />
                )}

                <View style={styles.exercicioInfo}>
                  <Text style={[styles.exercicioNome, { color: theme.textPrimary }]}>
                    {exercicio.nome}
                  </Text>
                  <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Série: {exercicio.series}</Text>
                  <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Repetição: {exercicio.repeticoes}</Text>
                  <Text style={[styles.exercicioDetalhes, { color: theme.textSecondary }]}>Carga: {exercicio.carga} (kg)</Text>
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

      {/* Barra de Progresso */}
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
          <Text style={[styles.comecarButtonText, { color: theme.textPrimary }]}>
            Selecionar tudo
          </Text>
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
              {
                color:
                  exerciciosConcluidos === totalExercicios ? '#FFFFFF' : theme.textPrimary,
              },
            ]}
          >
            Finalizar
          </Text>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={
              exerciciosConcluidos === totalExercicios ? '#FFFFFF' : theme.textSecondary
            }
          />
        </TouchableOpacity>
      </View>
      {/* Menu lateral */}
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
            <Text style={{ color: theme.modalText, fontSize: 12, marginBottom: 8 }}>Sobre o Exercício</Text>
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
                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
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
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
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
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24, color: theme.modalText }}>
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
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={[styles.menuOverlay, { backgroundColor: menuOverlayColor }]}
          activeOpacity={1}
          onPress={handleFecharMenu}
        >
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
                <Ionicons name={item.icon} size={24} color={theme.menuText} />
                <Text style={[styles.menuItemText, { color: theme.menuText }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default TreinoSexta;
