
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    SectionList,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderLoja from '../../../Components/HeaderLoja';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';

// --- 1. IMPORTAR API E CONTEXTO ---
import { obterMinhasReservas } from '../../../Services/api'; 
import { useCart } from '../../../context/CartContext'; 

// --- Função platformShadow ---
const platformShadow = ({
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.15,
    shadowRadius = 4,
    elevation,
    boxShadow,
} = {}) => {
    const offset = shadowOffset ?? { width: 0, height: 2 };
    const radius = shadowRadius ?? 4;
    const opacity = shadowOpacity ?? 0.15;

    if (Platform.OS === 'web') {
        const blur = Math.max(radius * 2, 1);
        return {
            boxShadow: boxShadow ?? `${offset.width}px ${offset.height}px ${blur}px rgba(0,0,0,${opacity})`,
        };
    }

    const nativeShadow = {
        shadowColor,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
    };

    if (typeof elevation === 'number') {
        nativeShadow.elevation = elevation;
    }

    return nativeShadow;
};

// --- Objeto theme (Atualizado com suas cores) ---
const theme = {
    colors: {
        primary: '#4CAF50',
        primaryButton: '#405CBA',
        secondaryButtonBorder: '#A0A0A0',
        background: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666',
        placeholder: '#888888',
        icon: '#555555',
        white: '#FFFFFF',
        border: '#E0E0E0',
        
        // --- CORES DE STATUS ATUALIZADAS ---
        statusAprovada: '#2ecc71',  // Verde solicitado
        statusCancelada: '#e74c3c', // Vermelho solicitado
        statusConcluida: '#0ea5a4', // Azul Petróleo solicitado (Para 'Retirado')
        warning: '#F57C00',         // Laranja (Mantido para 'Em Análise')
        
        gradientStart: '#FFFFFF',
        gradientEnd: '#405CBA',
    },
    spacing: {
        small: 8,
        medium: 12,
        large: 24,
    },
    fontSize: {
        xsmall: 10,
        small: 12,
        regular: 14,
        medium: 16,
        large: 20,
    },
};

// --- Função "Tradução" de Status ---
const mapearStatusUI = (apiStatus) => {
    if (!apiStatus) return 'Indefinido';
    switch (String(apiStatus).toUpperCase()) {
        case 'PENDENTE':
        case 'EM_ANALISE':
            return 'Em Análise';
        case 'APROVADA': 
        case 'APROVADO':
            return 'Aprovado'; 
        case 'RETIRADO':
        case 'CONCLUIDA': 
        case 'CONCLUIDO':
            return 'Retirado'; // Usaremos a cor "Concluida" para este
        case 'CANCELADA': 
        case 'CANCELADO':
        case 'REJEITADO':
            return 'Cancelado';
        default:
            return apiStatus; 
    }
};

// --- getStatusColor (Atualizada) ---
const getStatusColor = (status) => {
    switch (status) {
        case 'Em Análise':
            return theme.colors.warning; // Laranja original
        case 'Aprovado':
            return theme.colors.statusAprovada; // #2ecc71
        case 'Retirado':
            return theme.colors.statusConcluida; // #0ea5a4
        case 'Cancelado':
            return theme.colors.statusCancelada; // #e74c3c
        default:
            return theme.colors.textSecondary;
    }
};

const Reservas = ({ navigation }) => {
    // --- States ---
    const [searchText, setSearchText] = useState("");
    const [reservas, setReservas] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFiltro, setStatusFiltro] = useState('Todos'); 

    const { adicionarAoCarrinho } = useCart();

    // --- Função para Buscar e Transformar os Dados ---
    useEffect(() => {
        const carregarReservas = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const dataApi = await obterMinhasReservas();

                const listaBruta = Array.isArray(dataApi?.content) 
                    ? dataApi.content 
                    : Array.isArray(dataApi) 
                    ? dataApi 
                    : [];
                
                if (!Array.isArray(listaBruta)) {
                     throw new Error("Formato de dados inesperado da API.");
                }

                const reservasFormatadas = listaBruta.map(reserva => {
                    const dataApi = reserva?.dataReserva || reserva?.dataSolicitacao || reserva?.data || reserva?.criadoEm || reserva?.createdAt;
                    const dataFormatada = new Date(dataApi).toLocaleDateString('pt-BR');

                    const statusApi = (reserva.status || '').toUpperCase();
                    const statusTratado = mapearStatusUI(statusApi);

                    const nome = reserva?.produto?.nome || reserva?.produtoNome || reserva?.nome || 'Produto indisponível';
                    const img = reserva?.produto?.img || reserva?.produto?.imagem || reserva?.img || reserva?.imagem || '';
                    
                    const idProduto = reserva?.produto?.id || reserva?.produtoId; 
                    const idReservaItem = reserva?.id; 

                    return {
                        id: idProduto, 
                        idUnicoLista: `${idReservaItem}-${idProduto || 'item'}`,
                        nome: nome,
                        img: img, 
                        imagem: img ? { uri: img } : require('../../../../assets/icon.png'), 
                        status: statusTratado,
                        dataString: dataFormatada, 
                    };
                });

                const reservasAgrupadas = reservasFormatadas.reduce((acc, item) => {
                    const data = item.dataString;
                    const secaoExistente = acc.find(s => s.title === data);
                    
                    if (secaoExistente) {
                        secaoExistente.data.push(item);
                    } else {
                        acc.push({
                            title: data,
                            data: [item],
                        });
                    }
                    return acc;
                }, []);
                
                setReservas(reservasAgrupadas);

            } catch (err) {
                console.error("Erro ao buscar reservas:", err);
                if (err.message === 'Network Error' || (err.message && err.message.includes('Network'))) {
                    setError('Falha de rede. Verifique sua conexão ou se a API está online.');
                } else {
                    setError(err.message || "Não foi possível carregar suas reservas.");
                }
            } finally {
                setLoading(false);
            }
        };

        carregarReservas();
    }, []);

    // --- Função "Comprar Novamente" ---
    const handleComprarNovamente = (item) => {
        const produtoParaCarrinho = {
            ...item,
            imagemUrl: item.img 
        };
        
        adicionarAoCarrinho(produtoParaCarrinho, null);
        Alert.alert("Sucesso!", `${item.nome} foi adicionado ao carrinho.`);
    };

    // --- Componente de Item da Lista (renderItem) ---
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={item.imagem} 
                style={styles.cardImage} 
                defaultSource={require('../../../../assets/icon.png')} 
            />
            <View style={styles.cardInfo}>
                {/* A cor é aplicada dinamicamente aqui */}
                <Text style={[styles.cardStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
                <Text style={styles.cardName}>{item.nome}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => {
                        if (!item.id) {
                            Alert.alert("Erro", "Este item não possui um ID de produto para visualização.");
                        } else {
                            navigation.navigate('LojaProdutos', { produtoId: item.id });
                        }
                    }}
                >
                    <Text style={styles.primaryButtonText}>Ver produto</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => handleComprarNovamente(item)} 
                >
                    <Text style={styles.secondaryButtonText}>Comprar novamente</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // --- Componente de Cabeçalho da Seção (Data) ---
    const renderSectionHeader = ({ section: { title } }) => {
        if (!title) return null;
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 70 }}>
                    <ActivityIndicator size="large" color={theme.colors.primaryButton} />
                    <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>Buscando suas reservas...</Text>
                </View>
                <BottomNavBar navigation={navigation} activeScreen="LojaReservas" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, paddingBottom: 70 }}>
                    <Icon name="alert-circle" size={40} color={theme.colors.statusCancelada} />
                    <Text style={{ marginTop: 10, color: theme.colors.statusCancelada, textAlign: 'center' }}>
                        Erro ao carregar: {error}
                    </Text>
                </View>
                <BottomNavBar navigation={navigation} activeScreen="LojaReservas" />
            </SafeAreaView>
        );
    }

    const reservasFiltradas = reservas.map(section => ({
        ...section,
        data: section.data.filter(item => {
            const matchBusca = item.nome.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = (statusFiltro === 'Todos') || (item.status === statusFiltro);
            return matchBusca && matchStatus;
        })
    })).filter(section => section.data.length > 0);

    const filtrosStatus = ['Todos', 'Aprovado', 'Cancelado', 'Em Análise', 'Retirado'];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

            <View style={styles.filtroContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: theme.spacing.medium }}>
                    {filtrosStatus.map(status => (
                        <TouchableOpacity
                        key={status}
                        style={[
                            styles.filtroBotao,
                            statusFiltro === status && styles.filtroBotaoAtivo
                        ]}
                        onPress={() => setStatusFiltro(status)}
                        >
                        <Text style={[
                            styles.filtroTexto,
                            statusFiltro === status && styles.filtroTextoAtivo
                        ]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <SectionList
                sections={reservasFiltradas} 
                keyExtractor={(item) => item.idUnicoLista} 
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ListHeaderComponent={<Text style={styles.title}>Reservas</Text>}
                contentContainerStyle={styles.listContentContainer}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                        <Icon name="inbox" size={40} color={theme.colors.placeholder} />
                        <Text style={{ marginTop: 10, color: theme.colors.placeholder, fontSize: 16, textAlign: 'center' }}>
                            {(searchText || statusFiltro !== 'Todos')
                                ? 'Nenhuma reserva encontrada para os filtros aplicados.'
                                : 'Você ainda não possui reservas.'}
                        </Text>
                    </View>
                )}
            />

           <BottomNavBar navigation={navigation} activeScreen="LojaReservas" />
        </SafeAreaView>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: theme.fontSize.large,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: theme.spacing.large,
        marginBottom: theme.spacing.medium,
        color: theme.colors.text,
    },
    listContentContainer: {
        paddingHorizontal: theme.spacing.medium,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        ...platformShadow({
            boxShadow: '0px 8px 18px rgba(0,0,0,0.12)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }),
    },
    cardImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: theme.spacing.medium,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    cardInfo: {
        flex: 1,
    },
    cardStatus: {
        fontSize: theme.fontSize.small,
        fontWeight: 'bold', // Já estava bold, mantido.
        marginBottom: 4,
    },
    cardName: {
        fontSize: theme.fontSize.regular,
        color: theme.colors.textSecondary,
    },
    cardActions: {
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.primaryButton,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 26,
        marginBottom: theme.spacing.small,
    },
    primaryButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSize.small,
        fontWeight: '500',
    },
    secondaryButton: {
        backgroundColor: theme.colors.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.colors.secondaryButtonBorder,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    secondaryButtonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.xsmall,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: theme.spacing.medium,
        ...platformShadow({
            boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 2,
            elevation: 2,
        }),
    },
    sectionHeaderText: {
        fontSize: theme.fontSize.regular,
        fontWeight: '500',
        color: theme.colors.textSecondary,
    },
    filtroContainer: {
        paddingVertical: theme.spacing.medium,
        backgroundColor: theme.colors.background,
    },
    filtroBotao: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: theme.spacing.small,
    },
    filtroBotaoAtivo: {
        backgroundColor: theme.colors.primaryButton,
    },
    filtroTexto: {
        color: theme.colors.textSecondary,
        fontWeight: '500',
        fontSize: theme.fontSize.regular,
    },
    filtroTextoAtivo: {
        color: theme.colors.white,
    },
});

export default Reservas;
