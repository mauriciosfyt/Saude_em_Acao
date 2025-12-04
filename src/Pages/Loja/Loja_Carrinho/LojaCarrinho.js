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

  // --- 4. CONECTAR O BOTÃO DE RESERVA (COM LÓGICA DO WEB) ---
  const handleEfetuarReserva = async () => {
    const selectedItems = cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert("Nenhum item selecionado", "Selecione ao menos um produto para reservar.");
      return;
    }

    // --- VALIDAÇÃO 1: Quantidade Zerada (Igual ao Web) ---
    // Impede o envio se houver algum item selecionado com quantidade <= 0
    const produtoSemQuantidade = selectedItems.find(item => item.quantity <= 0);
    if (produtoSemQuantidade) {
        Alert.alert(
            "Quantidade Inválida", 
            `O produto "${produtoSemQuantidade.productName}" tem quantidade inválida. Remova-o ou ajuste a quantidade.`
        );
        return;
    }

    // --- VALIDAÇÃO 2: Pré-checar Itens Indisponíveis (Se houver flag local) ---
    // Caso você tenha uma propriedade 'estoque' ou 'indisponivel' no objeto item,
    // essa verificação bloqueia o envio misto antes de chamar a API.
    const itemIndisponivel = selectedItems.find(item => 
       (item.estoque !== undefined && item.estoque <= 0) || item.indisponivel === true
    );

    if (itemIndisponivel) {
        Alert.alert(
            "Produto Indisponível",
            `O produto "${itemIndisponivel.productName}" parece estar indisponível. Remova-o do carrinho para prosseguir com os outros.`
        );
        return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Enviando reservas sequencialmente (Lógica Web)...");

      // Loop sequencial: Tenta reservar UM POR UM.
      // Se um falhar (ex: sem estoque), o loop para e cai no catch,
      // evitando que o usuário continue achando que deu tudo certo.
      for (const item of selectedItems) {
        
        // Busca IDs e Categorias de forma defensiva
        const produtoId = item.id || item.productId || item.produtoId || (item.product && (item.product.id || item.product.produtoId));
        const categoriaProduto = item.categoria || item.category || item.categoriaProduto || (item.product && (item.product.categoria || item.product.category));

        if (!produtoId) throw new Error(`O produto "${item.productName}" está sem ID.`);
        if (!categoriaProduto) throw new Error(`O produto "${item.productName}" está sem Categoria.`);

        const variacao = getVariacaoDTO(item);

        const payload = {
          produtoId: produtoId,
          produto_id: produtoId,
          quantidade: item.quantity,
          categoriaProduto: categoriaProduto,
          categoria_produto: categoriaProduto,
          ...variacao 
        };

        try {
            // Tenta criar a reserva deste item específico
            await criarReserva(payload);
        } catch (apiErr) {
            // Se der erro na API (ex: Estoque), lançamos um objeto customizado
            // para ser tratado no catch principal, parando o processo imediatamente.
            throw { isCustom: true, produto: item, error: apiErr };
        }
      }

      // Se o loop terminou sem erros, limpa o carrinho
      limparCarrinho(); 

      Alert.alert(
        "Reserva Efetuada!", 
        "Seus produtos foram reservados com sucesso."
      );
      
      navigation.navigate('LojaReservas');

    } catch (err) {
      console.error("Erro no processo de reserva:", err);
      
      let displayMsg = "";
      let produtoNome = "";

      // Tratamento de Erro Customizado (Igual ao Web)
      if (err.isCustom) {
        produtoNome = err.produto.productName;
        
        // Adiciona variação ao nome para facilitar identificação
        if (err.produto.variationValue) {
           // Tenta deduzir o rótulo da variação
           const tipo = ['CAMISETAS'].includes(err.produto.categoria) ? 'Tamanho' : 'Sabor';
           produtoNome = `${produtoNome} (${tipo}: ${err.produto.variationValue})`;
        }

        let rawMsg = "";
        // Tenta extrair a mensagem de erro da API
        if (err.error && typeof err.error === 'object') {
             rawMsg = err.error.message || JSON.stringify(err.error);
             // Tenta pegar campos específicos do backend se existirem
             try {
                const jsonErr = err.error; // Já é objeto
                if (jsonErr.categoriaProduto) rawMsg = jsonErr.categoriaProduto;
                else if (jsonErr.tamanho) rawMsg = jsonErr.tamanho;
                else if (jsonErr.sabor) rawMsg = jsonErr.sabor;
             } catch(e) {}
        } else {
             rawMsg = String(err.error);
        }

        // --- LÓGICA DE ESTOQUE (Regex "Disponível: X") ---
        const match = rawMsg.match(/Disponível:\s*(\d+)/i);
        
        if (match) {
            const qtdDisponivel = parseInt(match[1], 10);
            
            if (qtdDisponivel === 0) {
                displayMsg = `O produto ${produtoNome} está indisponível. Remova-o para continuar.`;
            } else {
                displayMsg = `Estoque insuficiente para ${produtoNome}. Apenas ${qtdDisponivel} disponível(is).`;
            }
        } else {
            // Erro genérico com o nome do produto
            displayMsg = `Erro em ${produtoNome}: ${rawMsg}`;
        }

      } else {
        // Erro genérico (Rede, etc)
        displayMsg = err.message || "Ocorreu um erro desconhecido ao tentar reservar.";
      }
      
      Alert.alert("Não foi possível concluir", displayMsg);
    
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular total (Sua lógica original)
  const selectedItems = cartItems.filter(item => item.selected);
  const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- 5. RENDERIZAÇÃO ---

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