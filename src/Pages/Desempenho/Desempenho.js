
import React, { useMemo, useState, useEffect } from 'react';
import DesempenhoHeader from '../../Components/header_seta/header_seta';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../Styles/DesempenhoStyles';
import {
  obterDesempenhoSemanal,
  obterMeusTreinos,
  obterDesempenhoMesAtual,
  obterHistoricoTreinosRealizados,
  obterTotalTreinosPlanejados,
  setAuthToken,
} from '../../Services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTreinos } from '../../context/TreinosContext';

const Desempenho = ({ navigation }) => {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const [dadosDesempenho, setDadosDesempenho] = useState({
    mesAno: '',
    progressoGeral: 0,
    treinosRealizados: 0,
    treinosTotal: 0,
    ultimoTreino: '',
  });
  const [diasMes, setDiasMes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { obterUltimasRealizacoes, obterTotalDiasComTreinoRealizado, obterDiasComTreinoRealizado } = useTreinos();

  // Função para atualizar o calendário baseado em dias realizados
  const atualizarCalendarioComDiasRealizados = (datasPlanejadasSet) => {
    try {
      const diasRegistrados = obterDiasComTreinoRealizado?.() || [];
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      
      const diasRegistradosNoMes = diasRegistrados.filter((ds) => {
        const dt = new Date(ds);
        return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
      });

      const lastDay = new Date(anoAtual, mesAtual + 1, 0).getDate();
      const realizedSet = new Set(diasRegistradosNoMes);
      const diasMesLocal = [];

      for (let d = 1; d <= lastDay; d++) {
        const dt = new Date(anoAtual, mesAtual, d);
        const key = dt.toISOString().split('T')[0];
        const planned = datasPlanejadasSet && datasPlanejadasSet.size > 0 ? datasPlanejadasSet.has(key) : false;
        const done = realizedSet.has(key);
        diasMesLocal.push({ date: key, day: d, planned, done });
      }
      
      setDiasMes(diasMesLocal);
    } catch (err) {
      // erro ao atualizar calendário (ignorado para não poluir logs)
    }
  };

  useEffect(() => {
    let mounted = true;

    // Gera um Set com strings YYYY-MM-DD das datas planejadas no mês atual
    const gerarDatasPlanejadasNoMes = (meusTreinosDataLocal) => {
      const treinosArray = Array.isArray(meusTreinosDataLocal)
        ? meusTreinosDataLocal
        : meusTreinosDataLocal?.treinos || meusTreinosDataLocal?.dias || meusTreinosDataLocal?.items || [];

      const resultado = new Set();
      if (!treinosArray || treinosArray.length === 0) return resultado;

      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      const diaMap = {
        'domingo': 0, 'domingo-feira': 0,
        'segunda': 1, 'segunda-feira': 1,
        'terca': 2, 'terça': 2, 'terca-feira': 2, 'terça-feira': 2,
        'quarta': 3, 'quarta-feira': 3,
        'quinta': 4, 'quinta-feira': 4,
        'sexta': 5, 'sexta-feira': 5,
        'sabado': 6, 'sábado': 6, 'sabado-feira': 6
      };

      const adicionarSeMesAtual = (dt) => {
        if (!dt || isNaN(dt.getTime())) return;
        if (dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual) resultado.add(dt.toISOString().split('T')[0]);
      };

      treinosArray.forEach((treino) => {
        // datas explícitas
        const datas = treino.datas || treino.dates || treino.agenda;
        if (Array.isArray(datas) && datas.length > 0) {
          datas.forEach(ds => adicionarSeMesAtual(new Date(ds)));
          return;
        }

        // exerciciosPorDia
        if (treino.exerciciosPorDia && typeof treino.exerciciosPorDia === 'object') {
          const weekdayIndices = new Set();
          Object.keys(treino.exerciciosPorDia).forEach(k => {
            const lk = String(k).toLowerCase();
            if (diaMap[lk] !== undefined) weekdayIndices.add(diaMap[lk]);
          });
          if (weekdayIndices.size > 0) {
            for (let d = 1; d <= 31; d++) {
              const dt = new Date(anoAtual, mesAtual, d);
              if (dt.getMonth() !== mesAtual) break;
              if (weekdayIndices.has(dt.getDay())) resultado.add(dt.toISOString().split('T')[0]);
            }
            return;
          }
        }

        // dias array
        const possibleDias = treino.dias || treino.diasSemana || treino.weekdays;
        if (Array.isArray(possibleDias) && possibleDias.length > 0) {
          const weekdayIndices = new Set();
          possibleDias.forEach(item => {
            if (typeof item === 'number') weekdayIndices.add(((item % 7) + 7) % 7);
            else if (typeof item === 'string') {
              const lk = item.toLowerCase();
              if (diaMap[lk] !== undefined) weekdayIndices.add(diaMap[lk]);
            }
          });
          if (weekdayIndices.size > 0) {
            for (let d = 1; d <= 31; d++) {
              const dt = new Date(anoAtual, mesAtual, d);
              if (dt.getMonth() !== mesAtual) break;
              if (weekdayIndices.has(dt.getDay())) resultado.add(dt.toISOString().split('T')[0]);
            }
            return;
          }
        }

        // dia único
        if (treino.dia) {
          const d = treino.dia;
          let idx = null;
          if (typeof d === 'number') idx = ((d % 7) + 7) % 7;
          else if (typeof d === 'string') {
            const lk = d.toLowerCase();
            if (diaMap[lk] !== undefined) idx = diaMap[lk];
          }
          if (idx !== null) {
            for (let dia = 1; dia <= 31; dia++) {
              const dt = new Date(anoAtual, mesAtual, dia);
              if (dt.getMonth() !== mesAtual) break;
              if (dt.getDay() === idx) resultado.add(dt.toISOString().split('T')[0]);
            }
            return;
          }
        }

        // fallback: não adiciona
      });

      return resultado;
    };
    const carregarDesempenho = async () => {
      try {

        let treinosRealizadosAPI = 0;
        let totalTreinosAPI = 0;
        let ultimaTreinoDataAPI = '';
        let diasMesAPI = [];

        // 🔐 Garantir que o token esteja configurado antes da API
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            setAuthToken(token);
          }
        } catch (eToken) {
          // falha ao obter token do storage
        }

        // 🔍 Buscar desempenho na API
        try {
          const desempenhoAPI = await obterDesempenhoMesAtual();
          // dados da API recebidos

          if (desempenhoAPI) {
            treinosRealizadosAPI =
              desempenhoAPI.treinosRealizados ||
              desempenhoAPI.treinos_realizados ||
              0;
            totalTreinosAPI =
              desempenhoAPI.treinosTotal || desempenhoAPI.treinos_total || 0;

            const ultimaData =
              desempenhoAPI.dataUltimoTreino ||
              desempenhoAPI.ultimoTreino ||
              desempenhoAPI.ultimo_treino;
            if (ultimaData) {
              // Se a API já retornou no formato DD/MM/YYYY, use direto
              const brDateMatch = String(ultimaData).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                  if (brDateMatch) {
                ultimaTreinoDataAPI = String(ultimaData);
              } else {
                // fallback: tentar criar Date a partir de ISO ou outros formatos
                const d = new Date(ultimaData);
                if (!isNaN(d.getTime())) {
                  ultimaTreinoDataAPI = d.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  // Date formatted via Date object
                }
              }
            }

            const exList =
              desempenhoAPI.exercicios ||
              desempenhoAPI.exerciciosFinalizados ||
              desempenhoAPI.exercicios_finalizados ||
              [];
                  if (Array.isArray(exList)) {
              setExercisesFinalizadosAPI(exList);
            }

            const diasList =
              desempenhoAPI.dias ||
              desempenhoAPI.diasMes ||
              desempenhoAPI.dias_mes ||
              [];
            if (Array.isArray(diasList)) {
              diasMesAPI = diasList;
              setDiasMes(diasMesAPI);
            }
          }
        } catch (apiErr) {
          // erro ao buscar dados da API
        }

        // 🔁 Gerar fallback com dados locais
        let totalTreinosDisponiveis = totalTreinosAPI;
        let datasPlanejadasSet = new Set();
        try {
          const meusTreinosData = await obterMeusTreinos();
          if (meusTreinosData) {
            datasPlanejadasSet = gerarDatasPlanejadasNoMes(meusTreinosData);
            totalTreinosDisponiveis = datasPlanejadasSet.size || totalTreinosDisponiveis;
          }
        } catch (err) {
          // erro ao buscar meus treinos
        }

        // Se a API já trouxe dias do mês, marcar quais desses dias são planejados
        if (Array.isArray(diasMesAPI) && diasMesAPI.length > 0) {
          try {
            const mappedWithPlanned = diasMesAPI.map(d => {
              const dateStr = d.date || d.data || (d.raw && d.raw.dataRealizacao) || null;
              const dayNum = dateStr ? new Date(dateStr).getDate() : (d.day || 0);
              const isoDate = dateStr && dateStr.includes('-') ? dateStr.split('T')[0] : (dateStr ? (() => {
                // if date is in DD/MM/YYYY, convert
                if (dateStr.includes('/')) {
                  const parts = dateStr.split('/');
                  if (parts.length >= 3) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                }
                return dateStr;
              })() : dateStr);
              const planned = isoDate ? datasPlanejadasSet.has(isoDate) : false;
              return { date: isoDate || dateStr, day: dayNum, planned, done: !!d.realizado, raw: d.raw || d };
            });
            setDiasMes(mappedWithPlanned);
          } catch (e) {
            // falha ao marcar planned nos dias da API
          }
        }

        // 🔢 Calcular progresso
        const diasRegistrados = obterDiasComTreinoRealizado?.() || [];
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();
        const diasRegistradosNoMes = diasRegistrados.filter((ds) => {
          const dt = new Date(ds);
          return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
        });

        // 📅 Construir diasMes se não veio da API
        if (!Array.isArray(diasMesAPI) || diasMesAPI.length === 0) {
          atualizarCalendarioComDiasRealizados(datasPlanejadasSet);
        }

        // 📅 Obter data do último treino realizado (se não veio da API, usar local)
        let ultimaTreinoData = ultimaTreinoDataAPI;
        if (!ultimaTreinoData) {
          // Tentar obter do contexto local
          const ultimasRealizacoes = obterUltimasRealizacoes ? obterUltimasRealizacoes() : [];
          if (ultimasRealizacoes.length > 0) {
            const mais_recente = ultimasRealizacoes[0];
            try {
              const dataFormatada = new Date(mais_recente.data);
              if (!isNaN(dataFormatada.getTime())) {
                ultimaTreinoData = dataFormatada.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });
              }
            } catch (err) {
              // Error formatting local date
            }
          }
        }

        // Preferir dados da API se disponíveis; senão usar fallback local
        // Preferir o número de treinos planejados do calendário (datasPlanejadasSet)
        // pois representa quantos treinos a conta tem no mês (ex: 23)
        const totalPlanejados = (datasPlanejadasSet && datasPlanejadasSet.size > 0)
          ? datasPlanejadasSet.size
          : (totalTreinosAPI > 0 ? totalTreinosAPI : totalTreinosDisponiveis);
        const realizados = treinosRealizadosAPI > 0 ? treinosRealizadosAPI : diasRegistradosNoMes.length;
        const progressoGeral =
          totalPlanejados > 0
            ? Math.round((realizados / totalPlanejados) * 100)
            : 0;

        setDadosDesempenho({
          mesAno: new Date().toLocaleString('pt-BR', {
            month: 'long',
            year: 'numeric',
          }),
          progressoGeral,
          treinosRealizados: realizados,
          treinosTotal: totalPlanejados,
          ultimoTreino: ultimaTreinoData || '',
        });

        // dados processados com sucesso
      } catch (error) {
        // erro ao buscar desempenho
      }
    };

    carregarDesempenho();

    // Recarregar quando voltar para a tela (quando o usuário finalizar um treino)
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDesempenho();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigation, obterUltimasRealizacoes, obterTotalDiasComTreinoRealizado, obterDiasComTreinoRealizado]);

  // ✅ Monitorar mudanças nos dias realizados e atualizar calendário em tempo real
  useEffect(() => {
    try {
      const diasRegistrados = obterDiasComTreinoRealizado?.() || [];
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      
      if (diasRegistrados.length > 0) {
        
        // Obter o conjunto de datas planejadas usando a função auxiliar
        const gerarDatasPlanejadasNoMes = (meusTreinosDataLocal) => {
          const treinosArray = Array.isArray(meusTreinosDataLocal)
            ? meusTreinosDataLocal
            : meusTreinosDataLocal?.treinos || meusTreinosDataLocal?.dias || meusTreinosDataLocal?.items || [];

          const resultado = new Set();
          if (!treinosArray || treinosArray.length === 0) return resultado;

          const diaMap = {
            'domingo': 0, 'segunda': 1, 'terca': 2, 'terça': 2, 'quarta': 3,
            'quinta': 4, 'sexta': 5, 'sabado': 6, 'sábado': 6,
          };

          treinosArray.forEach((treino) => {
            const possibleDias = treino.dias || treino.diasSemana || treino.weekdays || [];
            if (Array.isArray(possibleDias) && possibleDias.length > 0) {
              const weekdayIndices = new Set();
              possibleDias.forEach(item => {
                if (typeof item === 'number') weekdayIndices.add(((item % 7) + 7) % 7);
                else if (typeof item === 'string') {
                  const lk = item.toLowerCase();
                  if (diaMap[lk] !== undefined) weekdayIndices.add(diaMap[lk]);
                }
              });
              if (weekdayIndices.size > 0) {
                for (let d = 1; d <= 31; d++) {
                  const dt = new Date(anoAtual, mesAtual, d);
                  if (dt.getMonth() !== mesAtual) break;
                  if (weekdayIndices.has(dt.getDay())) resultado.add(dt.toISOString().split('T')[0]);
                }
              }
            }
          });
          return resultado;
        };

        obterMeusTreinos().then(meusTreinosData => {
          const datasPlanejadasSet = meusTreinosData ? gerarDatasPlanejadasNoMes(meusTreinosData) : new Set();
          atualizarCalendarioComDiasRealizados(datasPlanejadasSet);
        }).catch(err => {
          atualizarCalendarioComDiasRealizados(new Set());
        });
      }
    } catch (err) {
      // erro no useEffect de monitoramento
    }
  }, [obterDiasComTreinoRealizado]);

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (tela) => {
    handleFecharMenu();
    if (navigation) navigation.navigate(tela);
  };

  const logoutColor = '#E24B4B';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors.primary} />
      <View style={[styles.topSection, { backgroundColor: colors.primary }]}>
        <DesempenhoHeader navigation={navigation} />
        <Text style={[styles.monthYearText, { color: colors.headerText, paddingHorizontal: 20 }]}>{dadosDesempenho.mesAno} </Text>
        <View style={[styles.progressContainer, { paddingHorizontal: 20 }]}>
          <View style={[styles.progressBar, { backgroundColor: colors.headerText }]}>
            <View style={[styles.progressFill, { width: `${dadosDesempenho.progressoGeral}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.headerText }]}>{dadosDesempenho.progressoGeral}%</Text>
        </View>
      </View>
      <View style={[styles.bottomSection, { backgroundColor: colors.background }]}>
        <View style={styles.progressTitleContainer}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Progresso</Text>
           <Image 
             source={require('../../../assets/icons/imageGráficoProgresso.png')} 
             style={styles.progressTitleIcon}
             resizeMode="contain"
           />
        </View>
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCard, { backgroundColor: colors.primary }]}>
               <Image 
                 source={require('../../../assets/icons/imageGráfico.png')} 
                 style={styles.iconImage}
                 resizeMode="contain"
                 tintColor="#ffffff"
               />
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Treinos realizados esse mês</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {dadosDesempenho.treinosRealizados}/{dadosDesempenho.treinosTotal}
              </Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={[styles.iconCard, { backgroundColor: colors.primary }]}>
               <Image 
                 source={require('../../../assets/icons/imageGráfico.png')} 
                 style={styles.iconImage}
                 resizeMode="contain"
                 tintColor="#ffffff"
               />
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Ultimo treino realizado</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{dadosDesempenho.ultimoTreino}</Text>
            </View>
          </View>
        </View>
        {/* Últimos exercícios removidos por privacidade */}
      </View>

      {/* Menu lateral/modal — adaptado para ficar igual ao HeaderProfessores */}
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
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#ffffff' : '#2c2c2c' }]}>
            <Text style={[styles.menuTitle, { color: isDark ? '#333333' : '#E6E8F3' }]}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Home")}
            >
              <Ionicons name="home-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Chat")}
            >
              <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Loja")}
            >
              <Ionicons name="cart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaFavoritos")}
            >
              <Ionicons name="heart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("LojaReservas")}
            >
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavegar("Desempenho")}
            >
              <Ionicons name="bar-chart-outline" size={24} color={isDark ? '#D3D8EB' : '#333333'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#D3D8EB' : '#333333' }]}>Desempenho</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Desempenho;
