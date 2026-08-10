import React from "react";
import { StyleSheet, Text, View, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { Colors } from "@/constants/colors";
import { BASE_CARDS } from "@/data/cards";
import { useSettings } from "@/hooks/useSettings";
import { useCardsStore, resetAllToDefaults } from "@/store/cardsStore";
import { clearUsedCardIds } from "@/storage/storage";
import { useResponsive } from "@/utils/responsive";
import { confirmDialog } from "@/utils/confirmDialog";

type Props = NativeStackScreenProps<RootStackParamList, "Menu">;

function SectionLabel({ children }: { children: string }) {
  const { font } = useResponsive();
  return (
    <Text style={[styles.sectionLabel, { fontSize: font(12, 11, 13) }]} maxFontSizeMultiplier={1.2}>
      {children}
    </Text>
  );
}

export function MenuScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isShortHeight, isTablet, font, clamp, height } = useResponsive();

  const { settings, update } = useSettings();
  const cardsState = useCardsStore();

  const removedBaseCount = cardsState.removedBaseIds.length;
  const activeBaseCount = BASE_CARDS.length - removedBaseCount;
  const customCount = cardsState.customCards.length;
  const totalActive = activeBaseCount + customCount;

  const handleResetEverything = () => {
    confirmDialog(
      "Скинути все до базових карток?",
      "Усі власні картки буде видалено, а приховані базові картки — повернуто. Прогрес поточної гри теж скинеться.",
      {
        text: "Скинути",
        style: "destructive",
        onPress: async () => {
          await resetAllToDefaults();
        },
      }
    );
  };

  const handleReshuffleFromMenu = () => {
    // Це інформаційне повідомлення, а не запит підтвердження, але дія
    // (clearUsedCardIds) виконується саме в onPress кнопки — на вебі
    // порожня заглушка Alert.alert цей onPress ніколи не викличе, тож
    // перемішування колоди мовчки "не спрацьовувало б". Виконуємо дію
    // одразу, а сповіщення показуємо окремо через confirmDialog.
    clearUsedCardIds();
    confirmDialog("Колоду перемішано", "Поверніться на головний екран, щоб продовжити гру.", {
      text: "Гаразд",
    });
  };

  const buttonHeight = clamp(height * 0.06, 44, 52);
  const titleSize = font(28, 22, 32);

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
          <View style={styles.headerRow}>
            <Text
              style={[styles.title, { fontSize: titleSize }, isShortHeight && { marginBottom: 0 }]}
              maxFontSizeMultiplier={1.2}
            >
              Меню
            </Text>
            <GlowButton
              label="Закрити"
              variant="glass"
              compact
              icon={<Text style={styles.closeGlyph}>✕</Text>}
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </View>

          {/* Статистика колоди */}
          <SectionLabel>КОЛОДА</SectionLabel>
          <GlassPanel style={styles.panel}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={[styles.statNumber, { fontSize: font(22, 19, 25) }]} maxFontSizeMultiplier={1.2}>
                  {totalActive}
                </Text>
                <Text style={[styles.statCaption, { fontSize: font(11, 10, 12) }]} maxFontSizeMultiplier={1.2}>
                  усього в грі
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={[styles.statNumber, { fontSize: font(22, 19, 25) }]} maxFontSizeMultiplier={1.2}>
                  {activeBaseCount}
                </Text>
                <Text style={[styles.statCaption, { fontSize: font(11, 10, 12) }]} maxFontSizeMultiplier={1.2}>
                  базових
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={[styles.statNumber, { fontSize: font(22, 19, 25) }]} maxFontSizeMultiplier={1.2}>
                  {customCount}
                </Text>
                <Text style={[styles.statCaption, { fontSize: font(11, 10, 12) }]} maxFontSizeMultiplier={1.2}>
                  власних
                </Text>
              </View>
            </View>
            {removedBaseCount > 0 && (
              <Text style={[styles.removedNote, { fontSize: font(12, 11, 13) }]} maxFontSizeMultiplier={1.2}>
                Приховано базових карток: {removedBaseCount}
              </Text>
            )}
          </GlassPanel>

          {/* Перемикачі Налаштувань */}
          <SectionLabel>НАЛАШТУВАННЯ</SectionLabel>
          <GlassPanel style={styles.panel}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabelGroup}>
                <Text style={styles.switchEmoji}>🔊</Text>
                <Text style={[styles.panelTitle, { fontSize: font(16, 14, 18) }]} maxFontSizeMultiplier={1.2}>
                  Звук
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(v) => update({ soundEnabled: v })}
                trackColor={{ true: Colors.rosePink, false: "rgba(255,255,255,0.2)" }}
                thumbColor={Colors.cream}
              />
            </View>
            <View style={styles.rowSeparator} />
            <View style={styles.switchRow}>
              <View style={styles.switchLabelGroup}>
                <Text style={styles.switchEmoji}>📳</Text>
                <Text style={[styles.panelTitle, { fontSize: font(16, 14, 18) }]} maxFontSizeMultiplier={1.2}>
                  Вібрація
                </Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(v) => update({ hapticsEnabled: v })}
                trackColor={{ true: Colors.rosePink, false: "rgba(255,255,255,0.2)" }}
                thumbColor={Colors.cream}
              />
            </View>
          </GlassPanel>

          {/* Керування картками */}
          <SectionLabel>КАРТКИ</SectionLabel>
          <View style={[styles.buttonGroup, isShortHeight && { gap: 10 }]}>
            <GlowButton
              label="✏️  Керувати картками"
              onPress={() => navigation.navigate("AddCard")}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="🔀  Перемішати колоду"
              variant="glass"
              onPress={handleReshuffleFromMenu}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="♻️  Відновити базові картки"
              variant="glass"
              onPress={handleResetEverything}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </View>

          {/* Інформація */}
          <SectionLabel>ІНФОРМАЦІЯ</SectionLabel>
          <View style={[styles.buttonGroup, isShortHeight && { gap: 10 }]}>
            <GlowButton
              label="📖  Правила гри"
              variant="glass"
              onPress={() => navigation.navigate("Rules")}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
            <GlowButton
              label="🦩  Про гру"
              variant="glass"
              onPress={() => navigation.navigate("About")}
              style={{ ...styles.button, height: buttonHeight }}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </View>

          <GlowButton
            label="Назад до гри"
            onPress={() => navigation.goBack()}
            style={{ ...styles.backToGameButton, height: buttonHeight }}
            hapticsEnabled={settings.hapticsEnabled}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  contentWrapper: {
    width: "100%",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontWeight: "800",
    color: Colors.cream,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  closeGlyph: {
    color: Colors.cream,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 8,
    marginTop: 4,
  },
  panel: {
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  statNumber: {
    fontWeight: "800",
    color: Colors.cream,
  },
  statCaption: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  removedNote: {
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: "center",
  },
  panelTitle: {
    fontWeight: "700",
    color: Colors.cream,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  switchLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchEmoji: {
    fontSize: 18,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 10,
  },
  buttonGroup: {
    marginBottom: 18,
    gap: 12,
    width: "100%",
  },
  button: {
    width: "100%",
    justifyContent: "center",
  },
  backToGameButton: {
    width: "100%",
    justifyContent: "center",
    marginTop: 4,
  },
});