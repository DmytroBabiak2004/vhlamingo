import React from "react";
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const isSmallScreen = windowHeight < 670;
  const isTablet = windowWidth >= 768;

  const { settings } = useSettings();

  const logoSize = isSmallScreen ? 75 : 90;
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
          <View style={styles.logoWrapper}>
            <FlamingoLogo size={logoSize} />
            <Text
              style={[styles.title, isSmallScreen && styles.smallTitle]}
              maxFontSizeMultiplier={1.2}
            >
              Вхламінго
            </Text>
          </View>

          <GlassPanel style={styles.panel}>
            <Text style={styles.text} maxFontSizeMultiplier={1.2}>
              "Вхламінго" — це карткова гра для веселої компанії друзів. Кожна
              картка приховує завдання, жарт або виклик, які роблять вечір
              яскравішим.
            </Text>
            <Text style={styles.text} maxFontSizeMultiplier={1.2}>
              Додавайте власні картки, налаштовуйте гру під свою компанію та
              грайте знову і знову — колода щоразу перемішується по-новому.
            </Text>
            <Text style={[styles.text, { marginBottom: 0 }]} maxFontSizeMultiplier={1.2}>
              Грайте відповідально. 🦩
            </Text>
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
  },
  contentWrapper: {
    width: "100%",
    alignItems: "center",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: "800",
    color: Colors.cream,
  },
  smallTitle: {
    fontSize: 24,
    marginTop: 8,
  },
  panel: {
    width: "100%",
    padding: 16,
  },
  text: {
    fontSize: 15,
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