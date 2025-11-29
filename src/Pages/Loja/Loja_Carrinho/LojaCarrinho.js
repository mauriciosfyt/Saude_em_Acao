import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator, 
  Alert, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';
import HeaderLoja from '../../../Components/HeaderLoja';
import styles from '../../../Styles/LojaCarrinhoStyles'; // <-- Usando seus estilos originais

// --- 1. IMPORTAÇÕES ---
import { useCart } from '../../../context/CartContext'; 
import { criarReserva } from '../../../Services/api'; 

// --- 2. LÓGICA DE VARIAÇÃO (Portado da sua lógica Web) ---
const CATEGORIAS_PRODUTO = [
  { valor: 'CAMISETAS', tipoEstoque: 'tamanho' },
  { valor: 'WHEY_PROTEIN', tipoEstoque: 'sabor' },
  { valor: 'CREATINA', tipoEstoque: 'sabor' },
  { valor: 'VITAMINAS', tipoEstoque: 'padrao' },
];

const getVariacaoDTO = (item) => {
    const dto = { tamanho: null, sabor: null };
    const categoriaInfo = CATEGORIAS_PRODUTO.find(c => c.valor === item.categoria); 
    
    if (!categoriaInfo) {
        console.warn(`Categoria não encontrada para: ${item.productName}. Variação não será enviada.`);
        return dto; 
    }
    if (categoriaInfo.tipoEstoque === 'tamanho') {
        dto.tamanho = item.variationValue;
    } else if (categoriaInfo.tipoEstoque === 'sabor') {
        dto.sabor = item.variationValue;
    }
    return dto;
};
// --- FIM DA LÓGICA DE VARIAÇÃO ---

const LojaCarrinho = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // --- 3. CONECTAR AO useCart ---
  const { 
    cartItems, 
    loadingCart,
    updateQuantity,
    removeItem,
    toggleItemSelection,
    toggleSelectAll: contextToggleSelectAll, 
    limparCarrinho 
  } = useCart();

  const [selectAll, setSelectAll] = useState(true);

  // Sincroniza o 'selectAll' local com o estado global
  useEffect(() => {
    if (!loadingCart) {
        const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
        setSelectAll(allSelected);
    }
  }, [cartItems, loadingCart]);
  
  // Funções de clique (adaptadas para o useCart)
  const handleToggleItemSelection = (cartItemId) => {
    toggleItemSelection(cartItemId); 
  };

  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    contextToggleSelectAll(newSelectAll); 
  };

  // --- 4. CONECTAR O BOTÃO DE RESERVA (COM CORREÇÃO) ---
  const handleEfetuarReserva = async () => {
    const selectedItems = cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert("Nenhum item selecionado", "Selecione ao menos um produto para reservar.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. "Traduzir" os itens para o DTO da API
      const itensDTO = selectedItems.map(item => {
        // Busca o ID do produto em vários possíveis campos (defensivo)
        const produtoId = item.id || item.productId || item.produtoId || (item.product && (item.product.id || item.product.produtoId));

        // Busca a categoria do produto em vários possíveis campos
        const categoriaProduto = item.categoria || item.category || item.categoriaProduto || (item.product && (item.product.categoria || item.product.category));

        if (!produtoId) {
            throw new Error(`O produto "${item.productName || item.nome || JSON.stringify(item)}" está sem 'id' (produtoId) no carrinho.`);
        }

        if (!categoriaProduto) {
            throw new Error(`O produto "${item.productName || item.nome || JSON.stringify(item)}" está sem 'categoria' no carrinho.`);
        }

        const variacao = getVariacaoDTO(item);

        return {
          produtoId: produtoId,
          produto_id: produtoId, // envio também em snake_case (compatibilidade)
          quantidade: item.quantity,
          categoriaProduto: categoriaProduto,
          categoria_produto: categoriaProduto, // envio também em snake_case
          ...variacao // Adiciona {tamanho: "P", sabor: null} etc.
        };
      });

      // Alguns backends aceitam apenas uma reserva por requisição (payload com fields
      // como produtoId/categoriaProduto). O código web faz uma chamada por item.
      // Para compatibilidade, vamos enviar uma requisição por item.
      console.log("Enviando para API /api/reservas (por item):", JSON.stringify(itensDTO, null, 2));

      // Envia todas as requisições em paralelo e aguarda conclusão
      const promessas = itensDTO.map(it => {
        const payload = {
          produtoId: it.produtoId || it.produto_id,
          quantidade: it.quantidade,
          categoriaProduto: it.categoriaProduto || it.categoria_produto,
          tamanho: it.tamanho,
          sabor: it.sabor
        };
        console.log('Enviando item para /api/reservas:', payload);
        return criarReserva(payload);
      });

      await Promise.all(promessas);
      
      // 3. Limpar os itens SELECIONADOS do carrinho
      limparCarrinho(); 

      Alert.alert(
        "Reserva Efetuada!", 
        "Seus produtos foram reservados com sucesso."
      );
      
      navigation.navigate('LojaReservas');

    // (O bloco 'catch' que corrigimos antes permanece)
    } catch (err) {
      // 'err' JÁ É o objeto de erro vindo da API
      console.error("Erro REAL ao criar reserva (da API):", err); 
      
      let errorMsg = "Erro desconhecido.";
      if (typeof err === 'object' && err !== null) {
        // Transforma o objeto de erro ({"categoriaProduto": "..."}) em string
        errorMsg = JSON.stringify(err);
      } else if (err.message) {
        errorMsg = err.message; // Erro de rede
      } else {
        errorMsg = err.toString(); // Fallback
      }
      
      Alert.alert("Falha na Reserva", `Erro: ${errorMsg}`);
    
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular total (Sua lógica original)
  const selectedItems = cartItems.filter(item => item.selected);
  const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- 5. RENDERIZAÇÃO (Seu código original, adaptado) ---

  if (loadingCart) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#405CBA" />
            </View>
            <BottomNavBar navigation={navigation} activeScreen="LojaCarrinho" />
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Select All Option */}
        <TouchableOpacity style={styles.selectAllContainer} onPress={handleToggleSelectAll}>
          <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, selectAll && styles.checkboxSelected]}>
                {selectAll && <Ionicons name="checkmark" size={16} color="#405CBA" />}
              </View>
            <Text style={styles.selectAllText}>Selecionar todos os produtos</Text>
          </View>
        </TouchableOpacity>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <View key={item.cartItemId} style={styles.cartItem}>
            <View style={styles.itemLeft}>
              <TouchableOpacity 
                style={styles.itemCheckbox}
                onPress={() => handleToggleItemSelection(item.cartItemId)} 
              >
                <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                  {item.selected && <Ionicons name="checkmark" size={16} color="#405CBA" />}
                </View>
              </TouchableOpacity>
              
              <Image source={item.image} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                
                {/* O campo de variação (Ex: "P" ou "Morango") */}
                {item.variationValue && (
                    <Text style={styles.productVariation}>{item.variationValue}</Text>
                )}

                <Text style={styles.productPrice}>R${item.price.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.itemRight}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)} 
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)} 
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.viewProductButton}
                    onPress={() => navigation.navigate('LojaProdutos', { produtoId: item.id })}
                >
                  <Text style={styles.viewProductText}>Ver produto</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeItem(item.cartItemId)} 
                >
                  <Text style={styles.removeText}>Excluir do carrinho</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Produtos ({totalItems})</Text>
            <Text style={styles.summaryTotal}>Total: R${total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[
                  styles.reserveButton,
                  (isSubmitting || selectedItems.length === 0) && { backgroundColor: '#AAA' }
              ]}
              onPress={handleEfetuarReserva} 
              disabled={isSubmitting || selectedItems.length === 0} 
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.reserveButtonText}>Efetuar reserva</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('Loja')}
            >
              <Text style={styles.continueShoppingText}>Continuar comprando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar navigation={navigation} activeScreen="LojaCarrinho" />
    </SafeAreaView>
  );
};

export default LojaCarrinho;