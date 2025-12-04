import React, { useState, useEffect, useCallback } from 'react';
import {
    // ... (imports existentes)
    SectionList,
    Platform,
    Alert // Importado para mostrar erros da API
} from 'react-native';
// ... (imports existentes)
import HeaderLoja from '../../../Components/HeaderLoja';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';

// >> NOVOS IMPORTS NECESSÁRIOS:
import * as Notifications from 'expo-notifications';
import { obterMinhasReservas } from '../../../../src/services/api'; // Ajuste o caminho conforme a estrutura do seu projeto

// ... (Restante do código: platformShadow, theme, getStatusColor, styles) ...

// Função para agendar a notificação
async function scheduleStatusNotification(status, nomeProduto) {
    // 1. Você DEVE garantir que as permissões foram solicitadas 
    //    em App.js antes de chamar esta função.

    await Notifications.scheduleNotificationAsync({
        content: {
            title: `Status da Reserva: ${status}`,
            body: `Seu produto "${nomeProduto}" agora está com status: ${status}.`,
            data: { status, nomeProduto },
        },
        // Notificação disparada em 1 segundo
        trigger: { seconds: 1 }, 
    });
}


const Reservas = ({ navigation }) => {
    // ... (state do searchText e gradientColors) ...
    const [reservasData, setReservasData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // >> NOVO: Função para buscar dados da API e formatar
    const fetchReservas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await obterMinhasReservas(); // Chama a função do api.js
            
            // Simulação: se a API retornar um array de reservas
            // Exemplo de item: { id: 1, produtoNome: "Whey", dataReserva: "2015-10-09T10:00:00Z", status: "Cancelado" }
            const formattedSections = {};
            
            data.forEach(item => {
                // Formata a data (Ex: 09/10/2015)
                const date = new Date(item.dataReserva || new Date()); 
                const dateString = date.toLocaleDateString('pt-BR'); 

                if (!formattedSections[dateString]) {
                    formattedSections[dateString] = { title: dateString, data: [] };
                }
                
                formattedSections[dateString].data.push({
                    id: item.id.toString(),
                    status: item.status || 'Em Análise', // Status da API
                    nome: item.produtoNome || 'Produto Indefinido',
                    imagem: require('../../../../assets/banner_vitaminas.png'), // Use a imagem real se houver
                });

                // >> LÓGICA DE NOTIFICAÇÃO AQUI <<
                // Dispara a notificação se o status for final/relevante
                if (['Cancelado', 'Retirado', 'Aprovado'].includes(item.status)) {
                    scheduleStatusNotification(item.status, item.produtoNome || 'Produto Indefinido');
                }
                // O status 'Em Análise' é geralmente o ponto inicial e não notifica.
            });

            // Converte o objeto de volta para o array de seções
            setReservasData(Object.values(formattedSections));
        } catch (error) {
            // Erro ao buscar reservas — notificar usuário e limpar lista
            Alert.alert("Erro", "Não foi possível carregar suas reservas. Verifique a conexão.");
            setReservasData([]); // Limpa a lista em caso de erro
        } finally {
            setIsLoading(false);
        }
    }, []);

    // >> NOVO: Chama a busca de dados ao montar o componente
    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);


    // Componente para renderizar um item da lista
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* ... (renderização do card existente) ... */}
            <Image source={item.imagem} style={styles.cardImage} />
            <View style={styles.cardInfo}>
                <Text style={[styles.cardStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
                <Text style={styles.cardName}>{item.nome}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Ver produto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Comprar novamente</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // ... (renderSectionHeader e state do searchText) ...

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

            {/* --- LISTA DE SEÇÕES --- */}
            {isLoading ? (
                <Text style={styles.title}>Carregando Reservas...</Text>
            ) : (
                <SectionList
                    sections={reservasData.map(section => ({
                        ...section,
                        data: section.data.filter(item =>
                            item.nome.toLowerCase().includes(searchText.toLowerCase())
                        )
                    })).filter(section => section.data.length > 0)}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    ListHeaderComponent={<Text style={styles.title}>Reservas</Text>}
                    contentContainerStyle={styles.listContentContainer}
                    ListEmptyComponent={!isLoading && <Text style={styles.emptyText}>Nenhuma reserva encontrada.</Text>}
                />
            )}

            <BottomNavBar navigation={navigation} activeScreen="LojaReservas" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // ... (Estilos existentes) ...
    title: {
        // ... (Estilo existente) ...
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: theme.fontSize.regular,
        color: theme.colors.textSecondary,
    }
    // ... (Estilos existentes) ...
});

export default Reservas;