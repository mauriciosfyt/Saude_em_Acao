import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

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

  const handleAbrirMenu = () => setMenuVisivel(true);
  const handleFecharMenu = () => setMenuVisivel(false);
  const handleNavegar = (nomeDaTela) => {
    handleFecharMenu();
    if (navigation && nomeDaTela) navigation.navigate(nomeDaTela);
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
    <>
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
            />
            <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleAbrirMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Menu Lateral Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisivel}
        onRequestClose={handleFecharMenu}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={handleFecharMenu} activeOpacity={1}>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Home')}>
              <Ionicons name="home-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Perfil')}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Chat')}>
              <Ionicons name="chatbubble-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Loja')}>
              <Ionicons name="cart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('LojaFavoritos')}>
              <Ionicons name="heart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('LojaReservas')}>
              <Ionicons name="bookmark-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavegar('Desempenho')}>
              <Ionicons name="bar-chart-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Desempenho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSairConta}>
              <Ionicons name="log-out-outline" size={24} color="#dc3545" />
              <Text style={[styles.menuItemText, {color: '#dc3545'}]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 5,
  },
  menuOverlay: {
    flex: 1,
    // overlay removido (transparente) para evitar sombra pesada ao abrir o menu
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
  },
});

export default HeaderLoja;
