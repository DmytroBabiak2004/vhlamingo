import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AgeGateScreen } from "@/screens/AgeGateScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GradientBackground } from "@/components/GradientBackground";
import { getAgeConfirmed } from "@/storage/storage";

export default function App() {
  // null = ще перевіряємо AsyncStorage, true/false = результат перевірки.
  const [ageConfirmed, setAgeConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAgeConfirmed().then((confirmed) => {
      if (isMounted) setAgeConfirmed(confirmed);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  let content: React.ReactNode;
  if (ageConfirmed === null) {
    // Коротка перевірка сховища при холодному старті — порожній фон замість "стрибка" екрана.
    content = (
      <GradientBackground>
        <View style={{ flex: 1 }} />
      </GradientBackground>
    );
  } else if (!ageConfirmed) {
    content = <AgeGateScreen onConfirm={() => setAgeConfirmed(true)} />;
  } else {
    content = <AppNavigator />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ErrorBoundary>{content}</ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}