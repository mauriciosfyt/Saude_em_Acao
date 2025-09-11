// src/Components/sounds.js
import { Audio } from "expo-av";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

let soundObject;

// Função para tocar som de conclusão de treino
export async function playSuccessSound() {
  try {
    if (soundObject) {
      await soundObject.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/Audio_btn.mp3") // caminho corrigido
    );

    soundObject = sound;
    await soundObject.playAsync();
  } catch (error) {
    console.log("Erro ao reproduzir som:", error);
  }
}

// Função para tocar som de erro
export async function playErrorSound() {
  try {
    if (soundObject) {
      await soundObject.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/Audio_erro.mp3") // caminho corrigido
    );

    soundObject = sound;
    await soundObject.playAsync();
  } catch (error) {
    console.log("Erro ao reproduzir som:", error);
  }
}

// Botão de teste (só aparece no modo DEV)
export function TestSoundButton({ soundFunction, label }) {
  if (!__DEV__) return null;

  return (
    <TouchableOpacity
      style={styles.testButton}
      onPress={async () => {
        try {
          await soundFunction();
        } catch (error) {
          console.log("Erro ao tocar som:", error);
        }
      }}
    >
      <Text style={{ color: "#2563eb" }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  testButton: {
    marginLeft: 10,
    padding: 6,
    backgroundColor: "#dbeafe",
    borderRadius: 6,
  },
});
