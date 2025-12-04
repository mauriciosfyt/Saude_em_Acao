
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator, // ADICIONADO
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDERS } from '../../../constants/constants';
import HeaderLoja from '../../../Components/HeaderLoja.js';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';

// ADICIONADO: Importar a função da API
import { obterProdutos } from '../../../Services/api'; 
import { useFavoritos } from '../../../context/FavoritosContext';

const { width } = Dimensions.get('window');

const Loja = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // ADICIONADO: States para os produtos e loading
  const [horizontalProducts, setHorizontalProducts] = useState([]);
  const [verticalProducts, setVerticalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();

  // Dados dos banners (Seu código original)
  const banners = [
    {
      id: 1,
      image: require('../../../../assets/banner_loja.png'),
    },
    {
      id: 2,
      image: require('../../../../assets/banner_loja2.png'),
    },
    {
      id: 3,
      image: require('../../../../assets/banner_creatina.png'),
    },
  ];

  // Categorias (Seu código original)
  const categories = [
    { id: 1, name: 'Roupas', icon: require('../../../../assets/icons/camisa.png'), type: 'image' },
    { id: 2, name: 'Whey Protein', icon: require('../../../../assets/icons/whey.png'), type: 'image' },
    { id: 3, name: 'Vitaminas', icon: require('../../../../assets/icons/vitamina.png'), type: 'image' },
    { id: 4, name: 'Creatina', icon: require('../../../../assets/icons/pre-treino.png'), type: 'image' },
  ];

  // REMOVIDO: const horizontalProducts = [...] (estático)
  // REMOVIDO: const verticalProducts = [...] (estático)

  // ADICIONADO: useEffect para carregar dados da API na montagem
  useEffect(() => {
    const carregarDadosLoja = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscamos TODOS os produtos, SEM filtros (para evitar o erro 'isEnum()')
        const todosProdutosData = await obterProdutos(); 

        // 2. Formatamos os dados da API para bater com o que seu JSX espera
        const produtosFormatados = todosProdutosData.map(p => ({
          id: p.id,
          name: p.nome,
          description: p.descricao || p.nome,
          price: `R$ ${p.preco ? p.preco.toFixed(2).replace('.', ',') : '0,00'}`,
          image: { uri: p.img }, // API envia 'imagemUrl'
          // isFavorite will be derived from FavoritosContext
        }));

        // 3. Dividimos a lista (mesclagem)
        // Destaques (Horizontal): Pegamos os 5 primeiros
        setHorizontalProducts(produtosFormatados.slice(0, 5));
        
        // Recomendados (Vertical): Pegamos os 5 seguintes (do 6º ao 10º)
        setVerticalProducts(produtosFormatados.slice(5, 10));

      } catch (err) {
        // Erro ao carregar dados da loja — propagar mensagem
        setError(err.message || "Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosLoja();
  }, []); // [] = Roda apenas uma vez

  
  // renderBanner (Seu código original - Intocado)
  const renderBanner = ({ item }) => (
    <View style={styles.bannerContainer}>
      <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  // renderHorizontalProduct (Seu código original - 'onPress' MODIFICADO)
  const renderHorizontalProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.horizontalProductCard} 
      // MODIFICADO: Passando 'produtoId' em vez do objeto 'produto'
      onPress={() => navigation.navigate('LojaProdutos', { produtoId: item.id })}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => {
          try {
            const isFav = favoritos && favoritos.find((f) => String(f.id || f.produtoId) === String(item.id));
            if (isFav) {
              removerFavorito(item.id);
            } else {
              adicionarFavorito({ id: item.id, nome: item.name, preco: item.price, img: item.image });
            }
          } catch (e) {
            // Erro ao alternar favorito (home) — ignorar
          }
        }}
      >
        <Ionicons
          name={(favoritos && favoritos.find((f) => String(f.id || f.produtoId) === String(item.id))) ? 'heart' : 'heart-outline'}
          size={20}
          color={(favoritos && favoritos.find((f) => String(f.id || f.produtoId) === String(item.id))) ? '#ff4757' : COLORS.cinzaMedio}
        />
      </TouchableOpacity>
      <View style={styles.productContent}>
        {/* 'item.image' agora é { uri: '...' } vindo da API */}
        <Image source={item.image} style={styles.horizontalProductImage} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.horizontalProductName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.horizontalProductDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.horizontalProductPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  // renderVerticalProduct (Seu código original - 'onPress' MODIFICADO)
  const renderVerticalProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.verticalProductCard} 
      // MODIFICADO: Passando 'produtoId' em vez do objeto 'produto'
      onPress={() => navigation.navigate('LojaProdutos', { produtoId: item.id })}
    >
      {/* 'item.image' agora é { uri: '...' } vindo da API */}
      <Image source={item.image} style={styles.verticalProductImage} resizeMode="contain" />
      <View style={styles.verticalProductInfo}>
        <Text style={styles.verticalProductDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.verticalProductPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  // ADICIONADO: Telas de Loading e Erro
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary || '#007bff'} />
        <Text style={styles.centeredText}>Carregando loja...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={50} color="#cc0000" />
        <Text style={[styles.centeredText, { color: '#cc0000' }]}>
          Erro ao carregar produtos: {error}
        </Text>
      </View>
    );
  }

  // Renderização Principal (Seu JSX original - Intocado)
  return (
    <View style={styles.container}>
      {/* Header com gradiente */}
      <HeaderLoja 
        navigation={navigation}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Carrossel */}
        <View style={styles.bannerSection}>
          <FlatList
            data={banners}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const bannerWidth = width - 30;
              const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
              setCurrentBannerIndex(index);
            }}
            style={styles.bannerList}
          />
          {/* Indicadores do carrossel */}
          <View style={styles.bannerIndicators}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerIndicator,
                  index === currentBannerIndex && styles.bannerIndicatorActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => {
                  if (category.name === 'Roupas') {
                    navigation.navigate('LojaRoupas');
                  } else if (category.name === 'Vitaminas') {
                    navigation.navigate('LojaVitaminas');
                  } else if (category.name === 'Whey Protein') {
                    navigation.navigate('LojaWhey');
                  } else if (category.name === 'Creatina') {
                    navigation.navigate('LojaCreatina');
                  }
                }}
              >
                <View style={styles.categoryIcon}>
                  {category.type === 'ionicon' ? (
                    <Ionicons name={category.icon} size={24} color="#000" />
                  ) : (
                    <Image source={category.icon} style={styles.categoryImage} resizeMode="contain" />
                  )}
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Produtos Horizontais (Agora usa o state) */}
        <View style={styles.horizontalProductsSection}>
          <FlatList
            data={horizontalProducts}
            renderItem={renderHorizontalProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalProductsList}
          />
        </View>

        {/* Produtos Verticais (Agora usa o state) */}
        <View style={styles.verticalProductsSection}>
          <View style={styles.verticalProductsContainer}>
            {verticalProducts.map((item, index) => (
              <View key={item.id}>
                {renderVerticalProduct({ item })}
                {index < verticalProducts.length - 1 && (
                  <View style={styles.productSeparator} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Adiciona a nova barra de navegação fixa */}
      <BottomNavBar navigation={navigation} activeScreen={'Loja'} />
    </View>
  );
};

// Seus estilos originais (ADICIONADO 'centered' e 'centeredText')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // ADICIONADO: Para telas de loading/erro
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredText: {
    marginTop: 10,
    color: COLORS.cinzaMedio || '#888',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  bannerSection: {
    height: 160,
    marginBottom: 20,
  },
  bannerList: {
    flex: 1,
  },
  bannerContainer: {
    width: width - 30,
    height: 160,
    position: 'relative',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 15,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 5,
    ...Platform.select({
      web: { textShadow: '1px 1px 2px rgba(0,0,0,0.3)' },
      default: {
        // Mobile: textShadow* não suportados nativamente
      },
    }),
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'white',
    ...Platform.select({
      web: { textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
      default: {
        // Mobile: textShadow* não suportados nativamente
      },
    }),
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  bannerIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 5,
  },
  bannerIndicatorActive: {
    backgroundColor: '#007bff',
  },
  categoriesSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  categoryItem: {
    alignItems: 'center',
    width: '24%',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#405CBA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.10)' },
      default: {
        elevation: 5,
      },
    }),
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.escuro,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryImage: {
    width: 24,
    height: 24,
  },
  horizontalProductsSection: {
    marginBottom: 20,
  },
  horizontalProductsList: {
    paddingHorizontal: 15,
  },
  horizontalProductCard: {
    width: 160,
    height: 220,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
    ...Platform.select({
      web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.10)' },
      default: {
        elevation: 5,
      },
    }),
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  productContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  priceContainer: {
    height: 24,
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  horizontalProductImage: {
    width: '100%',
    height: 90,
    marginBottom: 8,
  },
  horizontalProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.escuro,
    marginBottom: 4,
    lineHeight: 18,
  },
  horizontalProductDescription: {
    fontSize: 12,
    color: COLORS.cinzaMedio,
    marginBottom: 8,
    lineHeight: 16,
  },
  horizontalProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.escuro,
    textAlign: 'left',
  },
  verticalProductsSection: {
    paddingHorizontal: 15,
  },
  verticalProductsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    ...Platform.select({
      web: { boxShadow: '0px 6px 18px rgba(0,0,0,0.10)' },
      default: {
        elevation: 5,
      },
    }),
    overflow: 'hidden',
    marginBottom:10,

  },
  verticalProductCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 15,
  },
  verticalProductImage: {
    width: 60, // (Seu estilo original tinha 80, o log tinha 60. Voltando para 80)
    height: 60,
    marginRight: 15,
  },
  verticalProductInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  verticalProductDescription: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    lineHeight: 18,
  },
  verticalProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  productSeparator: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 0,
    width: 300,
    alignSelf: 'center', // 🔹 centraliza horizontalmente
  },
  
});

export default Loja;
