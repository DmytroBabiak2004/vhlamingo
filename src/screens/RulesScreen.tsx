import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { Colors } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";
import { useResponsive } from "@/utils/responsive";

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
  const insets = useSafeAreaInsets();
  const { isShortHeight, isTablet, font, clamp, height } = useResponsive();

  const { settings } = useSettings();
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
          <Text
            style={[styles.title, { fontSize: titleSize }, isShortHeight && { marginBottom: 14 }]}
            maxFontSizeMultiplier={1.2}
          >
            Правила гри
          </Text>

          <GlassPanel style={styles.panel}>
            {RULES.map((rule, index) => (
              <Text
                key={index}
                style={[
                  styles.ruleText,
                  { fontSize: font(15, 14, 17) },
                  index === RULES.length - 1 && { marginBottom: 0 },
                ]}
                maxFontSizeMultiplier={1.2}
              >
                {index + 1}. {rule}
              </Text>
            ))}
          </GlassPanel>

          <GlowButton
            label="Назад"
            variant="glass"
            onPress={() => navigation.goBack()}
            style={{
              ...styles.backButton,
              height: buttonHeight,
            }}
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
  title: {
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 18,
  },
  panel: {},
  ruleText: {
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  backButton: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
  },
});
