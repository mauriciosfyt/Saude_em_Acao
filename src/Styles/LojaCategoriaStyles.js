
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    bannerHorizontalContainer: {
        width: '100%',
        marginVertical: 8,
        alignItems: 'center',
    },
    bannerHorizontalImage: {
        width: '92%',
        height: 90,
        borderRadius: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    bannerContainer: {
        width: width - 30,
        height: 160,
        position: 'relative',
        marginHorizontal: 15,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
        alignItems: 'center',
        marginBottom: 12,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerText: {
        position: 'absolute',
        left: 24,
        top: 24,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        ...Platform.select({
            web: { textShadow: '1px 1px 4px rgba(0,0,0,0.6)' },
            default: {
                // Mobile não suporta textShadow nativo
            },
        }),
    },
    produtosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop: 30,
    },
    cardProduto: {
        width: 155,
        backgroundColor: '#fff',
        borderRadius: 18,
        marginBottom: 22,
        marginHorizontal: 10,
        paddingVertical: 14,
        paddingHorizontal: 10,
        ...Platform.select({
            web: { boxShadow: '0px 2px 10px rgba(0,0,0,0.10)' },
            ios: {
                elevation: 4,
            },
            android: {
                elevation: 4,
            },
        }),
        position: 'relative',
        alignItems: 'center',
    },
    selo: {
        position: 'absolute',
        top: 8,
        left: 8,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 22,
    },
    seloRecomendado: {
        backgroundColor: '#e6f0ff',
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    seloPromocao: {
        backgroundColor: '#ffe066',
        borderWidth: 1,
        borderColor: '#ffd600',
    },
    seloTexto: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 3,
    },
    seloIcon: {
        marginRight: 2,
        fontSize: 14,
        color: '#ff9800',
    },
    favoritoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
    produtoImagem: {
        width: 80,
        height: 80,
        marginVertical: 8,
    },
    produtoNome: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    produtoPreco: {
        color: '#27ae60',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 2,
        marginBottom: 4,
        alignSelf: 'center',
    },
    descontoContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: '#e74c3c',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 32,
        alignItems: 'center',
    },
    descontoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
    },
});

export default styles;
