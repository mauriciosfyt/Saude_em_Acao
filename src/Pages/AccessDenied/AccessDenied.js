import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const AccessDenied = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso restrito</Text>
      <Text style={styles.message}>
        Seu plano atual não permite acesso ao aplicativo. Faça upgrade para o Plano Gold
        ou contate um administrador.
      </Text>

      <TouchableOpacity style={styles.buttonSecondary} onPress={handleLogout}>
        <Text style={styles.buttonSecondaryText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonPrimary: {
    backgroundColor: '#3aad94',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonSecondaryText: {
    color: '#3aad94',
    fontWeight: '600',
  },
});

export default AccessDenied;