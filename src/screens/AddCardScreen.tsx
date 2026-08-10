import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, GameCard } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { Colors, Radius } from "@/constants/colors";
import { BASE_CARDS } from "@/data/cards";
import { useSettings } from "@/hooks/useSettings";
import {
  useCardsStore,
  addCustomCard,
  updateCustomCard,
  deleteCustomCard,
  removeBaseCard,
  restoreBaseCard,
  resetAllToDefaults,
} from "@/store/cardsStore";
import { useResponsive } from "@/utils/responsive";
import { confirmDialog } from "@/utils/confirmDialog";

type Props = NativeStackScreenProps<RootStackParamList, "AddCard">;

const MAX_LENGTH = 140;
type Tab = "custom" | "base";

export function AddCardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isShortHeight, isTablet, font, clamp, height, sw } = useResponsive();

  const { settings } = useSettings();
  const cardsState = useCardsStore();

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("custom");

  const removedSet = useMemo(() => new Set(cardsState.removedBaseIds), [cardsState.removedBaseIds]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editingId) {
      updateCustomCard(editingId, trimmed);
      setEditingId(null);
    } else {
      addCustomCard(trimmed);
    }
    setText("");
    Keyboard.dismiss();
  };

  const handleEdit = (card: GameCard) => {
    setEditingId(card.id);
    setText(card.text);
    setTab("custom");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setText("");
    Keyboard.dismiss();
  };

  const handleDeleteCustom = (id: string) => {
    confirmDialog("Видалити картку?", "Цю дію не можна скасувати.", {
      text: "Видалити",
      style: "destructive",
      onPress: () => {
        deleteCustomCard(id);
        if (editingId === id) handleCancelEdit();
      },
    });
  };

  const handleToggleBaseCard = (card: GameCard) => {
    if (removedSet.has(card.id)) {
      restoreBaseCard(card.id);
    } else {
      removeBaseCard(card.id);
    }
  };

  const handleResetEverything = () => {
    confirmDialog(
      "Відновити всі базові картки?",
      "Власні картки буде видалено, а приховані базові — повернуто в гру.",
      { text: "Відновити", style: "destructive", onPress: () => resetAllToDefaults() }
    );
  };

  const buttonHeight = clamp(height * 0.06, 44, 52);
  const titleSize = font(24, 20, 28);

  const data = tab === "custom" ? cardsState.customCards : BASE_CARDS;

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: Math.max(insets.top + 12, 24),
              paddingBottom: Math.max(insets.bottom + 12, 16),
            },
          ]}
        >
          <View style={[styles.contentWrapper, isTablet && styles.tabletConstraint]}>
            <View style={styles.headerRow}>
              <Text
                style={[styles.title, { fontSize: titleSize }]}
                maxFontSizeMultiplier={1.2}
              >
                Керування картками
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

            {/* Форма додавання/редагування */}
            <GlassPanel style={styles.inputPanel}>
              <TextInput
                value={text}
                onChangeText={(v) => setText(v.slice(0, MAX_LENGTH))}
                placeholder="Введи текст завдання..."
                placeholderTextColor={Colors.textSecondary}
                style={[
                  styles.input,
                  { fontSize: font(15, 14, 17) },
                  isShortHeight && { minHeight: 46 },
                ]}
                multiline
                maxFontSizeMultiplier={1.2}
              />
              <View style={styles.inputFooter}>
                <Text style={[styles.charCount, { fontSize: font(11, 10, 12) }]} maxFontSizeMultiplier={1.2}>
                  {text.length}/{MAX_LENGTH}
                </Text>
                {editingId && (
                  <Pressable onPress={handleCancelEdit} hitSlop={8}>
                    <Text style={[styles.cancelEdit, { fontSize: font(12, 11, 13) }]} maxFontSizeMultiplier={1.2}>
                      Скасувати редагування
                    </Text>
                  </Pressable>
                )}
              </View>
              <GlowButton
                label={editingId ? "Зберегти зміни" : "➕  Додати картку"}
                onPress={handleSubmit}
                hapticsEnabled={settings.hapticsEnabled}
                style={{
                  ...styles.submitButton,
                  height: buttonHeight,
                }}
              />
            </GlassPanel>

            {/* Перемикач вкладок */}
            <View style={styles.tabRow}>
              <Pressable
                onPress={() => setTab("custom")}
                style={[styles.tabButton, tab === "custom" && styles.tabButtonActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { fontSize: font(13, 12, 15) },
                    tab === "custom" && styles.tabTextActive,
                  ]}
                  maxFontSizeMultiplier={1.2}
                >
                  Власні ({cardsState.customCards.length})
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setTab("base")}
                style={[styles.tabButton, tab === "base" && styles.tabButtonActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { fontSize: font(13, 12, 15) },
                    tab === "base" && styles.tabTextActive,
                  ]}
                  maxFontSizeMultiplier={1.2}
                >
                  Базові ({BASE_CARDS.length - cardsState.removedBaseIds.length}/{BASE_CARDS.length})
                </Text>
              </Pressable>
            </View>

            {/* Список карток */}
            <FlatList
              data={data}
              extraData={removedSet}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={[styles.emptyText, { fontSize: font(14, 13, 16) }]} maxFontSizeMultiplier={1.2}>
                  {tab === "custom" ? "Ще немає власних карток" : "Нічого не знайдено"}
                </Text>
              }
              renderItem={({ item }) => {
                const isRemoved = tab === "base" && removedSet.has(item.id);
                return (
                  // Раніше тут стояв GlassPanel (реальний BlurView). У списку, що
                  // скролиться, BlurView перераховує розмиття на кожен кадр і на Android
                  // це інколи "з'їдало" дотик до останнього елемента в рядку (кнопка
                  // видалення) — вона просто не встигала отримати подію натискання.
                  // Для рядка картки справжнє розмиття непринципове візуально, тож
                  // тут легкий View з тим самим виглядом замість BlurView.
                  <View style={[styles.cardRow, isRemoved && styles.cardRowRemoved]}>
                    <View style={styles.cardTextGroup}>
                      <Text
                        style={[
                          styles.cardCategory,
                          { fontSize: font(10, 9, 11) },
                          isRemoved && styles.mutedText,
                        ]}
                        maxFontSizeMultiplier={1.2}
                      >
                        {item.category.toUpperCase()}
                      </Text>
                      <Text
                        style={[
                          styles.cardText,
                          { fontSize: font(14, 13, 16) },
                          isRemoved && styles.mutedText,
                        ]}
                        maxFontSizeMultiplier={1.2}
                      >
                        {item.text}
                      </Text>
                    </View>
                    <View style={styles.rowActions}>
                      {tab === "custom" ? (
                        <>
                          <Pressable
                            onPress={() => handleEdit(item)}
                            style={styles.iconButton}
                          >
                            <Text style={styles.iconText}>✏️</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleDeleteCustom(item.id)}
                            style={styles.iconButton}
                          >
                            <Text style={styles.iconText}>🗑️</Text>
                          </Pressable>
                        </>
                      ) : (
                        <Pressable
                          onPress={() => handleToggleBaseCard(item)}
                          style={[styles.iconButton, isRemoved && styles.restoreButton]}
                        >
                          <Text style={styles.iconText}>{isRemoved ? "↩️" : "🗑️"}</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              }}
            />

            {/* Нижні дії */}
            <View style={[styles.bottomActions, { gap: sw(10) }]}>
              <GlowButton
                label="♻️  Відновити базові"
                variant="glass"
                onPress={handleResetEverything}
                hapticsEnabled={settings.hapticsEnabled}
                style={{ ...styles.bottomButton, height: buttonHeight }}
              />
              <GlowButton
                label="Готово"
                onPress={() => navigation.goBack()}
                hapticsEnabled={settings.hapticsEnabled}
                style={{ ...styles.bottomButton, height: buttonHeight }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontWeight: "800",
    color: Colors.cream,
    flexShrink: 1,
    marginRight: 12,
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
  inputPanel: {
    marginBottom: 14,
  },
  input: {
    color: Colors.cream,
    minHeight: 56,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  charCount: {
    color: Colors.textMuted,
  },
  cancelEdit: {
    color: Colors.rosePink,
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 12,
    width: "100%",
    justifyContent: "center",
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  tabButtonActive: {
    backgroundColor: "rgba(255, 42, 109, 0.22)",
    borderColor: "rgba(255, 42, 109, 0.5)",
  },
  tabText: {
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  tabTextActive: {
    color: Colors.cream,
  },
  // FlatList потребує flex:1, інакше на малих екранах список не отримує доступного
  // простору для прокрутки й може обрізатись/не скролитись коректно.
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingBottom: 12,
    flexGrow: 1,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 30,
  },
  cardRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cardRowRemoved: {
    opacity: 0.5,
  },
  cardTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  cardCategory: {
    color: Colors.rosePink,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardText: {
    color: Colors.cream,
    lineHeight: 20,
  },
  mutedText: {
    color: Colors.textMuted,
  },
  rowActions: {
    flexDirection: "row",
    // Раніше gap:8 разом з hitSlop:8 на обох кнопках давали зони дотику, що
    // перекривались одна в одну впритул — дотик між іконками був неоднозначним
    // і system майже завжди віддавав його першій (олівець), тож видалення
    // фактично не спрацьовувало. Тепер відступ між кнопками більший за сумарний hitSlop.
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  restoreButton: {
    backgroundColor: "rgba(120, 220, 150, 0.18)",
  },
  iconText: {
    fontSize: 16,
  },
  bottomActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  bottomButton: {
    flex: 1,
    justifyContent: "center",
  },
});