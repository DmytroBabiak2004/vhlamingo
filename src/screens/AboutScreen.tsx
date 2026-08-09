import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { FlamingoLogo } from "@/components/FlamingoLogo";
import { Colors } from "@/constants/colors";
import { RESPONSIBLE_PLAY_NOTE, PRIVACY_POLICY_URL } from "@/constants/legal";
import { useSettings } from "@/hooks/useSettings";
import { useResponsive } from "@/utils/responsive";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export function AboutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isShortHeight, isTablet, font, clamp, height } = useResponsive();

  const { settings } = useSettings();

  const logoSize = clamp(height * 0.11, 70, 90);
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
          <View style={[styles.logoWrapper, isShortHeight && { marginBottom: 12 }]}>
            <FlamingoLogo size={logoSize} />
            <Text
              style={[styles.title, { fontSize: titleSize }]}
              maxFontSizeMultiplier={1.2}
            >
              Вхламінго
            </Text>
          </View>

          <GlassPanel style={styles.panel}>
            <Text style={[styles.text, { fontSize: font(15, 14, 17) }]} maxFontSizeMultiplier={1.2}>
              "Вхламінго" — це карткова гра для веселої компанії друзів. Кожна
              картка приховує завдання, жарт або виклик, які роблять вечір
              яскравішим.
            </Text>
            <Text
              style={[styles.text, { fontSize: font(15, 14, 17), marginBottom: 0 }]}
              maxFontSizeMultiplier={1.2}
            >
              Додавайте власні картки, налаштовуйте гру під свою компанію та
              грайте знову і знову — колода щоразу перемішується по-новому.
            </Text>
          </GlassPanel>

          <GlassPanel style={styles.disclaimerPanel}>
            <Text style={[styles.disclaimerTitle, { fontSize: font(13, 12, 14) }]} maxFontSizeMultiplier={1.2}>
              🔞 18+
            </Text>
            <Text style={[styles.disclaimerText, { fontSize: font(13, 12, 15) }]} maxFontSizeMultiplier={1.2}>
              {RESPONSIBLE_PLAY_NOTE}
            </Text>
          </GlassPanel>

          <Pressable
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            hitSlop={8}
            style={styles.privacyLinkWrapper}
          >
            <Text style={[styles.privacyLink, { fontSize: font(13, 12, 15) }]} maxFontSizeMultiplier={1.2}>
              Політика конфіденційності
            </Text>
          </Pressable>

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
    fontWeight: "800",
    color: Colors.cream,
  },
  panel: {
    width: "100%",
    marginBottom: 14,
  },
  disclaimerPanel: {
    width: "100%",
    borderColor: "rgba(255, 42, 109, 0.35)",
  },
  disclaimerTitle: {
    fontWeight: "800",
    color: Colors.rosePink,
    letterSpacing: 1,
    marginBottom: 6,
  },
  disclaimerText: {
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  privacyLinkWrapper: {
    marginTop: 16,
    padding: 4,
  },
  privacyLink: {
    color: Colors.textMuted,
    textDecorationLine: "underline",
  },
  text: {
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