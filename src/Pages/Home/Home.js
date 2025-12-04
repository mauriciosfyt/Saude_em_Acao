import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path, Circle, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { obterDesempenhoSemanal, obterHistoricoAnualExercicios } from '../../Services/api';


// --- Constantes de Tema ---
const COLORS = {
  primary: '#2C2C2C', // Fundo cinza escuro
  secondary: '#405CBA', // Azul vibrante
  white: '#FFFFFF',
  lightGray: '#2C2C2C', // Fundo cinza escuro
  gray: '#D9D9D9', // Cinza claro para textos secundários
  cardBackground: '#3A3A3A', // Fundo dos cards (cinza médio)
};

const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// --- Componente FeatureButton ---
const FeatureButton = ({ iconName, label, onPress, colors }) => {
  return (
    <TouchableOpacity style={[styles.featureButtonContainer, { backgroundColor: colors.cardBackground }]} onPress={onPress}>
      <MaterialCommunityIcons name={iconName} size={40} color={colors.primary} />
      <Text style={[styles.featureButtonLabel, { color: colors.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// --- Card de Analytics (gráfico de barras como na imagem) ---
const AnalyticsCard = ({ onPress, colors, dadosDesempenho, loading, historicoAnual, loadingHistorico, desempenhoSemanal, loadingDesempenhoSemanal }) => {
  // Note: kept original area/bar graphs; we'll show annual bars when provided via props
  
	// ---------- NOVO: Validação e normalização robusta dos dados ----------
	const validarENormalizar = (dados) => {
		const reasons = [];
		let normalized = [];

		if (!dados) {
			reasons.push('Resposta vazia da API');
			return { normalized: [], isValid: false, reasons };
		}

		// Se já é array de treinos
		if (Array.isArray(dados) && dados.length > 0) {
			normalized = dados.map(item => ({ ...item }));
			// verificar se pelo menos um item tem campo de data
			const temData = normalized.some(t => !!(t.data || t.date || t.dataRealizacao || t.createdAt || t.dataRegistro));
			if (!temData) reasons.push('Itens do array sem campo de data');
			return { normalized, isValid: temData, reasons };
		}

		// Se for objeto de estatísticas
		if (typeof dados === 'object') {
			const count = Number(dados.treinosRealizadosMesAtual) || 0;
			const last = dados.dataUltimoTreino || dados.dataUltimo || dados.ultimoTreino;
			if (count <= 0) reasons.push('treinosRealizadosMesAtual igual a 0 ou ausente');
			if (!last) reasons.push('dataUltimoTreino ausente');

			// Se houver contagem e data, replicar itens com essa data
			if (count > 0 && last) {
				normalized = Array.from({ length: count }, () => ({ data: last }));
				return { normalized, isValid: true, reasons };
			}

			// Se só tem contagem sem data: criar entradas com data atual (fallback) mas marcar como inválido
			if (count > 0 && !last) {
				const today = new Date().toISOString();
				normalized = Array.from({ length: count }, () => ({ data: today }));
				reasons.push('usando data atual como fallback (sem dataUltimoTreino)');
				return { normalized, isValid: false, reasons };
			}

			// nenhum dado útil
			return { normalized: [], isValid: false, reasons };
		}

		// formato desconhecido
		reasons.push('Formato de resposta desconhecido');
		return { normalized: [], isValid: false, reasons };
	};

	// Usar validação/normalização memoizada
	const { normalized: treinosArrayNormalized, isValid: dadosValidos, reasons: validReasons } = useMemo(() => {
		return validarENormalizar(dadosDesempenho);
	}, [dadosDesempenho]);

	console.log('🔁 [AnalyticsCard] validação:', { dadosValidos, validReasons, treinosArrayNormalized });

  // Processar dados para o gráfico de ÁREA (esquerda) - agora usando treinosArrayNormalized (memoizado)
  const processarDadosArea = useMemo(() => {
     const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
     const hoje = new Date();
     const mesAtual = hoje.getMonth();
     const anoAtual = hoje.getFullYear();
 
    // Contar e agrupar por dia da semana
    const dadosArea = [];
    let acumulado = 0;

    for (let i = 0; i < 5; i++) {
      const diaNome = diasSemana[i];
      let treinosEstedia = 0;

      treinosArrayNormalized.forEach((t, idx) => {
        const dataTreinoStr = t.data || t.date || t.dataRealizacao || t.createdAt || t.dataRegistro || t;
        if (!dataTreinoStr) return;
        try {
          const dataTreino = new Date(dataTreinoStr);
          const diaSemanaTreino = dataTreino.getDay(); // 1 = Segunda ... 5 = Sexta
          const inMonth = dataTreino.getMonth() === mesAtual && dataTreino.getFullYear() === anoAtual;
          if (inMonth && diaSemanaTreino === (i + 1)) {
            treinosEstedia++;
            console.log(`✅ [AnalyticsCard] treino ${idx} => ${dataTreino.toISOString()} (diaSemana=${diaSemanaTreino}) entra em ${diaNome}`);
          } else {
            if (inMonth) {
              console.log(`ℹ️ [AnalyticsCard] treino ${idx} => ${dataTreino.toISOString()} (diaSemana=${diaSemanaTreino}) não entra em ${diaNome}`);
            }
          }
        } catch (err) {
          console.log('❌ [AnalyticsCard] erro parse data:', err);
        }
      });

      acumulado += treinosEstedia;
      dadosArea.push({ dia: diaNome, treinos: acumulado, valor: acumulado });
    }

    console.log('📈 [AnalyticsCard] dadosArea gerados:', dadosArea);
    return dadosArea;
  }, [treinosArrayNormalized]);
 
  // Processar dados para o gráfico de BARRAS (direita) - prioritário: usar desempenhoSemanal da API se disponível
  const processarDadosBarras = useMemo(() => {
    const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    
    // Se houver dados estruturados do desempenho semanal da API (array de { dia, realizado })
    if (Array.isArray(desempenhoSemanal) && desempenhoSemanal.length > 0) {
      const keyMapping = {
        'segunda': 0, 'seg': 0, 'monday': 0, 'mon': 0, 'segunda-feira': 0,
        'terça': 1, 'ter': 1, 'tuesday': 1, 'tue': 1, 'terça-feira': 1,
        'quarta': 2, 'qua': 2, 'wednesday': 2, 'wed': 2, 'quarta-feira': 2,
        'quinta': 3, 'qui': 3, 'thursday': 3, 'thu': 3, 'quinta-feira': 3,
        'sexta': 4, 'sex': 4, 'friday': 4, 'fri': 4, 'sexta-feira': 4,
      };
      
      const dadosBarras = Array.from({ length: 5 }, (_, idx) => ({
        dia: diasSemana[idx],
        treinos: 0,
        valor: 0,
      }));
      
      // Mapear dados da API
      desempenhoSemanal.forEach((item) => {
        if (item && item.dia) {
          const cleanKey = String(item.dia).toLowerCase().trim();
          const dayIdx = keyMapping[cleanKey];
          
          if (dayIdx !== undefined && dayIdx >= 0 && dayIdx < 5) {
            // Interpretar realizado: true = 100%, false = 0% (ou contar como 1 treino se realizado)
            const value = item.realizado ? 1 : 0;
            dadosBarras[dayIdx] = {
              dia: diasSemana[dayIdx],
              treinos: value,
              valor: value * 100, // Converter para percentual para manter compatibilidade
            };
          }
        }
      });
      
      console.log('📊 [AnalyticsCard] dadosBarras gerados da API (desempenhoSemanal array):', dadosBarras);
      return dadosBarras;
    }

    // Fallback: processar a partir de treinosArrayNormalized (método anterior)
     const hoje = new Date();
     const mesAtual = hoje.getMonth();
     const anoAtual = hoje.getFullYear();
 
     const dadosBarras = [];
 
     for (let i = 0; i < 5; i++) {
       const diaNome = diasSemana[i];
       let treinosRealizados = 0;
 
       treinosArrayNormalized.forEach(t => {
         const dataTreinoStr = t.data || t.date || t.dataRealizacao || t.createdAt || t.dataRegistro || t;
         if (dataTreinoStr) {
           try {
             const dataTreino = new Date(dataTreinoStr);
             const diaSemanaTreino = dataTreino.getDay();
             if (
               dataTreino.getMonth() === mesAtual &&
               dataTreino.getFullYear() === anoAtual &&
               diaSemanaTreino === (i + 1)
             ) {
               treinosRealizados++;
             }
           } catch (err) {
             // ignorar
           }
         }
       });
 
       // Normalizar altura: calcular percentual relativo ao total do mês
      const totalNoMes = Math.max(
        treinosArrayNormalized.filter(t => {
          try {
            const d = new Date(t.data || t.date || t);
            return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
          } catch {
            return false;
          }
        }).length,
        1
      );
      const alturaBarra = Math.round((treinosRealizados / totalNoMes) * 100); // 0-100
 
       dadosBarras.push({
         dia: diaNome,
         treinos: treinosRealizados,
         valor: alturaBarra,
       });
     }
 
    console.log('📊 [AnalyticsCard] dadosBarras gerados (fallback):', dadosBarras);
    return dadosBarras;
  }, [treinosArrayNormalized, desempenhoSemanal]);
 
  const dadosArea = processarDadosArea;
  const dadosBarras = processarDadosBarras;
  const mesAno = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const mesAnoFormatado = mesAno.charAt(0).toUpperCase() + mesAno.slice(1);

  // Calcular total de treinos do mês para o eixo Y
  const calcularTotalTreinosMes = () => {
    let total = 0;

    if (Array.isArray(dadosDesempenho) && dadosDesempenho.length > 0) {
      total = dadosDesempenho.length;
    } else if (dadosDesempenho && typeof dadosDesempenho === 'object' && !Array.isArray(dadosDesempenho)) {
      total = dadosDesempenho.treinosRealizadosMesAtual || 0;
    }

    return total;
  };

  const totalTreinosMes = calcularTotalTreinosMes();

  // If component receives anual data via props, it will be passed as dadosDesempenho (object) from Home
  // But we'll also allow separate prop `historicoAnual` if caller provides it. For now keep logic in Home.
  
  // Debug: Verificar dados
  console.log('🔍 [AnalyticsCard] dadosDesempenho:', dadosDesempenho);
  console.log('🔍 [AnalyticsCard] historicoAnual:', historicoAnual);
  console.log('🔍 [AnalyticsCard] loading:', loading, 'loadingHistorico:', loadingHistorico);
  console.log('🔍 [AnalyticsCard] totalTreinosMes:', totalTreinosMes);
  console.log('🔍 [AnalyticsCard] dataUltimoTreino:', dadosDesempenho?.dataUltimoTreino);
  if (dadosDesempenho?.dataUltimoTreino) {
    console.log('🔍 [AnalyticsCard] Dia da semana do treino:', new Date(dadosDesempenho.dataUltimoTreino).getDay());
  }

  // Calcular valores do eixo Y: 0, 1, 2, 3, 4, 5... baseado na contagem real de treinos
  // Determinar o intervalo apropriado baseado no total de treinos do mês
  let intervalo = 1;
  if (totalTreinosMes > 20) {
    intervalo = 5;
  } else if (totalTreinosMes > 10) {
    intervalo = 2;
  }
  
  // Calcular o máximo da régua
  const maxValorY = Math.ceil(totalTreinosMes / intervalo) * intervalo || intervalo;
  
  // Criar valores do eixo Y sem duplicatas
  const valoresY = [];
  for (let i = 0; i <= 4; i++) {
    const valor = (i / 4) * maxValorY;
    valoresY.push(Math.round(valor));
  }
  
  // Remover duplicatas mantendo a ordem
  const valoresYUnicos = [...new Set(valoresY)].sort((a, b) => a - b);
  
  // Preencher até ter 5 valores se necessário
  while (valoresYUnicos.length < 5) {
    const ultimoValor = valoresYUnicos[valoresYUnicos.length - 1];
    valoresYUnicos.push(ultimoValor + intervalo);
  }
  
  // Inverter a ordem dos valores Y para que 0 fique embaixo
  const valoresYInvertidos = [...valoresYUnicos].reverse();
  
  // Se não houver dados, mostrar mensagem
  const temDados = (treinosArrayNormalized && treinosArrayNormalized.length > 0) || (dadosDesempenho && dadosDesempenho.treinosRealizadosMesAtual > 0);
  if (!loading && !temDados && !historicoAnual) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.analyticsMonth, { color: colors.textPrimary }]}>
          {mesAnoFormatado}
        </Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Nenhum treino realizado ainda</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Calcular dimensões do gráfico de barras (usar as mesmas para alinhar o gráfico de área)
  const barChartWidth = 130;
  const barChartHeight = 90;
  const barWidth = 18;
  const barSpacing = 12; // Reduzido para que todas as barras caibam dentro do retângulo
  const maxBarHeight = 70;
  const totalBarsWidth = (dadosBarras.length * barWidth) + ((dadosBarras.length - 1) * barSpacing);
  const barStartX = (barChartWidth - totalBarsWidth) / 2;


  // Função para gerar path do gráfico de área com curva suave (estilo recharts)
  const gerarPathArea = (dados) => {
    if (!dados || dados.length === 0) {
      return { pathArea: '', pathLine: '', pontos: [] };
    }
    
    const width = 130;
    const height = 90;
    const padding = 10;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Usar o último valor acumulado como máximo (total de treinos do mês)
    const maxValue = Math.max(...dados.map(d => d.treinos), 1);
    
    // Distribuição uniforme dos pontos
    const pontos = dados.map((d, index) => {
      const divisor = dados.length > 1 ? dados.length - 1 : 1;
      const x = padding + (index / divisor) * chartWidth;
      const y = padding + chartHeight - (d.treinos / maxValue) * chartHeight;
      return { x, y };
    });

    // Função para criar curva suave (monotone) como no recharts
    const criarCurvaMonotone = (pontos) => {
      if (pontos.length < 2) return '';
      
      let path = `M ${pontos[0].x} ${pontos[0].y}`;
      
      for (let i = 0; i < pontos.length - 1; i++) {
        const p0 = pontos[Math.max(0, i - 1)];
        const p1 = pontos[i];
        const p2 = pontos[i + 1];
        const p3 = pontos[Math.min(pontos.length - 1, i + 2)];
        
        // Calcular pontos de controle para curva suave (Catmull-Rom spline)
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      
      return path;
    };

    // Criar path para linha com curva suave
    const pathLine = criarCurvaMonotone(pontos);

    // Criar path para área preenchida
    const bottomY = height - padding;
    let pathArea = `M ${pontos[0].x} ${bottomY}`;
    pathArea += ` L ${pontos[0].x} ${pontos[0].y}`;
    pathArea += criarCurvaMonotone(pontos).substring(1); // Remover o M inicial
    pathArea += ` L ${pontos[pontos.length - 1].x} ${bottomY} Z`;

    return { pathArea, pathLine, pontos };
  };

  const { pathArea, pathLine, pontos } = gerarPathArea(dadosArea);

  // Construir o conteúdo interno do card (spinner + gráfico padrão)
  let innerContent = null;
  if (loading || loadingHistorico || loadingDesempenhoSemanal) {
    innerContent = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando dados...</Text>
      </View>
    );
  } else {
    // Fallback: conteúdo original (área + barras semanais)
    innerContent = (
      <View style={styles.analyticsInner}>
        {/* Área (esquerda) - 12 barras mensais se historicoAnual, ou gráfico de área semanal */}
        <View style={styles.areaWrapper}>
          {historicoAnual ? (
            // --- RENDERIZAR GRÁFICO DE ÁREA (ONDINHA) COM 12 MESES ---
            <View>
              {(() => {
                const mesesPt = { 
                  janeiro:0, fevereiro:1, março:2, marco:2, abril:3, maio:4, junho:5, 
                  julho:6, agosto:7, setembro:8, outubro:9, novembro:10, dezembro:11 
                };
                const counts = Array.from({ length: 12 }, () => 0);
                
                // Extrair o array de resumo mensal
                let resumo = [];
                if (historicoAnual.resumoMensal && Array.isArray(historicoAnual.resumoMensal)) {
                  resumo = historicoAnual.resumoMensal;
                } else if (Array.isArray(historicoAnual)) {
                  resumo = historicoAnual;
                }
                
                if (resumo.length > 0) {
                  resumo.forEach((item) => {
                    const mesName = String(item.mes || item.nome || '').toLowerCase().trim();
                    const total = Number(item.totalExercicios || item.total || 0) || 0;
                    const normalized = mesName.normalize ? mesName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : mesName;
                    const monthIndex = mesesPt[normalized];
                    if (monthIndex !== null && monthIndex !== undefined) {
                      counts[monthIndex] = total;
                    }
                  });
                }

                const maxCount = Math.max(...counts, 1);
                const svgHeight = 90;
                const svgWidth = 150;
                const chartPadding = 30;
                const chartWidth = svgWidth - chartPadding;
                const chartHeight = svgHeight - 15;

                // Calcular eixo Y
                let intervaloY = 1;
                if (maxCount > 20) intervaloY = 5;
                else if (maxCount > 10) intervaloY = 2;
                const maxY = Math.ceil(maxCount / intervaloY) * intervaloY || intervaloY;
                const valoresYMensal = [];
                for (let i = 0; i <= 4; i++) {
                  const v = (i / 4) * maxY;
                  valoresYMensal.push(Math.round(v));
                }
                const valoresYMensalInv = [...new Set(valoresYMensal)].reverse();

                // Gerar pontos para o gráfico de área (12 meses)
                const pontosMensal = counts.map((count, idx) => {
                  const divisor = 11; // 12 pontos = 11 intervalos
                  const x = chartPadding + (idx / divisor) * (svgWidth - chartPadding - 5);
                  const y = chartHeight - 10 - (count / maxCount) * (chartHeight - 20);
                  return { x, y, count };
                });

                // Criar curva suave (Catmull-Rom spline) como no gráfico original
                const criarCurvaMonotone = (pontos) => {
                  if (pontos.length < 2) return '';
                  
                  let path = `M ${pontos[0].x} ${pontos[0].y}`;
                  
                  for (let i = 0; i < pontos.length - 1; i++) {
                    const p0 = pontos[Math.max(0, i - 1)];
                    const p1 = pontos[i];
                    const p2 = pontos[i + 1];
                    const p3 = pontos[Math.min(pontos.length - 1, i + 2)];
                    
                    const cp1x = p1.x + (p2.x - p0.x) / 6;
                    const cp1y = p1.y + (p2.y - p0.y) / 6;
                    const cp2x = p2.x - (p3.x - p1.x) / 6;
                    const cp2y = p2.y - (p3.y - p1.y) / 6;
                    
                    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
                  }
                  
                  return path;
                };

                const pathLineMensal = criarCurvaMonotone(pontosMensal);
                
                // Criar path para área preenchida
                const bottomY = chartHeight - 10;
                let pathAreaMensal = `M ${pontosMensal[0].x} ${bottomY}`;
                pathAreaMensal += ` L ${pontosMensal[0].x} ${pontosMensal[0].y}`;
                pathAreaMensal += pathLineMensal.substring(1);
                pathAreaMensal += ` L ${pontosMensal[pontosMensal.length - 1].x} ${bottomY} Z`;

                return (
                  <View>
                    <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                      {/* Eixo Y esquerdo */}
                      <Line 
                        x1={chartPadding - 5} 
                        y1={5} 
                        x2={chartPadding - 5} 
                        y2={chartHeight - 10} 
                        stroke={colors.textSecondary} 
                        strokeWidth={1} 
                        opacity={0.3} 
                      />

                      {/* Grid horizontal e labels Y */}
                      {valoresYMensalInv.map((valor, idx) => {
                        const yPos = 5 + (idx * (chartHeight - 15) / (valoresYMensalInv.length - 1 || 1));
                        return (
                          <G key={`grid-y-${idx}`}>
                            <Line
                              x1={chartPadding - 5}
                              y1={yPos}
                              x2={svgWidth - 5}
                              y2={yPos}
                              stroke={colors.textSecondary}
                              strokeWidth={0.5}
                              strokeDasharray="2,2"
                              opacity={0.2}
                            />
                            <Line 
                              x1={chartPadding - 8} 
                              y1={yPos} 
                              x2={chartPadding - 5} 
                              y2={yPos} 
                              stroke={colors.textSecondary} 
                              strokeWidth={1} 
                              opacity={0.3} 
                            />
                            <SvgText 
                              x={chartPadding - 12} 
                              y={yPos + 3} 
                              fontSize={8} 
                              fill={colors.textSecondary} 
                              textAnchor="end" 
                              opacity={0.6}
                            >
                              {String(valor)}
                            </SvgText>
                          </G>
                        );
                      })}

                      {/* Área preenchida */}
                      {pathAreaMensal ? <Path d={pathAreaMensal} fill={colors.primary} fillOpacity={0.3} /> : null}
                      
                      {/* Linha da curva */}
                      {pathLineMensal ? <Path d={pathLineMensal} fill="none" stroke={colors.primary} strokeWidth={2} /> : null}
                      
                      {/* Pontos nos dados */}
                      {pontosMensal.map((p, idx) => (
                        <Circle 
                          key={`point-${idx}`} 
                          cx={p.x} 
                          cy={p.y} 
                          r={3} 
                          fill="#FFFFFF" 
                          stroke={colors.primary} 
                          strokeWidth={1.5} 
                        />
                      ))}
                    </Svg>

                    {/* Labels dos meses (J, F, M, A, M, J, J, A, S, O, N, D) */}
                    <View style={{ 
                      width: svgWidth, 
                      flexDirection: 'row', 
                      justifyContent: 'space-around',
                      paddingHorizontal: chartPadding - 10,
                      marginTop: 2
                    }}>
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((label, idx) => (
                        <Text 
                          key={`month-label-${idx}`} 
                          style={{ 
                            fontSize: 8, 
                            color: colors.textSecondary, 
                            textAlign: 'center'
                          }}
                        >
                          {label}
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })()}
            </View>
          ) : (
            // --- RENDERIZAR GRÁFICO DE ÁREA ORIGINAL (5 dias) ---
            <View>
              <Svg width={150} height={90} viewBox="0 0 150 90">
                {/* Eixo Y */}
                <Line x1={25} y1={10} x2={25} y2={80} stroke={colors.textSecondary} strokeWidth={1} opacity={0.3} />
                
                {/* Grid horizontal */}
                {valoresYInvertidos.map((valor, idx) => {
                  const yPos = 10 + (idx * 17.5);
                  return (
                    <Line
                      key={`grid-${idx}`}
                      x1={25}
                      y1={yPos}
                      x2={145}
                      y2={yPos}
                      stroke={colors.textSecondary}
                      strokeWidth={0.5}
                      strokeDasharray="2,2"
                      opacity={0.2}
                    />
                  );
                })}

                {/* Labels Y */}
                {valoresYInvertidos.map((valor, idx) => {
                  const yPos = 10 + (idx * 17.5);
                  return (
                    <G key={`label-y-${idx}`}>
                      <Line x1={23} y1={yPos} x2={25} y2={yPos} stroke={colors.textSecondary} strokeWidth={1} opacity={0.3} />
                      <SvgText x={20} y={yPos + 3} fontSize={9} fill={colors.textSecondary} textAnchor="end" opacity={0.6}>
                        {String(valor)}
                      </SvgText>
                    </G>
                  );
                })}

                {/* Área e linha do gráfico */}
                <G x={30}>
                  {pathArea ? <Path d={pathArea} fill={colors.primary} fillOpacity={0.3} /> : null}
                  {pathLine ? <Path d={pathLine} fill="none" stroke={colors.primary} strokeWidth={2} /> : null}
                  {pontos.map((p, idx) => (
                    <Circle key={idx} cx={p.x} cy={p.y} r={3} fill="#FFFFFF" stroke={colors.primary} strokeWidth={1.5} />
                  ))}
                </G>
              </Svg>

              {/* Labels dos dias (Seg, Ter, Qua, Qui, Sex) */}
              <View style={[styles.weekdaysRow, { justifyContent: 'flex-start', marginTop: 2 }]}>
                <View style={{ flex: 0.2 }} />
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, idx) => (
                  <Text
                    key={`day-${idx}`}
                    style={[
                      styles.weekdayText,
                      {
                        color: colors.textPrimary,
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 8
                      },
                    ]}
                  >
                    {dia}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={[styles.analyticsDivider, { backgroundColor: colors.divider }]} />

        <View style={styles.barWrapper}>
          {dadosBarras && dadosBarras.length > 0 ? (
            <Svg width={barChartWidth} height={barChartHeight} viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}>
              {dadosBarras.map((d, idx) => {
                const barHeight = (d.valor / 100) * maxBarHeight;
                const barX = barStartX + (idx * (barWidth + barSpacing));
                const barY = barChartHeight - 10 - barHeight;
                return <Rect key={idx} x={barX} y={barY} width={barWidth} height={barHeight} rx={4} fill={colors.primary} />;
              })}
            </Svg>
          ) : (
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Sem dados</Text>
          )}
          <View style={[styles.weekdaysRow, { justifyContent: 'flex-start', marginTop: 2 }]}>
            <View style={{ flex: barStartX }} />
            {dadosBarras.map((d, idx) => (
              <Text
                key={d.dia}
                style={[
                  styles.weekdayText,
                  {
                    color: colors.textPrimary,
                    flex: barWidth + barSpacing,
                    textAlign: 'center',
                  },
                ]}
              >
                {d.dia}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.analyticsMonth, { color: colors.textPrimary }]}>
        {mesAnoFormatado}
      </Text>

      {/* ...existing rendering (loading / gráficos) ... */}
      {innerContent}
    </TouchableOpacity>
  );
};

// --- Componente Principal da Tela: Home ---
const Home = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [dadosDesempenho, setDadosDesempenho] = useState(null); // Mudado para null para distinguir objeto de array
  const [loadingDesempenho, setLoadingDesempenho] = useState(true);
  const [historicoAnual, setHistoricoAnual] = useState(null);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [desempenhoSemanal, setDesempenhoSemanal] = useState(null);
  const [loadingDesempenhoSemanal, setLoadingDesempenhoSemanal] = useState(true);

  // Buscar dados de desempenho da API
  useEffect(() => {
    let mounted = true;
    
    const carregarDesempenho = async () => {
      try {
        setLoadingDesempenho(true);
        console.log('📊 [Home] Buscando dados de desempenho...');
        const dados = await obterDesempenhoSemanal();
        if (!mounted) return;

        console.log('📊 [Home] Dados recebidos da API:', dados);

        // Verificar se a API retornou dados estruturados por dia da semana (ARRAY de { dia, realizado })
        // Formato esperado: [{ dia: "SEGUNDA", realizado: true }, ...]
        if (Array.isArray(dados) && dados.length > 0) {
          // Verificar se primeiro elemento tem propriedade 'dia'
          if (dados[0] && ('dia' in dados[0] || 'realizado' in dados[0])) {
            console.log('📊 [Home] Dados de desempenho semanal (array) detectados');
            setDesempenhoSemanal(dados);
          }
        }

        // Verificar se a API retornou dados estruturados por dia da semana (OBJETO)
        // Formato esperado: { seg: num, ter: num, qua: num, qui: num, sex: num } ou similar
        if (typeof dados === 'object' && dados !== null && !Array.isArray(dados)) {
          const diasSemana = ['seg', 'ter', 'qua', 'qui', 'sex'];
          const temDiasSemana = diasSemana.some(dia => dia in dados);
          
          if (temDiasSemana) {
            console.log('📊 [Home] Dados estruturados por dia da semana (objeto) detectados');
            setDesempenhoSemanal(dados);
          }
        }

        // A API retorna um objeto com estatísticas
        // Formato: { treinosRealizadosMesAtual, dataUltimoTreino, totalTreinosCompletos, diasAtivosConsecutivos }
        if (typeof dados === 'object' && dados !== null) {
          // Evitar confundir array de desempenho semanal com array de treinos
          const ehArrayDesempenhoSemanal = Array.isArray(dados) && dados.length > 0 && dados[0] && ('dia' in dados[0] || 'realizado' in dados[0]);
          
          if (!ehArrayDesempenhoSemanal) {
            // Se tiver array de treinos, usar
            if (Array.isArray(dados.treinos) || Array.isArray(dados.items) || Array.isArray(dados.data) || Array.isArray(dados.registros)) {
              const treinosArray = dados.treinos || dados.items || dados.data || dados.registros;
              console.log('📊 [Home] Treinos processados (array):', treinosArray.length, treinosArray);
              setDadosDesempenho(treinosArray);
            } else if (Array.isArray(dados)) {
              // Se for array direto (e não é desempenho semanal)
              console.log('📊 [Home] Treinos processados (array direto):', dados.length, dados);
              setDadosDesempenho(dados);
            } else {
              // Se for objeto com estatísticas, salvar o objeto completo
              console.log('📊 [Home] Dados recebidos como objeto de estatísticas:', dados);
              console.log('📊 [Home] Treinos realizados no mês:', dados.treinosRealizadosMesAtual || 0);
              console.log('📊 [Home] Data último treino:', dados.dataUltimoTreino);
              // Salvar o objeto completo para usar no gráfico
              setDadosDesempenho(dados);
            }
          }
        } else {
          setDadosDesempenho(null);
        }
      } catch (error) {
        console.error('❌ [Home] Erro ao buscar desempenho semanal:', error);
        setDadosDesempenho([]);
      } finally {
        if (mounted) {
          setLoadingDesempenho(false);
          setLoadingDesempenhoSemanal(false);
        }
      }
    };

    carregarDesempenho();

    // carregar histórico anual (ano atual)
    const carregarHistoricoAnual = async (ano) => {
      try {
        setLoadingHistorico(true);
        const anoBusca = ano || new Date().getFullYear();
        console.log('📅 [Home] Buscando histórico anual de exercícios para', anoBusca);
        const resp = await obterHistoricoAnualExercicios(anoBusca);
        console.log('📅 [Home] histórico anual recebido:', resp);
        console.log('📅 [Home] historicoAnual.resumoMensal:', resp?.resumoMensal);
        setHistoricoAnual(resp);
      } catch (err) {
        console.error('❌ [Home] Erro ao buscar histórico anual:', err);
        setHistoricoAnual(null);
      } finally {
        setLoadingHistorico(false);
      }
    };

    carregarHistoricoAnual();

    // Recarregar quando voltar para a tela (quando o usuário finalizar um treino)
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 [Home] Tela ganhou foco, recarregando dados...');
      carregarDesempenho();
      carregarHistoricoAnual();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const features = [
    { id: 1, icon: 'account-group-outline', label: 'Professores', screen: 'Professores' },
    { id: 2, icon: 'weight-lifter', label: 'Meus treinos', screen: 'MeuTreino' },
    { id: 3, icon: 'cart-outline', label: 'Nossa loja', screen: 'Loja' },
    { id: 4, icon: 'account-circle-outline', label: 'Meu plano', screen: 'Plano' },
  ];

  // Criar estilos dinâmicos baseados no tema
  const dynamicStyles = useMemo(() => ({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: SIZES.medium,
    },
    headerInline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SIZES.small,
      marginBottom: SIZES.small,
      paddingHorizontal: 0,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: SIZES.large,
      fontWeight: '700',
      color: colors.textPrimary,
      // text shadow: use CSS shorthand on web, native props on mobile
      ...Platform.select({
        web: { textShadow: '0px 0px 10px rgba(64,92,186,0.3)' },
        default: {
          // Mobile: textShadow* não suportados nativamente
        },
      }),
    },
    welcomeSection: {
      marginTop: SIZES.small,
      marginBottom: SIZES.large,
    },
    h1: {
      fontSize: SIZES.xlarge,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    body2: {
      fontSize: SIZES.font,
      color: colors.textSecondary,
      marginTop: SIZES.base / 2,
    },
    analyticsCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      paddingVertical: SIZES.medium,
      paddingHorizontal: SIZES.medium,
      marginBottom: SIZES.large,
      ...(Platform.OS === 'web'
        ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' }
        : {
            elevation: 3,
          }),
    },
    analyticsMonth: {
      position: 'absolute',
      top: 8,
      right: 12,
      color: colors.textPrimary,
      fontSize: 12,
    },
    analyticsInner: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: SIZES.small,
      paddingHorizontal: SIZES.small,
    },
    areaWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    areaBox: {
      width: '85%',
      height: 90,
      backgroundColor: '#5B84E2',
      borderRadius: 6,
      position: 'relative',
    },
    areaDot: {
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#FFFFFF',
    },
    monthLabel: {
      marginTop: 8,
      fontSize: 12,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    analyticsDivider: {
      width: 1,
      height: 100,
      backgroundColor: colors.divider,
      marginHorizontal: SIZES.small,
      opacity: 0.3,
    },
    barWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    barsRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '85%',
      height: 90,
    },
    bar: {
      width: 18,
      borderRadius: 4,
      backgroundColor: '#405CBA', // Azul vibrante
    },
    weekdaysRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      marginTop: 6,
      paddingHorizontal: 0,
    },
    featureButtonContainer: {
      backgroundColor: colors.cardBackground,
      width: '48%',
      padding: SIZES.medium,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SIZES.medium,
      aspectRatio: 1,
      ...(Platform.OS === 'web'
        ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' }
        : {
            elevation: 5,
          }),
    },
    featureButtonLabel: {
      fontSize: SIZES.medium,
      fontWeight: '500',
      color: colors.textPrimary,
      marginTop: SIZES.base,
    },
  }), [colors, isDark]);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <StatusBar barStyle={colors.statusBar} />
      <ScrollView
        style={dynamicStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SIZES.large }}
      >
        {/* Logo Dia para tema claro, Prata para tema escuro */}
        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
          <Image
            source={isDark
              ? require('../../../assets/icons/Logo_Prata.png')
              : require('../../../assets/icons/logo_dia.png')}
            style={{ width: 64, height: 64 }}
            resizeMode="contain"
          />
        </View>
        {/* Ícone de perfil alinhado à esquerda e centralizado verticalmente com a logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: -45 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={{ alignSelf: 'flex-start', marginLeft: 290 }}>
            <Ionicons name="person-circle-outline" size={35} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Mensagem de Boas-Vindas --- */}
        <View style={dynamicStyles.welcomeSection}>
          <Text style={dynamicStyles.h1}>Que bom ter você aqui!</Text>
          <Text style={dynamicStyles.body2}>Seja bem vindo a academia saúde em ação!</Text>
        </View>

        {/* --- Card com Gráficos --- */}
        <AnalyticsCard 
          onPress={() => navigation.navigate('Desempenho')} 
          colors={colors}
          dadosDesempenho={dadosDesempenho}
          loading={loadingDesempenho}
          historicoAnual={historicoAnual}
          loadingHistorico={loadingHistorico}
          desempenhoSemanal={desempenhoSemanal}
          loadingDesempenhoSemanal={loadingDesempenhoSemanal}
        />

        {/* --- Grade de Funcionalidades --- */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: SIZES.small }}>
          {features.map((feature) => (
            <FeatureButton
              key={feature.id}
              iconName={feature.icon}
              label={feature.label}
              colors={colors}
              onPress={() => {
                if(feature.screen === 'Perfil'){
                  navigation.navigate('Perfil')
                } else if (feature.screen === 'Loja'){
                  navigation.navigate('Loja')
                }
                else {
                  navigation.navigate(feature.screen)
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Estilos (StyleSheet) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary, // Fundo cinza escuro
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  headerInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.small,
    marginBottom: SIZES.small,
    paddingHorizontal: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
    ...Platform.select({
      web: { textShadow: '0px 0px 10px rgba(64,92,186,0.3)' },
      default: {
        // Mobile: textShadow* não suportados nativamente
      },
    }),
  },
  welcomeSection: {
    marginTop: SIZES.small,
    marginBottom: SIZES.large,
  },
  h1: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.white, // Texto branco
  },
  body2: {
    fontSize: SIZES.font,
    color: COLORS.gray, // Cinza claro
    marginTop: SIZES.base / 2,
  },
  analyticsCard: {
    backgroundColor: COLORS.cardBackground, // Fundo cinza médio
    borderRadius: 16,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.large,
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' },
      default: {
        elevation: 3,
      },
    }),
  },
  analyticsMonth: {
    position: 'absolute',
    top: 8,
    right: 12,
    color: COLORS.white, // Texto branco
    fontSize: 12,
  },
  analyticsInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
    paddingHorizontal: SIZES.small,
  },
  areaWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsDivider: {
    width: 1,
    height: 100,
    backgroundColor: COLORS.gray,
    marginHorizontal: SIZES.small,
    opacity: 0.3,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 6,
    paddingHorizontal: 0,
  },
  weekdayText: {
    fontSize: 10,
    color: COLORS.white, // Texto branco
  },
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  featureButtonContainer: {
    backgroundColor: COLORS.cardBackground, // Fundo cinza médio
    width: '48%',
    padding: SIZES.medium,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    aspectRatio: 1,
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(0,0,0,0.12)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  featureButtonLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.white, // Texto branco
    marginTop: SIZES.base,
  },
  monthlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    marginTop: 10,
    height: 64,
  },
  monthBar: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  monthBarInner: {
    width: 18,
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default Home;