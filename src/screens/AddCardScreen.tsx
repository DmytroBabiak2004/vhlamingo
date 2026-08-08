import React, { useEffect, useState } from "react";
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
import { useSettings } from "@/hooks/useSettings";
import { getCustomCards, saveCustomCards } from "@/storage/storage";
import { generateId } from "@/utils/shuffle";
import { useResponsive } from "@/utils/responsive";

type Props = NativeStackScreenProps<RootStackParamList, "AddCard">;

export function AddCardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isShortHeight, isTablet, font, clamp, height } = useResponsive();

  const { settings } = useSettings();
  const [text, setText] = useState("");
  const [cards, setCards] = useState<GameCard[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getCustomCards().then(setCards);
  }, []);

  const persist = async (next: GameCard[]) => {
    setCards(next);
    await saveCustomCards(next);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editingId) {
      const next = cards.map((c) => (c.id === editingId ? { ...c, text: trimmed } : c));
      persist(next);
      setEditingId(null);
    } else {
      const newCard: GameCard = {
        id: generateId(),
        text: trimmed,
        category: "Власна",
        isCustom: true,
      };
      persist([newCard, ...cards]);
    }
    setText("");
    Keyboard.dismiss();
  };

  const handleEdit = (card: GameCard) => {
    setEditingId(card.id);
    setText(card.text);
  };

  const handleDelete = (id: string) => {
    const next = cards.filter((c) => c.id !== id);
    persist(next);
    if (editingId === id) {
      setEditingId(null);
      setText("");
    }
  };

  const buttonHeight = clamp(height * 0.06, 44, 52);
  const titleSize = font(26, 20, 30);

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
            <Text
              style={[styles.title, { fontSize: titleSize }, isShortHeight && { marginBottom: 12 }]}
              maxFontSizeMultiplier={1.2}
            >
              Власні картки
            </Text>

            {/* Форма вводу */}
            <GlassPanel style={styles.inputPanel}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Введи текст завдання..."
                placeholderTextColor={Colors.textSecondary}
                style={[
                  styles.input,
                  { fontSize: font(15, 14, 17) },
                  isShortHeight && { minHeight: 50 },
                ]}
                multiline
                maxFontSizeMultiplier={1.2}
              />
              <GlowButton
                label={editingId ? "Зберегти зміни" : "Додати картку"}
                onPress={handleSubmit}
                hapticsEnabled={settings.hapticsEnabled}
                style={{
                  ...styles.submitButton,
                  height: buttonHeight,
                }}
              />
            </GlassPanel>

            {/* Список створених карток */}
            <FlatList
              data={cards}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={[styles.emptyText, { fontSize: font(14, 13, 16) }]} maxFontSizeMultiplier={1.2}>
                  Ще немає власних карток
                </Text>
              }
              renderItem={({ item }) => (
                <GlassPanel style={styles.cardRow}>
                  <Text
                    style={[styles.cardText, { fontSize: font(14, 13, 16) }]}
                    maxFontSizeMultiplier={1.2}
                  >
                    {item.text}
                  </Text>
                  <View style={styles.rowActions}>
                    <Pressable
                      onPress={() => handleEdit(item)}
                      style={styles.iconButton}
                      hitSlop={8}
                    >
                      <Text style={styles.iconText}>✏️</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDelete(item.id)}
                      style={styles.iconButton}
                      hitSlop={8}
                    >
                      <Text style={styles.iconText}>🗑️</Text>
                    </Pressable>
                  </View>
                </GlassPanel>
              )}
            />

            {/* Кнопка назад */}
            <GlowButton
              label="Назад"
              variant="glass"
              onPress={() => navigation.goBack()}
              hapticsEnabled={settings.hapticsEnabled}
              style={{
                ...styles.backButton,
                height: buttonHeight,
              }}
            />
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
  title: {
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 16,
  },
  inputPanel: {
    marginBottom: 16,
  },
  input: {
    color: Colors.cream,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 12,
    width: "100%",
    justifyContent: "center",
  },
  // FlatList потребує flex:1, інакше на малих екранах список не отримує доступного
  // простору для прокрутки й може обрізатись/не скролитись коректно.
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingBottom: 16,
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
  },
  cardText: {
    flex: 1,
    color: Colors.cream,
    marginRight: 10,
    lineHeight: 20,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: Radius.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  iconText: {
    fontSize: 16,
  },
  backButton: {
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
});
