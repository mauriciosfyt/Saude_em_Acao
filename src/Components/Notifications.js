import * as Notifications from "expo-notifications";
import { Platform, Button, View } from "react-native";
import React, { useEffect } from "react";

// Configuração para exibir notificação mesmo com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Função para pedir permissão e pegar o token
export async function registerForPushNotificationsAsync() {
  let token;

  // Configuração do canal Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Solicitar permissão para notificações
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permissão para notificações negada!");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Token de notificação:", token);

  return token;
}

// Função para disparar notificação local
export async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Saúde em Ação 💪",
      body: "Não esqueça de registrar seu treino hoje!",
      data: { info: "treino" },
    },
    trigger: { seconds: 5 }, // dispara em 5s
  });
}

// 🔹 Componente de teste que você pode renderizar
export default function NotificationsTest() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={{ marginTop: 50, alignItems: "center" }}>
      <Button title="Testar Notificação" onPress={scheduleNotification} />
    </View>
  );
}
