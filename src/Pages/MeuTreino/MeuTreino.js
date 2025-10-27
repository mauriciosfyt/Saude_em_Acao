import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, SafeAreaView, StatusBar, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "../../Styles/MeuTreinoStyle";
import { useTheme } from "../../context/ThemeContext";
import { useTreinos } from "../../context/TreinosContext";

const MeuTreino = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalConcluido, setModalConcluido] = useState({ visivel: false, dia: '' });
  const { colors, isDark } = useTheme();
  const styles = createStyles(isDark);
  const { treinosConcluidos, treinosIncompletos, marcarTreinoComoConcluido, marcarTreinoComoIncompleto } = useTreinos();

  const treinos = [
    {
      id: 1,
      dia: 'Segunda-Feira',
      grupos: '• Peito • Tríceps',
      imagem: require('../../../assets/banner_whey.png'),
    },
    {
      id: 2,
      dia: 'Terça-Feira',
      grupos: '• Costas • Bíceps',
      imagem: require('../../../assets/banner_creatina.png'),
    },
    {
      id: 3,
      dia: 'Quarta-Feira',
      grupos: '• Perna completo',
      imagem: require('../../../assets/banner_vitaminas.png'),
    },
    {
      id: 4,
      dia: 'Quinta-Feira',
      grupos: '• Cardio • Ombro',
      imagem: require('../../../assets/banner_roupas.jpg'),
    },
    {
      id: 5,
      dia: 'Sexta-Feira',
      grupos: '• Abdômen • Costas',
      imagem: require('../../../assets/banner_camisas.png'),
    },
  ];

  const getCurrentDate = () => {
    const today = new Date();
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    return `${dayName} Feira, ${day} de ${month}`;
  };

  const handleIniciarTreino = (treino) => {
    // Só bloqueia se o treino estiver completamente concluído
    if (treinosConcluidos.has(treino.dia)) {
      setModalConcluido({ visivel: true, dia: treino.dia });
      return;
    }
    // Permite acesso a treinos incompletos ou novos
    if (treino.dia === 'Segunda-Feira') {
      navigation.navigate('TreinoSegunda', { 
        onTreinoConcluido: marcarTreinoComoConcluido,
        onTreinoIncompleto: marcarTreinoComoIncompleto 
      });
    } else if (treino.dia === 'Terça-Feira') {
      navigation.navigate('TreinoTerca', { 
        onTreinoConcluido: marcarTreinoComoConcluido,
        onTreinoIncompleto: marcarTreinoComoIncompleto 
      });
    } else if (treino.dia === 'Quarta-Feira') {
      navigation.navigate('TreinoQuarta', { 
        onTreinoConcluido: marcarTreinoComoConcluido,
        onTreinoIncompleto: marcarTreinoComoIncompleto 
      });
    } else if (treino.dia === 'Quinta-Feira') {
      navigation.navigate('TreinoQuinta', { 
        onTreinoConcluido: marcarTreinoComoConcluido,
        onTreinoIncompleto: marcarTreinoComoIncompleto 
      });
    } else if (treino.dia === 'Sexta-Feira') {
      navigation.navigate('TreinoSexta', { 
        onTreinoConcluido: marcarTreinoComoConcluido,
        onTreinoIncompleto: marcarTreinoComoIncompleto 
      });
    }
  };

  const fecharModalConcluido = () => {
    setModalConcluido({ visivel: false, dia: '' });
  };

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.headerText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>Meus Treinos</Text>
          <TouchableOpacity onPress={handleAbrirMenu}>
            <Ionicons name="menu" size={24} color={colors.headerText} />
          </TouchableOpacity>
        </View>
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: colors.headerText }]}>Olá Aluno!</Text>
          <Text style={[styles.date, { color: colors.headerText }]}>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* Lista de Treinos */}
      <ScrollView style={styles.content}>
        {treinos.map((treino) => (
          <View key={treino.id} style={styles.treinoCard}>
            <Image source={treino.imagem} style={styles.treinoImage} />
            <View style={styles.treinoInfo}>
              <Text style={[styles.treinoDia, { color: colors.textPrimary }]}>{treino.dia}</Text>
              <Text style={[styles.treinoGrupos, { color: colors.textSecondary }]}>{treino.grupos}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.iniciarButton,
                treinosConcluidos.has(treino.dia) && styles.concluidoButton,
                treinosIncompletos.has(treino.dia) && { backgroundColor: '#FF9800' }
              ]}
              onPress={() => !treinosConcluidos.has(treino.dia) && handleIniciarTreino(treino)}
              disabled={treinosConcluidos.has(treino.dia)}
            >
              <Text style={[
                styles.iniciarButtonText,
                treinosConcluidos.has(treino.dia) && styles.concluidoButtonText,
                treinosIncompletos.has(treino.dia) && { color: '#fff' }
              ]}>
                {treinosConcluidos.has(treino.dia) ? 'Concluído' : 
                 treinosIncompletos.has(treino.dia) ? 'Incompleto' : 'Iniciar'}
              </Text>
              <Ionicons
                name={treinosConcluidos.has(treino.dia) ? "checkmark-circle" : 
                      treinosIncompletos.has(treino.dia) ? "time-outline" : "arrow-forward"}
                size={16}
                color="white"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal do Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity
          style={[styles.menuOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }]}
          onPress={handleFecharMenu}
          activeOpacity={1}
        >
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#1F2430' : 'white' }]}>
            <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("MainTabs")}>
              <Ionicons name="home-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Perfil")}>
              <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Chat")}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar("Desempenho")}>
              <Ionicons name="bar-chart-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemAtivo]} onPress={() => handleNavegar("MeuTreino")}>
              <Ionicons name="fitness-outline" size={24} color={colors.primary} />
              <Text style={[styles.menuItemText, styles.menuItemTextAtivo]}>Meus Treinos</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Aviso - Treino Já Concluído */}
      <Modal
        visible={modalConcluido.visivel}
        animationType="fade"
        transparent={true}
        onRequestClose={fecharModalConcluido}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" style={{ marginBottom: 12 }} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Treino Concluído!
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              O treino de {modalConcluido.dia} já foi finalizado hoje.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={fecharModalConcluido}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MeuTreino;
