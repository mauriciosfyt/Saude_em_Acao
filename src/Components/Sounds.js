// src/Components/sounds.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Use expo-audio (assume installed). This avoids importing expo-av and the deprecation warning.
let createAudioPlayer;
let setAudioModeAsync;
let audioSource = 'none';
try {
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  const maybeAudio = require('expo-audio');
  createAudioPlayer = maybeAudio.createAudioPlayer || maybeAudio.default?.createAudioPlayer;
  setAudioModeAsync = maybeAudio.setAudioModeAsync || maybeAudio.default?.setAudioModeAsync;
  if (typeof createAudioPlayer === 'function') {
    audioSource = 'expo-audio';
  } else {
    throw new Error('expo-audio missing createAudioPlayer');
  }
} catch (e) {
  // If expo-audio isn't available (shouldn't happen after install), log and set audioSource to none.
  if (__DEV__) console.warn('[Sounds] expo-audio not available:', e?.message || e);
  audioSource = 'none';
}
// Informativo: qual implementação foi selecionada (útil para depuração)
  try {
    if (__DEV__) console.debug('[Sounds] audio implementation:', audioSource);
  } catch (e) {}

// Tentar configurar modo de áudio para tocar mesmo com silent/mute (iOS simulador etc.)
try {
  if (typeof setAudioModeAsync === 'function') {
    // Chamada sem await; se falhar, será capturada
    setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }
} catch (e) {}

let soundObject;
let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
}

export function getSoundEnabled() {
  return soundEnabled;
}

// Função para tocar som de conclusão de treino
export async function playSuccessSound() {
  try {
    if (!soundEnabled) return;

    // Prefer expo-audio player
    if (audioSource === 'expo-audio' && typeof createAudioPlayer === 'function') {
      try {
        if (soundObject && typeof soundObject.replace === 'function') {
          soundObject.replace(require("../../assets/sounds/Audio_btn.mp3"));
          if (typeof soundObject.play === 'function') soundObject.play();
          return;
        }
        const player = createAudioPlayer(require("../../assets/sounds/Audio_btn.mp3"));
        soundObject = player;
        if (player && typeof player.play === 'function') player.play();
        return;
      } catch (e) {
        console.log('expo-audio play failed, falling back to expo-av:', e);
      }
    }

    console.warn('Nenhuma implementação de áudio disponível para reproduzir playSuccessSound (expo-audio não disponível)');
  } catch (error) {
    console.log("Erro ao reproduzir som:", error);
  }
}

// Função para tocar som de erro
export async function playErrorSound() {
  try {
    if (!soundEnabled) return;

    // Prefer expo-audio player
    if (audioSource === 'expo-audio' && typeof createAudioPlayer === 'function') {
      try {
        if (soundObject && typeof soundObject.replace === 'function') {
          soundObject.replace(require("../../assets/sounds/Audio_erro.mp3"));
          if (typeof soundObject.play === 'function') soundObject.play();
          return;
        }
        const player = createAudioPlayer(require("../../assets/sounds/Audio_erro.mp3"));
        soundObject = player;
        if (player && typeof player.play === 'function') player.play();
        return;
      } catch (e) {
        console.log('expo-audio play failed, falling back to expo-av:', e);
      }
    }

    console.warn('Nenhuma implementação de áudio disponível para reproduzir playErrorSound (expo-audio não disponível)');
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
