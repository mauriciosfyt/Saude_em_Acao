// App.js (Corrigido)

import React, { useEffect } from 'react';
import { Platform, View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './src/Routes/Routes';
import { FavoritosProvider } from './src/context/FavoritosContext';
import { TreinosProvider } from './src/context/TreinosContext';
import { ThemeProvider } from './src/context/ThemeContext';

// 1. ADICIONE A IMPORTAÇÃO DO SEU AUTHPROVIDER
import { AuthProvider } from './src/context/AuthContext'; // (Ajuste o caminho se necessário)

// 1. ADICIONADO: Importar o "Cofre" do Carrinho
import { CartProvider } from './src/context/CartContext'; // (Ajuste o caminho se necessário)


// Seu ErrorBoundary (INTOCADO)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.center}>
          <Text style={styles.title}>Algo deu errado.</Text>
          <Button title="Tentar novamente" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}

// Sua função App (INTOCADA, exceto pelo return)
export default function App() {
  useEffect(() => {
    // ... (o seu useEffect de 'expo-notifications' continua igual) ...
    // Suprimir avisos de deprecação...
    if (__DEV__) {
      // ... (seu código de supressão de warnings continua igual) ...
    }
    // Protege a web...
    if (Platform.OS === 'web') return;

    let mounted = true;
    (async () => {
      // ... (seu async de notifications continua igual) ...
    })();

    return () => {
      mounted = false;
    };
  }, []);


  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        {/* A ordem é importante:
          1. AuthProvider (Porteiro) - governa quem está logado.
          2. CartProvider (Cofre) - "ouve" o AuthProvider para saber qual carrinho carregar.
          3. O resto da app.
        */}
        <AuthProvider>
          {/* 2. ADICIONADO: O CartProvider "abraça" tudo que precisa do carrinho */}
          <CartProvider> 
            <FavoritosProvider>
              <TreinosProvider>
                <ThemeProvider>
                  <Routes /> {/* Suas telas (Loja, Carrinho) estão aqui dentro */}
                </ThemeProvider>
              </TreinosProvider>
            </FavoritosProvider>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// Seus estilos (INTOCADOS)
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 12 },
});