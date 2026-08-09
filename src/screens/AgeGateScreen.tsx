import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { FlamingoLogo } from "@/components/FlamingoLogo";
import { Colors } from "@/constants/colors";
import { AGE_GATE_TITLE, AGE_GATE_BODY, AGE_GATE_BULLETS } from "@/constants/legal";
import { saveAgeConfirmed } from "@/storage/storage";
import { useResponsive } from "@/utils/responsive";

interface AgeGateScreenProps {
  onConfirm: () => void;
}

/**
 * Показується один раз при першому запуску (до будь-якого іншого екрана),
 * поки користувач не підтвердить, що йому 18+ і він ознайомлений із
 * застереженням про відповідальну гру. Підтвердження зберігається в
 * AsyncStorage, тому вдруге цей екран не зʼявляється.
 */
export function AgeGateScreen({ onConfirm }: AgeGateScreenProps) {
  const insets = useSafeAreaInsets();
  const { isTablet, font, clamp, height } = useResponsive();
  const [declined, setDeclined] = useState(false);

  const buttonHeight = clamp(height * 0.06, 44, 52);
  const logoSize = clamp(height * 0.09, 56, 78);
  const titleSize = font(24, 20, 28);

  const handleConfirm = async () => {
    await saveAgeConfirmed(true);
    onConfirm();
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (declined) {
    return (
      <GradientBackground>
        <View
          style={[
            styles.blockContainer,
            { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <Text style={[styles.blockEmoji]}>🚫</Text>
          <Text style={[styles.blockTitle, { fontSize: font(22, 19, 26) }]} maxFontSizeMultiplier={1.2}>
            Доступ обмежено
          </Text>
          <Text style={[styles.blockText, { fontSize: font(15, 14, 17) }]} maxFontSizeMultiplier={1.2}>
            Цей застосунок призначений виключно для користувачів 18 років і старше. Повертайтесь, коли
            досягнете повноліття 🙂
          </Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={[styles.content, isTablet && styles.tabletConstraint]}>
          <View style={styles.logoWrapper}>
            <FlamingoLogo size={logoSize} />
          </View>

          <Text
            style={[styles.title, { fontSize: titleSize }]}
            maxFontSizeMultiplier={1.2}
          >
            {AGE_GATE_TITLE}
          </Text>

          <GlassPanel style={styles.panel}>
            <Text style={[styles.body, { fontSize: font(14, 13, 16) }]} maxFontSizeMultiplier={1.2}>
              {AGE_GATE_BODY}
            </Text>

            <View style={styles.bulletList}>
              {AGE_GATE_BULLETS.map((bullet, index) => (
                <View key={index} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text
                    style={[styles.bulletText, { fontSize: font(13, 12, 15) }]}
                    maxFontSizeMultiplier={1.2}
                  >
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          </GlassPanel>

          <View style={styles.actions}>
            <GlowButton
              label="Мені 18+, продовжити"
              onPress={handleConfirm}
              style={{ ...styles.confirmButton, height: buttonHeight }}
            />
            <Pressable onPress={handleDecline} hitSlop={8} style={styles.declineWrapper}>
              <Text style={[styles.declineText, { fontSize: font(13, 12, 15) }]} maxFontSizeMultiplier={1.2}>
                Мені менше 18 років
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  logoWrapper: {
    marginBottom: 14,
  },
  title: {
    fontWeight: "800",
    color: Colors.cream,
    textAlign: "center",
    marginBottom: 16,
  },
  panel: {
    width: "100%",
    marginBottom: 22,
  },
  body: {
    color: Colors.textPrimary,
    lineHeight: 21,
    marginBottom: 14,
  },
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletDot: {
    color: Colors.rosePink,
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 19,
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  confirmButton: {
    width: "100%",
    justifyContent: "center",
  },
  declineWrapper: {
    marginTop: 16,
    padding: 4,
  },
  declineText: {
    color: Colors.textMuted,
    textDecorationLine: "underline",
  },
  blockContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  blockEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  blockTitle: {
    fontWeight: "800",
    color: Colors.cream,
    marginBottom: 12,
    textAlign: "center",
  },
  blockText: {
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});