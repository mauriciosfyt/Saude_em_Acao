import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator,
  Image // <--- Importado para mostrar a foto
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Importação da API existente
import { obterProdutos } from '../Services/api'; 

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

const HeaderLoja = ({ navigation: navigationProp, searchText, setSearchText }) => {
  const navigation = navigationProp || useNavigation();
  const { logout } = useAuth();
  const [menuVisivel, setMenuVisivel] = useState(false);

  // Estados da pesquisa
  const [resultados, setResultados] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Debounce e Busca
  useEffect(() => {
    if (!searchText || searchText.trim().length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setCarregandoBusca(true);
      setMostrarResultados(true);
      try {
        const dados = await obterProdutos({ nome: searchText });
        setResultados(dados || []);
      } catch (error) {
        console.error("Erro na busca interna do Header:", error);
        setResultados([]);
      } finally {
        setCarregandoBusca(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation && nomeDaTela) navigation.navigate(nomeDaTela);
  };

  // === CORREÇÃO DE NAVEGAÇÃO ===
  const irParaProduto = (produto) => {
    setMostrarResultados(false); // Fecha o dropdown
    setSearchText(''); // Opcional: limpa a busca ao clicar
    
    // Navega para a tela 'LojaProduto' passando o ID
    navigation.navigate('LojaProdutos', { 
      id: produto.id,           // Envia como 'id'
      produtoId: produto.id,    // Envia como 'produtoId' (redundância para segurança)
      produto: produto          // Envia o objeto todo caso precise
    });
  };

  const handleSairConta = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              handleFecharMenu();
              await logout();
              navigation.navigate('Inicial');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao sair da conta.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={{ zIndex: 100 }}>
      <LinearGradient
        colors={['#405CBA', '#FFFFFF']}
        locations={[0, 0.84]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Produtos"
              placeholderTextColor="#9e9e9e"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => setMostrarResultados(false)}
            />
            {carregandoBusca ? (
              <ActivityIndicator size="small" color="#405CBA" style={{ marginRight: 10 }} />
            ) : (
              <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
            )}
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleAbrirMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* LISTA DE RESULTADOS (DROPDOWN) */}
        {mostrarResultados && searchText.length >= 2 && (
          <View style={styles.resultsOverlay}>
            <FlatList
              data={resultados}
              keyExtractor={(item) => String(item.id)}
              style={{ maxHeight: 300 }}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.resultItem} 
                  onPress={() => irParaProduto(item)}
                >
                  {/* === CORREÇÃO DA IMAGEM === */}
                  {/* Tenta mostrar a imagem se existir, senão mostra o ícone */}
                  {item.img ? (
                    <Image 
                      source={{ uri: item.img }} 
                      style={styles.resultImage} 
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="cube-outline" size={20} color="#666" />
                    </View>
                  )}

                  <View style={{flex: 1}}>
                    <Text style={styles.resultItemText} numberOfLines={1}>{item.nome}</Text>
                    {item.preco && (
                      <Text style={styles.resultItemPrice}>
                        R$ {parseFloat(item.preco).toFixed(2)}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !carregandoBusca && (
                  <View style={styles.emptyResult}>
                    <Text style={styles.emptyResultText}>Nenhum produto encontrado.</Text>
                  </View>
                )
              }
            />
          </View>
        )}
      </LinearGradient>

      {/* Menu Lateral (Modal) - Mantido igual */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={handleFecharMenu} activeOpacity={1}>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>
            {['Home', 'Perfil', 'Chat', 'Loja', 'LojaFavoritos', 'LojaReservas', 'Desempenho'].map((tela) => (
               <TouchableOpacity key={tela} style={styles.menuItem} onPress={() => handleNavegar(tela)}>
                 <Ionicons 
                    name={
                        tela === 'Home' ? 'home-outline' : 
                        tela === 'Perfil' ? 'person-outline' :
                        tela === 'Chat' ? 'chatbubble-outline' :
                        tela === 'Loja' ? 'cart-outline' :
                        tela === 'LojaFavoritos' ? 'heart-outline' :
                        tela === 'LojaReservas' ? 'bookmark-outline' : 'bar-chart-outline'
                    } 
                    size={24} color="#333" 
                 />
                 {/* Ajuste simples para nomes amigáveis */}
                 <Text style={styles.menuItemText}>
                    {tela === 'LojaFavoritos' ? 'Favoritos' : tela === 'LojaReservas' ? 'Reservas' : tela === 'Meu Perfil' ? 'Perfil' : tela}
                 </Text>
               </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.menuItem} onPress={handleSairConta}>
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, {color: '#dc3545'}]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... Seus estilos anteriores mantidos ...
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: { marginLeft: 5 },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
  menuContent: {
    height: '100%',
    width: '75%',
    backgroundColor: 'white',
    paddingTop: 80,
    paddingHorizontal: 20,
    ...platformShadow({
      boxShadow: '-6px 0px 18px rgba(0,0,0,0.25)',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginLeft: 15,
    height: 45,
    ...platformShadow({
      boxShadow: '0px 6px 14px rgba(0,0,0,0.2)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  searchIcon: { marginLeft: 10 },

  // === ESTILOS DO DROPDOWN DE PESQUISA ===
  resultsOverlay: {
    position: 'absolute',
    top: 100,
    left: 60,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    zIndex: 999,
    paddingVertical: 5,
    ...platformShadow({
      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 8,
    }),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  // Estilo novo para a imagem
  resultImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee'
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  resultItemPrice: {
    fontSize: 12,
    color: '#405CBA',
    marginTop: 2,
  },
  emptyResult: { padding: 15, alignItems: 'center' },
  emptyResultText: { color: '#999', fontSize: 14 }
});

export default HeaderLoja;