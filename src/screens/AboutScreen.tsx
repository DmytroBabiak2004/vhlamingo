import React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { FlamingoLogo } from "@/components/FlamingoLogo";
import { Colors } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export function AboutScreen({ navigation }: Props) {
  const { settings } = useSettings();

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <FlamingoLogo size={90} />
        <Text style={styles.title}>Вхламінго</Text>
        <GlassPanel style={styles.panel}>
          <Text style={styles.text}>
            "Вхламінго" — це карткова гра для веселої компанії друзів. Кожна
            картка приховує завдання, жарт або виклик, які роблять вечір
            яскравішим.
          </Text>
          <Text style={styles.text}>
            Додавайте власні картки, налаштовуйте гру під свою компанію та
            грайте знову і знову — колода щоразу перемішується по-новому.
          </Text>
          <Text style={styles.text}>Грайте відповідально. 🦩</Text>
        </GlassPanel>
        <GlowButton
          label="Назад"
          variant="glass"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hapticsEnabled={settings.hapticsEnabled}
        />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 22,
    paddingBottom: 50,
    alignItems: "center",
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 22,
  },
  panel: {
    width: "100%",
  },
  text: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 23,
    marginBottom: 12,
  },
  backButton: {
    marginTop: 26,
    width: "100%",
  },
});
