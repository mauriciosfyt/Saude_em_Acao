import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../../Components/Footer_loja/BottomNavBar';
import HeaderLoja from '../../../Components/HeaderLoja';
import styles from '../../../Styles/LojaCarrinhoStyles';

const LojaCarrinho = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  
  // Exemplo de produtos no carrinho
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'WHEY PROTEIN',
      price: 89.90,
      quantity: 1,
      image: require('../../../../assets/banner_whey.png'),
      selected: true,
    },
    {
      id: 2,
      name: 'CREATINA',
      price: 65.50,
      quantity: 1,
      image: require('../../../../assets/banner_creatina.png'),
      selected: true,
    },
    {
      id: 3,
      name: 'VITAMINA D3',
      price: 45.00,
      quantity: 1,
      image: require('../../../../assets/banner_vitaminas.png'),
      selected: true,
    },
  ]);

  const [selectAll, setSelectAll] = useState(true);

  // Função para atualizar quantidade
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Função para remover item do carrinho
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Função para selecionar/deselecionar item
  const toggleItemSelection = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Função para selecionar todos os produtos
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: newSelectAll }))
    );
  };

  // Calcular total
  const selectedItems = cartItems.filter(item => item.selected);
  const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <HeaderLoja navigation={navigation} searchText={searchText} setSearchText={setSearchText} />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Select All Option */}
        <TouchableOpacity style={styles.selectAllContainer} onPress={toggleSelectAll}>
          <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, selectAll && styles.checkboxSelected]}>
                  {selectAll && <Ionicons name="checkmark" size={16} color="#405CBA" />}
            </View>
            <Text style={styles.selectAllText}>Selecionar todos os produtos</Text>
          </View>
        </TouchableOpacity>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemLeft}>
              <TouchableOpacity 
                style={styles.itemCheckbox}
                onPress={() => toggleItemSelection(item.id)}
              >
                <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                  {item.selected && <Ionicons name="checkmark" size={16} color="#405CBA" />}
                </View>
              </TouchableOpacity>
              
              <Image source={item.image} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>R${item.price.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.itemRight}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.viewProductButton}>
                  <Text style={styles.viewProductText}>Ver produto</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
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
              style={styles.reserveButton}
              onPress={() => navigation.navigate('LojaReservas')}
            >
              <Text style={styles.reserveButtonText}>Efetuar reserva</Text>
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
