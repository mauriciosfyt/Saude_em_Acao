import { Platform, Button, View } from "react-native";
import React, { useEffect } from "react";

// Nota: evitar importar "expo-notifications" no topo do módulo para não
// disparar mensagens/initializers quando o bundle for carregado na web.
// Em vez disso, fazemos import dinâmico somente em plataformas nativas.
let NotificationsModule = null;
async function getNotifications() {
  if (Platform.OS === 'web') return null;
  if (!NotificationsModule) {
    // carregamento dinâmico — somente em mobile
    // eslint-disable-next-line global-require
    NotificationsModule = await import('expo-notifications');
  }
  return NotificationsModule;
}

// Função para pedir permissão e pegar o token
export async function registerForPushNotificationsAsync() {
  let token;

  // Não tentar registrar notificações na web
  if (Platform.OS === 'web') {
    if (__DEV__) console.log('Push notifications are not yet fully supported on web');
    return null;
  }

  const Notifications = await getNotifications();
  if (!Notifications) return null;

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
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  if (__DEV__) console.log("Token de notificação:", token);

  return token;
}

// Função para disparar notificação local
export async function scheduleNotification() {
  const Notifications = await getNotifications();
  if (!Notifications) return null;

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
    let mounted = true;

    (async () => {
      if (Platform.OS === 'web') return;
      try {
        const Notifications = await getNotifications();
        // configura handler mínimo (mobile only)
        Notifications?.setNotificationHandler?.({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        // opcional: registrar token para este componente (se necessário)
        // await registerForPushNotificationsAsync();
      } catch (err) {
        if (__DEV__) console.log('Notifications init skipped/failed (mobile only):', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ marginTop: 50, alignItems: "center" }}>
      <Button title="Testar Notificação" onPress={scheduleNotification} />
    </View>
  );
}
