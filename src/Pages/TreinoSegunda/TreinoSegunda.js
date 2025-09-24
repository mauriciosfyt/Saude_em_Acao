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

// ...restante do código permanece igual...

const TreinoSegunda = ({ navigation }) => {
  // Removido menuVisivel, controle agora é do HeaderSeta
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState({});
  const [modalExercicio, setModalExercicio] = useState({ visivel: false, exercicio: null });
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  // Dados dos exercícios
  const exercicios = {
    peito: [
      {
        id: 1,
        nome: 'Supino Inclinado',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_whey.jpg'),
        descricao: 'Deite-se no banco inclinado, segure a barra ou halteres acima do peito e desça até próximo ao peitoral. Empurre de volta até a posição inicial mantendo o controle.',
      },
      {
        id: 2,
        nome: 'Crucifixo Reto',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_creatina1.jpg'),
        descricao: 'Deite-se no banco reto, segure os halteres acima do peito e abra os braços até a linha do peito, retornando ao início com controle.',
      },
      {
        id: 3,
        nome: 'Voador Frontal',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_vitamina.jpg'),
        descricao: 'Sente-se no aparelho voador, apoie os braços e una-os à frente do peito, retornando devagar à posição inicial.',
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
        descricao: 'Em pé, segure a barra da polia alta com as duas mãos e estenda os cotovelos até o final, retornando devagar.',
      },
      {
        id: 5,
        nome: 'Mergulho em Barras',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_camisas.png'),
        descricao: 'Apoie-se nas barras paralelas, flexione os cotovelos descendo o corpo e empurre de volta até estender os braços.',
      },
      {
        id: 6,
        nome: 'Rosca Francesa',
        series: 4,
        repeticoes: 15,
        carga: 0,
        imagem: require('../../../assets/banner_loja.png'),
        descricao: 'Deitado, segure a barra com as mãos fechadas e flexione os cotovelos levando a barra até a testa, depois estenda novamente.',
      },
    ],
  };

  const totalExercicios = 6;

  // Menu lateral agora é controlado pelo HeaderSeta

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

  // Função para começar treino
  const handleComecarTreino = () => {
    console.log('Começando treino...');
    // Aqui você pode implementar a lógica para iniciar o cronômetro ou navegar para uma tela de exercício ativo
  };

  // Função para finalizar treino
  const handleFinalizarTreino = () => {
    if (exerciciosConcluidos === totalExercicios) {
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
    navigation.goBack();
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
      <StatusBar barStyle="light-content" backgroundColor="#405CBA" />

      {/* Header com seta de voltar e menu */}
      <HeaderSeta navigation={navigation} mesAno={null} />

      {/* Conteúdo Principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seção Peito */}
        <View style={styles.secaoContainer}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitle}>Peito</Text>
          </View>
          
          {exercicios.peito.map((exercicio) => (
            <View key={exercicio.id} style={styles.exercicioCard}>
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
              
              <Image source={exercicio.imagem} style={styles.exercicioImage} />
              
              <View style={styles.exercicioInfo}>
                <Text style={styles.exercicioNome}>{exercicio.id} {exercicio.nome}</Text>
                <Text style={styles.exercicioDetalhes}>Série: {exercicio.series}</Text>
                <Text style={styles.exercicioDetalhes}>Repetição: {exercicio.repeticoes}</Text>
                <Text style={styles.exercicioDetalhes}>Carga: {exercicio.carga}(kg)</Text>
              </View>
              
              <TouchableOpacity style={styles.infoButton} onPress={() => handleAbrirModalExercicio(exercicio)}>
                <Ionicons name="information-circle" size={24} color="#405CBA" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Seção Tríceps */}
        <View style={styles.secaoContainer}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitle}>Triceps</Text>
          </View>
          
          {exercicios.triceps.map((exercicio) => (
            <View key={exercicio.id} style={styles.exercicioCard}>
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
              
              <Image source={exercicio.imagem} style={styles.exercicioImage} />
              
              <View style={styles.exercicioInfo}>
                <Text style={styles.exercicioNome}>{exercicio.id} {exercicio.nome}</Text>
                <Text style={styles.exercicioDetalhes}>Série: {exercicio.series}</Text>
                <Text style={styles.exercicioDetalhes}>Repetição: {exercicio.repeticoes}</Text>
                <Text style={styles.exercicioDetalhes}>Carga: {exercicio.carga}(kg)</Text>
              </View>
              
              <TouchableOpacity style={styles.infoButton} onPress={() => handleAbrirModalExercicio(exercicio)}>
                <Ionicons name="information-circle" size={24} color="#405CBA" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{exerciciosConcluidos} de {totalExercicios} Treinos concluidos</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(exerciciosConcluidos / totalExercicios) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer com Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.comecarButton} onPress={handleComecarTreino}>
          <Text style={styles.comecarButtonText}>Começar Treino</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.finalizarButton} onPress={handleFinalizarTreino}>
          <Text style={styles.finalizarButtonText}>Finalizar</Text>
          <Ionicons name="checkmark-circle" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Menu lateral agora é controlado pelo HeaderSeta */}

      {/* Modal Sobre o Exercício */}
      <Modal
        visible={modalExercicio.visivel}
        transparent
        animationType="fade"
        onRequestClose={handleFecharModalExercicio}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 24,
            width: '85%',
            alignItems: 'flex-start'
          }}>
            <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Sobre o Exercício</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#405CBA', marginRight: 8 }} />
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {modalExercicio.exercicio?.nome}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: '#222', marginBottom: 16 }}>
              {modalExercicio.exercicio?.descricao || 'Descrição do exercício.'}
            </Text>
            <TouchableOpacity onPress={handleFecharModalExercicio} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <Text style={{ color: '#405CBA', fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Finalizar Treino */}
      <Modal
        visible={modalFinalizar}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelarFinalizar}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', width: 300 }}>
            <MaterialIcons name="check-circle" size={48} color="green" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
              Parabéns, você completou todos os exercícios.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              Deseja finalizar o treino?
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#405CBA', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, marginBottom: 10, width: '100%' }}
              onPress={handleConfirmarFinalizar}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Sim, Finalizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#F0F0F0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, width: '100%' }}
              onPress={handleCancelarFinalizar}
            >
              <Text style={{ color: '#405CBA', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Não, Voltar</Text>
            </TouchableOpacity>
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
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', width: 300 }}>
            <MaterialIcons name="error-outline" size={48} color="#F5A623" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
              Você ainda não completou todos os exercícios.
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
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

export default TreinoSegunda;