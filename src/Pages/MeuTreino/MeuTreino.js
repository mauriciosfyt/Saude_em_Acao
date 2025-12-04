import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  useFocusEffect,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "../../Styles/MeuTreinoStyle";
import { useTheme } from "../../context/ThemeContext";
// Não usar mais o contexto de treinos para marcar localmente — vamos derivar status do servidor
import { obterMeusTreinos, obterDesempenhoSemanal, registrarTreinoRealizado } from '../../Services/api';
import { useAuth } from '../../context/AuthContext';

const MeuTreino = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalConcluido, setModalConcluido] = useState({
    visivel: false,
    dia: "",
  });
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  // Não usar o contexto de treinos aqui — derivamos status do servidor localmente
  // (mantemos o provider global caso outras telas usem)
  const desempenhoInicial = {};
  const [desempenhoMap, setDesempenhoMap] = useState(desempenhoInicial);
  const { logout } = useAuth();

  const [treinos, setTreinos] = useState([]);
  const [carregandoTreinos, setCarregandoTreinos] = useState(true);

  // Carregar treinos da API se disponível; caso contrário, usar fallback
  const mountedRef = useRef(true);

  const carregar = async () => {
    try {
      setCarregandoTreinos(true);
      const dadosRaw = await obterMeusTreinos();
      const dados = Array.isArray(dadosRaw)
        ? dadosRaw
        : dadosRaw?.treinos || dadosRaw?.dias || dadosRaw?.items || [];
      if (!mountedRef.current) return;

      if (Array.isArray(dados) && dados.length > 0) {
        // (o corpo de processamento dos dados permanece igual ao anterior)
        // Expande e ordena treinos (mantido)
        const dayNames = [
          'Segunda-Feira','Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado','Domingo'
        ];
        const expanded = [];
        dados.forEach((t, idx) => {
          const baseImage = t.imagem ? { uri: t.imagem } : [
            require("../../../assets/banner_whey.png"),
            require("../../../assets/banner_creatina.png"),
            require("../../../assets/banner_vitaminas.png"),
            require("../../../assets/banner_roupas.jpg"),
            require("../../../assets/banner_camisas.png"),
          ][idx % 5];

          const dayFullMap = {
            'SEGUNDA': 'Segunda','TERCA': 'Terça','TERÇA': 'Terça','QUARTA': 'Quarta','QUINTA': 'Quinta','SEXTA': 'Sexta','SABADO': 'Sábado','SÁBADO': 'Sábado'
          };

          if (t.exerciciosPorDia && typeof t.exerciciosPorDia === 'object' && Object.keys(t.exerciciosPorDia).length) {
            Object.keys(t.exerciciosPorDia).forEach((k, kidx) => {
              const up = String(k).toUpperCase();
              const diaLabel = dayFullMap[up] || (k[0].toUpperCase() + k.slice(1).toLowerCase());
              expanded.push({
                id: `${t.id || idx + 1}_${up}_${kidx}`,
                treinoId: t.id || t.treinoId || t._id || null,
                dia: diaLabel,
                grupos: Array.isArray(t.exerciciosPorDia[k]) ? `• ${t.exerciciosPorDia[k].map(e => e.nome).join(' • ')}` : (t.grupos || ''),
                imagem: baseImage,
                exercicios: t.exerciciosPorDia[k],
              });
            });
          } else {
            const possibleNumbers = [t.numero, t.treinoNumero, t.treinoId, t.treino, t.id, t.index];
            let num = possibleNumbers.find((v) => v !== undefined && v !== null);
            if (typeof num === 'string' && num.trim() !== '') {
              const parsed = parseInt(num, 10);
              if (!isNaN(parsed)) num = parsed;
            }
            let diaValue = null;
            if (typeof num === 'number' && Number.isFinite(num)) {
              const idxDia = ((Math.floor(num) - 1) % 7 + 7) % 7;
              diaValue = dayNames[idxDia];
            }
            let scheduledLabel = null;
            try {
              const keys = t.exerciciosPorDia && Object.keys(t.exerciciosPorDia).filter(Boolean);
              if (keys && keys.length) {
                const mapped = keys.map(k => { const up = String(k).toUpperCase(); return (dayFullMap && dayFullMap[up]) || (k[0].toUpperCase() + k.slice(1).toLowerCase()); });
                const order = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
                const unique = Array.from(new Set(mapped));
                unique.sort((a,b) => order.indexOf(a) - order.indexOf(b));
                const formatDayList = (arr) => { if (!arr || arr.length === 0) return null; if (arr.length === 1) return arr[0]; if (arr.length === 2) return `${arr[0]} e ${arr[1]}`; return `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`; };
                scheduledLabel = formatDayList(unique);
              }
            } catch (e) { scheduledLabel = null; }

            const possibleDateFields = [t.datas, t.dates, t.agendamentos, t.saveDates, t.savedDates, t.salvoEm, t.data, t.dataSalva, t.datasSalvas];
            const extractDates = (val) => { if (!val) return []; if (Array.isArray(val)) return val; if (typeof val === 'string') { if (val.includes(',')) return val.split(',').map(s => s.trim()).filter(Boolean); return [val.trim()]; } return [String(val)]; };
            const daysShort = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
            let scheduledDates = [];
            for (const field of possibleDateFields) { if (field) { const arr = extractDates(field); if (arr.length) { scheduledDates = arr; break; } } }
            const scheduledDayNames = (() => { if (!scheduledDates || !scheduledDates.length) return []; const indices = scheduledDates.map(d => { try { const date = new Date(d); if (!isNaN(date.getTime())) return date.getDay(); } catch(e) { return null } return null }).filter(v => v !== null && v !== undefined); const unique = Array.from(new Set(indices)); const order = [1,2,3,4,5,6,0]; unique.sort((a,b) => order.indexOf(a) - order.indexOf(b)); return unique.map(i => daysShort[i]); })();
            const formatDayList = (arr) => { if (!arr || arr.length === 0) return null; if (arr.length === 1) return arr[0]; if (arr.length === 2) return `${arr[0]} e ${arr[1]}`; return `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`; };
            const scheduledLabelFromDates = formatDayList(scheduledDayNames);
            if (!scheduledLabel) scheduledLabel = scheduledLabelFromDates;
            const diaTexto = scheduledLabel || diaValue || t.dia || t.nome || t.nomeDia || `Treino ${idx + 1}`;
            expanded.push({ id: t.id || t.treinoId || idx + 1, treinoId: t.id || t.treinoId || t._id || null, dia: diaTexto, grupos: t.grupos || t.musculos || t.descricao || '', imagem: baseImage });
          }
        });

        const weekOrder = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
        const normalizeStr = (s) => String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const weekOrderNorm = weekOrder.map(normalizeStr);
        const getDayIndex = (diaStr) => { if (!diaStr) return 99; const normalized = normalizeStr(diaStr); for (let i = 0; i < weekOrderNorm.length; i++) { const w = weekOrderNorm[i]; if (!w) continue; if (normalized.includes(w)) return i; } return 99; };
        expanded.sort((a, b) => { const ia = getDayIndex(a.dia); const ib = getDayIndex(b.dia); if (ia === ib) return 0; return ia - ib; });
        setTreinos(expanded);

        // Buscar treinos realizados na semana e derivar um mapa local (sem persistir no contexto)
        try {
          const desempenho = await obterDesempenhoSemanal();
          const items = Array.isArray(desempenho) ? desempenho : (desempenho?.items || desempenho?.treinos || []);
          if (__DEV__) console.log('[API] desempenho semanal raw:', JSON.stringify(items));

          const novoMapa = {};
          items.forEach((it) => {
            const isString = typeof it === 'string';
            const diaRaw = isString ? it : (it.diaDaSemanaConcluido || it.dia || it.day || it.nome || it?.dia);
            if (!diaRaw) return;
            const up = String(diaRaw).toUpperCase();
            let canon = null;
            if (up.includes('SEGUNDA')) canon = 'Segunda';
            else if (up.includes('TERCA') || up.includes('TERÇA')) canon = 'Terça';
            else if (up.includes('QUARTA')) canon = 'Quarta';
            else if (up.includes('QUINTA')) canon = 'Quinta';
            else if (up.includes('SEXTA')) canon = 'Sexta';
            else if (up.includes('SABADO') || up.includes('SÁBADO')) canon = 'Sábado';
            else if (up.includes('DOMINGO')) canon = 'Domingo';
            if (!canon) return;

            if (isString) {
              // Formato antigo: lista de strings -> considerar concluído
              novoMapa[canon] = 'concluido';
            } else if (it?.realizado === true) {
              // Só marcar quando o backend disser explicitamente que foi realizado
              novoMapa[canon] = 'concluido';
            }
            // OBS: NÃO marcamos 'incompleto' — dias não listados não serão considerados concluídos
          });

          if (mountedRef.current) setDesempenhoMap(novoMapa);
        } catch (errDes) { if (__DEV__) console.warn('Erro ao obter desempenho semanal:', errDes); }
      } else {
        // fallback local (sem dados da API)
        setTreinos([
          { id: 0, dia: 'Domingo', grupos: '• Descanso', imagem: require('../../../assets/banner_whey.png') },
          { id: 1, dia: 'Segunda-Feira', grupos: '• Peito • Tríceps', imagem: require('../../../assets/banner_whey.png') },
          { id: 2, dia: 'Terça-Feira', grupos: '• Costas • Bíceps', imagem: require('../../../assets/banner_creatina.png') },
          { id: 3, dia: 'Quarta-Feira', grupos: '• Perna completo', imagem: require('../../../assets/banner_vitaminas.png') },
          { id: 4, dia: 'Quinta-Feira', grupos: '• Cardio • Ombro', imagem: require('../../../assets/banner_roupas.jpg') },
          { id: 5, dia: 'Sexta-Feira', grupos: '• Abdômen • Costas', imagem: require('../../../assets/banner_camisas.png') },
          { id: 6, dia: 'Sábado', grupos: '• Alongamento', imagem: require('../../../assets/banner_camisas.png') },
        ]);
      }
    } catch (error) {
      try { const errMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error)); console.error('Erro ao carregar treinos:', errMsg); } catch (e) { console.error('Erro ao carregar treinos: (erro não serializável)'); }
      const is403 = (error && (error.response?.status === 403 || error.status === 403)) || (typeof error === 'string' && error.includes('403')) || (error?.message && String(error.message).includes('403'));
      if (is403) {
        try { Alert.alert('Sessão expirada','Sua sessão expirou ou você não tem permissão. Faça login novamente.',[{ text: 'OK', onPress: async () => { try { await logout(); } catch (e) { console.warn('Erro ao chamar logout:', e); } navigation.navigate('Inicial'); }, },], { cancelable: false }); } catch (e) { console.warn('Erro ao mostrar alerta de 403', e); }
      }
      setTreinos([
        
      ]);
    } finally { setCarregandoTreinos(false); }
  };

  React.useEffect(() => { mountedRef.current = true; carregar(); return () => { mountedRef.current = false; }; }, []);

  // Atualizar a tela quando retorna do treino (para refletir mudanças de status)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregar();
    });

    return unsubscribe;
  }, [navigation]);

  const getCurrentDate = () => {
    const today = new Date();
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    return `${dayName} Feira, ${day} de ${month}`;
  };

  const normalizarDia = (dia) => {
    if (!dia) return '';
    const upper = String(dia).toUpperCase();
    if (upper.includes('SEGUNDA')) return 'Segunda';
    if (upper.includes('TERÇA') || upper.includes('TERCA')) return 'Terça';
    if (upper.includes('QUARTA')) return 'Quarta';
    if (upper.includes('QUINTA')) return 'Quinta';
    if (upper.includes('SEXTA')) return 'Sexta';
    if (upper.includes('SÁBADO') || upper.includes('SABADO')) return 'Sábado';
    if (upper.includes('DOMINGO')) return 'Domingo';
    return dia;
  };

  // Verifica se o dia passado é o dia atual
  const ehDiaAtual = (diaNome) => {
    const diaAtual = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diasMapa = {
      'Segunda': 1,
      'Terça': 2,
      'Quarta': 3,
      'Quinta': 4,
      'Sexta': 5,
      'Sábado': 6,
      'Domingo': 0,
    };
    return diasMapa[diaNome] === diaAtual;
  };

  const handleIniciarTreino = (treino) => {
    // Normaliza o dia para garantir consistência
    const diaQuarta = normalizarDia(treino.dia);
    
    // Verifica se é o dia atual
    if (!ehDiaAtual(diaQuarta)) {
      Alert.alert(
        'Treino não disponível',
        `Você só pode treinar ${diaQuarta} na ${diaQuarta}. Volte no dia certo para treinar!`,
        [{ text: 'OK', onPress: () => {} }]
      );
      return;
    }
    
    // Só bloqueia se o treino estiver completamente concluído (somente a partir do servidor)
    if (desempenhoMap[diaQuarta] === 'concluido') {
      setModalConcluido({ visivel: true, dia: diaQuarta });
      return;
    }
    
    // Tenta extrair exercícios e id do treino (quando vindo de exerciciosPorDia)
    // Usa treinoId se disponível (ID real da API), senão tenta id
    const treinoId = treino.treinoId || treino.id || treino._id || null;
    const routeParams = treino.exercicios ? { exercicios: treino.exercicios, treinoId } : { treinoId };
    
    if (diaQuarta === "Segunda") {
      navigation.navigate("TreinoSegunda", routeParams);
    } else if (diaQuarta === "Terça") {
      navigation.navigate("TreinoTerca", routeParams);
    } else if (diaQuarta === "Quarta") {
      navigation.navigate("TreinoQuarta", routeParams);
    } else if (diaQuarta === "Quinta") {
      navigation.navigate("TreinoQuinta", routeParams);
    } else if (diaQuarta === "Sexta") {
      navigation.navigate("TreinoSexta", routeParams);
    }
  };

  const fecharModalConcluido = () => {
    setModalConcluido({ visivel: false, dia: "" });
  };

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    navigation.navigate(nomeDaTela);
  };

  const handleSairConta = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Logout cancelado'),
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              handleFecharMenu();
              await logout();
              navigation.navigate('Inicial');
              console.log('✅ Logout realizado com sucesso');
            } catch (error) {
              console.error('❌ Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao sair da conta. Tente novamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#405CBA" }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#fff' }]}> 
            Meus Treinos
          </Text>
          <TouchableOpacity onPress={handleAbrirMenu}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: '#fff' }]}> 
            Olá Aluno!
          </Text>
          <Text style={[styles.date, { color: '#fff' }]}> 
            {getCurrentDate()}
          </Text>
        </View>
      </View>

      {/* Lista de Treinos */}
      <ScrollView style={styles.content}>
        {treinos && treinos.length > 0 ? (
          treinos.map((treino) => (
            <View key={treino.id} style={styles.treinoCard}>
              <Image source={treino.imagem} style={styles.treinoImage} />
              <View style={styles.treinoInfo}>
                <Text style={[styles.treinoDia, { color: colors.textPrimary }]}>
                  {String(treino.dia)}
                </Text>
              </View>
              {(() => {
                const diaNorm = normalizarDia(treino.dia);
                const isConcluido = desempenhoMap[diaNorm] === 'concluido';
                const isIncompleto = false; // não armazenamos estado 'incompleto' localmente
                return (
                  <TouchableOpacity
                    style={[
                      styles.iniciarButton,
                      isConcluido && styles.concluidoButton,
                      // sem estilo para 'incompleto'
                    ]}
                    onPress={() => !isConcluido && handleIniciarTreino(treino)}
                    disabled={isConcluido}
                  >
                    <Text
                      style={[
                        styles.iniciarButtonText,
                        isConcluido && styles.concluidoButtonText,
                        // sem estilo para 'incompleto'
                      ]}
                    >
                      {isConcluido ? "Concluído" : "Iniciar"}
                    </Text>
                    <Ionicons
                      name={isConcluido ? "checkmark-circle" : "arrow-forward"}
                      size={16}
                      color="white"
                    />
                  </TouchableOpacity>
                );
              })()}
            </View>
          ))
        ) : (
          <View style={styles.semTreinoContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.primary} style={{ marginBottom: 16 }} />
            <Text style={[styles.semTreinoTitulo, { color: colors.textPrimary }]}>
              Nenhum Treino Disponível
            </Text>
            <Text style={[styles.semTreinoDescricao, { color: colors.textSecondary }]}>
              Você ainda não possui um treino personalizado. Fale com um dos nossos personais instrutores para criar um treino adaptado às suas necessidades!
            </Text>
            <TouchableOpacity 
              style={styles.contatarPersonalButton}
              onPress={() => handleNavegar("Professores")}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.contatarPersonalButtonText}>
                Conversar com Personal
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
          <View
            style={[
              styles.menuContent,
              { backgroundColor: isDark ? "#2c2c2c" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.menuTitle,
                { color: isDark ? "#E6E8F3" : "#333333" },
              ]}
            >
              Menu
            </Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
              <Ionicons
                name="home-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Meu Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Loja")}
            >
              <Ionicons
                name="cart-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Loja
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons
                name="heart-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Favoritos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Reservas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons
                name="bar-chart-outline"
                size={24}
                color={isDark ? "#D3D8EB" : "#333333"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isDark ? "#D3D8EB" : "#333333" },
                ]}
              >
                Desempenho
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSairConta}
            >
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: "#dc3545" }]}>
                Sair
              </Text>
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
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.cardBg }]}
          >
            <Ionicons
              name="checkmark-circle"
              size={48}
              color="#4CAF50"
              style={{ marginBottom: 12 }}
            />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Treino Concluído!
            </Text>
            <Text
              style={[styles.modalMessage, { color: colors.textSecondary }]}
            >
              O treino de {String(modalConcluido.dia)} já foi finalizado hoje.
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
