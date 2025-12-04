import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BotaoSeta = ({ onPress }) => (
  <TouchableOpacity style={{ padding: 8 }} onPress={onPress}>
    <Ionicons name="arrow-back" size={24} color="white" />
  </TouchableOpacity>
);

export default BotaoSeta;
