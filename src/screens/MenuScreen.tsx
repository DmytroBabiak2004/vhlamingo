import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, Switch } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { Colors } from "@/constants/colors";
import { BASE_CARDS } from "@/data/cards";
import { useSettings } from "@/hooks/useSettings";
import {
  getCustomCards,
  clearCustomCards,
  clearUsedCardIds,
} from "@/storage/storage";

type Props = NativeStackScreenProps<RootStackParamList, "Menu">;

export function MenuScreen({ navigation }: Props) {
  const { settings, update } = useSettings();
  const [customCount, setCustomCount] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCustomCards().then((cards) => setCustomCount(cards.length));
    });
    return unsubscribe;
  }, [navigation]);

  const handleResetCustom = () => {
    Alert.alert(
      "Скинути власні картки?",
      "Усі додані вами картки буде видалено безповоротно.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Скинути",
          style: "destructive",
          onPress: async () => {
            await clearCustomCards();
            setCustomCount(0);
          },
        },
      ]
    );
  };

  const handleReshuffleFromMenu = () => {
    Alert.alert("Колоду перемішано", "Поверніться на головний екран, щоб продовжити гру.", [
      {
        text: "Гаразд",
        onPress: async () => {
          await clearUsedCardIds();
        },
      },
    ]);
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Меню</Text>

        <GlassPanel style={styles.panel}>
          <Text style={styles.panelTitle}>Колода</Text>
          <Text style={styles.panelText}>
            Базових карток: {BASE_CARDS.length}
          </Text>
          <Text style={styles.panelText}>Власних карток: {customCount}</Text>
          <Text style={styles.panelText}>
            Усього: {BASE_CARDS.length + customCount}
          </Text>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <View style={styles.rowBetween}>
            <Text style={styles.panelTitle}>Звук</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => update({ soundEnabled: v })}
              trackColor={{ true: Colors.rosePink, false: "rgba(255,255,255,0.2)" }}
              thumbColor={Colors.cream}
            />
          </View>
          <View style={[styles.rowBetween, { marginTop: 14 }]}>
            <Text style={styles.panelTitle}>Вібрація</Text>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => update({ hapticsEnabled: v })}
              trackColor={{ true: Colors.rosePink, false: "rgba(255,255,255,0.2)" }}
              thumbColor={Colors.cream}
            />
          </View>
        </GlassPanel>

        <View style={styles.buttonGroup}>
          <GlowButton
            label="Додати власні картки"
            onPress={() => navigation.navigate("AddCard")}
            style={styles.button}
            hapticsEnabled={settings.hapticsEnabled}
          />
          <GlowButton
            label="Скинути власні картки"
            variant="glass"
            onPress={handleResetCustom}
            style={styles.button}
            hapticsEnabled={settings.hapticsEnabled}
          />
          <GlowButton
            label="Перемішати колоду"
            variant="glass"
            onPress={handleReshuffleFromMenu}
            style={styles.button}
            hapticsEnabled={settings.hapticsEnabled}
          />
          <GlowButton
            label="Правила гри"
            variant="glass"
            onPress={() => navigation.navigate("Rules")}
            style={styles.button}
            hapticsEnabled={settings.hapticsEnabled}
          />
          <GlowButton
            label="Про гру"
            variant="glass"
            onPress={() => navigation.navigate("About")}
            style={styles.button}
            hapticsEnabled={settings.hapticsEnabled}
          />
          <GlowButton
            label="Назад до гри"
            onPress={() => navigation.goBack()}
            style={styles.button}
            hapticsEnabled={settings.hapticsEnabled}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 22,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 22,
  },
  panel: {
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.cream,
    marginBottom: 4,
  },
  panelText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonGroup: {
    marginTop: 10,
    gap: 14,
  },
  button: {
    width: "100%",
  },
});
