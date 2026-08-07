import React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { Colors } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";

type Props = NativeStackScreenProps<RootStackParamList, "Rules">;

const RULES = [
  "Гравці сідають у коло та по черзі натискають на картку.",
  "До натискання видно лише закриту картку з логотипом.",
  "Після натискання картка перевертається, показуючи завдання.",
  "Виконайте завдання чесно — саме в цьому вся суть гри.",
  "Натисніть 'Наступна картка', щоб передати хід далі.",
  "Картки не повторюються, поки не закінчиться вся колода.",
  "Коли колода закінчиться — можна перемішати її заново.",
  "Грайте відповідально та знайте свою міру.",
];

export function RulesScreen({ navigation }: Props) {
  const { settings } = useSettings();

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Правила гри</Text>
        <GlassPanel>
          {RULES.map((rule, index) => (
            <Text key={index} style={styles.ruleText}>
              {index + 1}. {rule}
            </Text>
          ))}
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
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 22,
  },
  ruleText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 24,
  },
});
