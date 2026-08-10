import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";
import { Colors, Radius, Shadow } from "@/constants/colors";
import { useResponsive } from "@/utils/responsive";

interface GlassPanelProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export function GlassPanel({ children, style, intensity = 26 }: GlassPanelProps) {
  const { sw, clamp } = useResponsive();
  const defaultPadding = clamp(sw(20), 14, 22);

  return (
    // 1. Додаємо переданий `style` сюди:
    <View style={[styles.shadowWrapper, Shadow.card, style]}>
      <View style={styles.wrapper}>
        <View style={styles.topEdgeHighlight} />

        <BlurView
          intensity={intensity}
          tint="light"
          // 2. Прибираємо `style` звідси (залишаємо тільки padding):
          style={[styles.blur, { padding: defaultPadding }]}
        >
          {children}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: Radius.lg,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
  wrapper: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  topEdgeHighlight: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: Colors.glassBorderTop,
    zIndex: 10,
  },
  blur: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    backgroundColor: Colors.glassLight,
  },
});