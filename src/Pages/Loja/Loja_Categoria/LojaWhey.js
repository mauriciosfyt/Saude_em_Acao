import React, { useState, useEffect } from 'react';
import { useFavoritos } from '../../../context/FavoritosContext';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../../Styles/LojaCategoriaStyles';
import HeaderLoja from '../../../Components/HeaderLoja';

// Importar a função da API
import { obterProdutos } from '../../../Services/api'; 

const LojaCategoria = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();

  // States para gerenciar os dados da API
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados na montagem
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Busca os dados da API, filtrando por 'WHEY_PROTEIN'
        const data = await obterProdutos({ categoria: 'WHEY_PROTEIN' }); 

        // 2. Formata os dados da API
        const produtosFormatados = data.map(p => ({
          ...p,
          preco: `R$ ${p.preco ? p.preco.toFixed(2).replace('.', ',') : '0,00'}`,
          precoAntigo: p.precoAntigo ? `R$ ${p.precoAntigo.toFixed(2).replace('.', ',')}` : null,
          imagem: { uri: p.img } 
        }));

        // 3. Atualiza o state
        setProdutos(produtosFormatados);

      } catch (err) {
        setError(err.message || 'Erro ao buscar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []); 

  // Lógica de favoritos
  const isFavorito = (produto) => favoritos.some((p) => p.id === produto.id);
  const handleFavorito = (produto) => {
    if (!isFavorito(produto)) {
      adicionarFavorito(produto);
    } else {
      removerFavorito(produto.id);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderLoja
          navigation={navigation}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <View style={localStyles.centered}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 10, color: '#666' }}>Carregando produtos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <HeaderLoja
          navigation={navigation}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <View style={localStyles.centered}>
          <Ionicons name="alert-circle-outline" size={50} color="#cc0000" />
          <Text style={{ marginTop: 10, color: '#cc0000', textAlign: 'center', paddingHorizontal: 20 }}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderLoja
        navigation={navigation}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <ScrollView>
        {/* Banner 1 */}
        <View style={styles.bannerContainer}>
          <Image source={require('../../../../assets/banner_whey.png')} style={styles.bannerImage} resizeMode="cover" />
        </View>

        {/* Primeira linha de produtos (4 cards) */}
        <View style={styles.produtosContainer}>
          {produtos.slice(0, 4).map((produto) => (
            // ALTERAÇÃO 1: Mudança para TouchableOpacity e adição do onPress
            <TouchableOpacity 
                key={produto.id} 
                style={styles.cardProduto}
                onPress={() => navigation.navigate('LojaProdutos', { produtoId: produto.id })}
            >
              {/* Selo com raio à direita */}
              {produto.selo && (
                <View style={[styles.selo, produto.selo === 'Promoção' ? styles.seloPromocao : styles.seloRecomendado, { flexDirection: 'row-reverse' }]}>
                  {produto.selo === 'Promoção' ? (
                    <MaterialCommunityIcons name="lightning-bolt" style={styles.seloIcon} />
                  ) : null}
                  <Text style={[styles.seloTexto, produto.selo === 'Promoção' ? { color: '#b48a00' } : { color: '#3b82f6' }]}>{produto.selo}</Text>
                </View>
              )}
              
              {/* Botão de Favorito (Funciona independente) */}
              <TouchableOpacity style={styles.favoritoIcon} onPress={() => handleFavorito(produto)}>
                <Ionicons
                  name={isFavorito(produto) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorito(produto) ? '#3b82f6' : '#b0b0b0'}
                />
              </TouchableOpacity>

              <Image source={produto.imagem} style={styles.produtoImagem} resizeMode="contain" />
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              {produto.precoAntigo && (
                <Text style={{ color: '#888', textDecorationLine: 'line-through', fontSize: 13, alignSelf: 'flex-start', marginTop: 2 }}>
                  {produto.precoAntigo}
                </Text>
              )}
              <Text style={[
                styles.produtoPreco,
                produto.selo === 'Recomendado'
                  ? { color: '#27ae60' }
                  : { color: '#222' }
              ]}>
                {produto.preco}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner horizontal (destaque) */}
        <View style={styles.bannerHorizontalContainer}>
          <Image source={require('../../../../assets/banner_whey.jpg')} style={styles.bannerHorizontalImage} resizeMode="cover" />
        </View>

        {/* Restante dos produtos */}
        <View style={styles.produtosContainer}>
          {produtos.slice(4).map((produto) => (
            // ALTERAÇÃO 2: Mudança para TouchableOpacity e adição do onPress
            <TouchableOpacity 
                key={produto.id} 
                style={styles.cardProduto}
                onPress={() => navigation.navigate('LojaProdutos', { produtoId: produto.id })}
            >
              {produto.selo && (
                <View style={[styles.selo, produto.selo === 'Promoção' ? styles.seloPromocao : styles.seloRecomendado, { flexDirection: 'row-reverse' }]}>
                  {produto.selo === 'Promoção' ? (
                    <MaterialCommunityIcons name="lightning-bolt" style={styles.seloIcon} />
                  ) : null}
                  <Text style={[styles.seloTexto, produto.selo === 'Promoção' ? { color: '#b48a00' } : { color: '#3b82f6' }]}>{produto.selo}</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.favoritoIcon} onPress={() => handleFavorito(produto)}>
                <Ionicons
                  name={isFavorito(produto) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorito(produto) ? '#3b82f6' : '#b0b0b0'}
                />
              </TouchableOpacity>

              <Image source={produto.imagem} style={styles.produtoImagem} resizeMode="contain" />
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              {produto.precoAntigo && (
                <Text style={{ color: '#888', textDecorationLine: 'line-through', fontSize: 13, alignSelf: 'flex-start', marginTop: 2 }}>
                  {produto.precoAntigo}
                </Text>
              )}
              <Text style={[
                styles.produtoPreco,
                produto.selo === 'Recomendado'
                  ? { color: '#27ae60' }
                  : { color: '#222' }
              ]}>
                {produto.preco}
              </Text>
              {produto.desconto && (
                <View style={styles.descontoContainer}>
                  <Text style={styles.descontoTexto}>{produto.desconto}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LojaCategoria;