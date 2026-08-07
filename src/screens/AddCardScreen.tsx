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
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, GameCard } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { Colors, Radius } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";
import { getCustomCards, saveCustomCards } from "@/storage/storage";
import { generateId } from "@/utils/shuffle";

type Props = NativeStackScreenProps<RootStackParamList, "AddCard">;

export function AddCardScreen({ navigation }: Props) {
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

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Власні картки</Text>

          <GlassPanel style={styles.inputPanel}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Введи текст завдання..."
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              multiline
            />
            <GlowButton
              label={editingId ? "Зберегти зміни" : "Додати картку"}
              onPress={handleSubmit}
              hapticsEnabled={settings.hapticsEnabled}
              style={styles.submitButton}
            />
          </GlassPanel>

          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Ще немає власних карток</Text>
            }
            renderItem={({ item }) => (
              <GlassPanel style={styles.cardRow}>
                <Text style={styles.cardText}>{item.text}</Text>
                <View style={styles.rowActions}>
                  <Pressable onPress={() => handleEdit(item)} style={styles.iconButton}>
                    <Text style={styles.iconText}>✏️</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                    <Text style={styles.iconText}>🗑️</Text>
                  </Pressable>
                </View>
              </GlassPanel>
            )}
          />

          <GlowButton
            label="Назад"
            variant="glass"
            onPress={() => navigation.goBack()}
            hapticsEnabled={settings.hapticsEnabled}
            style={styles.backButton}
          />
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 16,
  },
  inputPanel: {
    marginBottom: 16,
  },
  input: {
    color: Colors.cream,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 14,
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 30,
  },
  cardRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardText: {
    flex: 1,
    color: Colors.cream,
    fontSize: 14,
    marginRight: 10,
  },
  rowActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: Radius.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  iconText: {
    fontSize: 16,
  },
  backButton: {
    marginBottom: 20,
  },
});
