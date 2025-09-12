import React, { useState } from 'react';
import { useFavoritos } from '../../../context/FavoritosContext';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../../Styles/LojaCategoriaStyles';
import HeaderLoja from '../../../Components/HeaderLoja';


const produtos = [
  {
    id: 1,
    nome: 'Creatina Growth',
    preco: 'R$79,99',
    precoAntigo: 'R$94,99',
    imagem: require('../../../../assets/banner_creatina.png'),
    selo: 'Recomendado',
    favorito: false,
    desconto: null,
  },
  {
    id: 2,
    nome: 'Vitamina D3',
  preco: 'R$49,90',
  precoAntigo: 'R$64,90',
    imagem: require('../../../../assets/banner_creatina1.jpg'),
    selo: 'Promoção',
    favorito: false,
  },
  {
    id: 3,
    nome: 'Kit Whey + Coqueteleira',
    preco: 'R$99,90',
    precoAntigo: null,
    imagem: require('../../../../assets/banner_whey.png'),
    selo: 'Recomendado',
    favorito: false,
    desconto: null,
  },
  {
    id: 4,
    nome: 'Vitamina D3',
    preco: 'R$49,90',
    precoAntigo: 'R$64,90',
    imagem: require('../../../../assets/banner_vitaminas.png'),
    selo: 'Promoção',
    favorito: false,
  },
];


const LojaCategoria = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();
  const isFavorito = (produto) => favoritos.some((p) => p.id === produto.id);
  const handleFavorito = (produto) => {
    if (!isFavorito(produto)) {
      adicionarFavorito(produto);
    } else {
      removerFavorito(produto.id);
    }
  };
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
          <Image source={require('../../../../assets/banner_camisas.png')} style={styles.bannerImage} resizeMode="cover" />
        </View>

        {/* Primeira linha de produtos (4 cards) */}
        <View style={styles.produtosContainer}>
          {produtos.slice(0, 4).map((produto) => (
            <View key={produto.id} style={styles.cardProduto}>
              {/* Selo com raio à direita */}
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
              {/* Preço antigo riscado se houver */}
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
              {/* O desconto deve aparecer sempre abaixo do preço */}
            </View>
          ))}
        </View>

        {/* Banner horizontal (destaque) */}
        <View style={styles.bannerHorizontalContainer}>
          <Image source={require('../../../../assets/banner_roupas.jpg')} style={styles.bannerHorizontalImage} resizeMode="cover" />
        </View>

        {/* Segunda linha de produtos (restante) */}
        <View style={styles.produtosContainer}>
          {produtos.slice().map((produto) => (
            <View key={produto.id} style={styles.cardProduto}>
              {/* Selo com raio à direita */}
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
              {/* Preço antigo riscado se houver */}
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
              {/* O desconto deve aparecer sempre abaixo do preço */}
              {produto.desconto && (
                <View style={styles.descontoContainer}>
                  <Text style={styles.descontoTexto}>{produto.desconto}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Segunda linha de produtos (restante) */}
        <View style={styles.produtosContainer}>
          {produtos.slice(2).map((produto) => (
            <View key={produto.id} style={styles.cardProduto}>
              {/* Selo com raio à direita */}
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
              {/* Preço antigo riscado se houver */}
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
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LojaCategoria;