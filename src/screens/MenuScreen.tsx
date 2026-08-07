import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Switch,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const isSmallScreen = windowHeight < 670;
  const isTablet = windowWidth >= 768;

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

  const buttonHeight = isSmallScreen ? 44 : 50;

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop: Math.max(insets.top + 12, 24),
            paddingBottom: Math.max(insets.bottom + 16, 32),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentWrapper, isTablet && styles.tabletConstraint]}>
          <Text
            style={[styles.title, isSmallScreen && styles.smallTitle]}
            maxFontSizeMultiplier={1.2}
          >
            Меню
          </Text>

          {/* Статистика колоди */}
          <GlassPanel style={styles.panel}>
            <Text style={styles.panelTitle} maxFontSizeMultiplier={1.2}>
              Колода
            </Text>
            <Text style={styles.panelText} maxFontSizeMultiplier={1.2}>
              Базових карток: {BASE_CARDS.length}
            </Text>
            <Text style={styles.panelText} maxFontSizeMultiplier={1.2}>
              Власних карток: {customCount}
            </Text>
            <Text style={styles.panelText} maxFontSizeMultiplier={1.2}>
              Усього: {BASE_CARDS.length + customCount}
            </Text>
          </GlassPanel>

          {/* Перемикачі Налаштувань */}
          <GlassPanel style={styles.panel}>
            <View style={styles.rowBetween}>
              <Text style={styles.panelTitle} maxFontSizeMultiplier={1.2}>
                Звук
              </Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(v) => update({ soundEnabled: v })}
                trackColor={{ true: Colors.rosePink, false: "rgba(255,255,255,0.2)" }}
                thumbColor={Colors.cream}
              />
            </View>
            <View style={[styles.rowBetween, { marginTop: 12 }]}>
              <Text style={styles.panelTitle} maxFontSizeMultiplier={1.2}>
                Вібрація
              </Text>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(v) => update({ hapticsEnabled: v })}
                trackColor={{ true: Colors.rosePink, false: "rgba(255,255,255,0.2)" }}
                thumbColor={Colors.cream}
              />
            </View>
          </GlassPanel>

          {/* Кнопки меню */}
          <View style={[styles.buttonGroup, isSmallScreen && { gap: 10 }]}>
            <GlowButton
              label="Додати власні картки"
              onPress={() => navigation.navigate("AddCard")}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="Скинути власні картки"
              variant="glass"
              onPress={handleResetCustom}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="Перемішати колоду"
              variant="glass"
              onPress={handleReshuffleFromMenu}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="Правила гри"
              variant="glass"
              onPress={() => navigation.navigate("Rules")}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="Про гру"
              variant="glass"
              onPress={() => navigation.navigate("About")}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="Назад до гри"
              onPress={() => navigation.goBack()}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 18,
  },
  smallTitle: {
    fontSize: 24,
    marginBottom: 14,
  },
  panel: {
    marginBottom: 14,
    padding: 14,
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
    marginTop: 6,
    gap: 12,
  },
  button: {
    width: "100%",
    justifyContent: "center",
  },
});