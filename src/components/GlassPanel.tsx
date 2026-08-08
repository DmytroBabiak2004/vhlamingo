import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { Colors, Radius, Shadow } from "@/constants/colors";
import { useResponsive } from "@/utils/responsive";

interface GlassPanelProps extends PropsWithChildren {
  style?: ViewStyle;
  intensity?: number;
}

/**
 * Раніше `style` (напр. padding) застосовувався до зовнішнього wrapper,
 * а внутрішній BlurView мав власний фіксований padding: 22 — тобто відступи
 * подвоювались і панелі виглядали непропорційно "товстими" на малих екранах.
 * Тепер `style` іде напряму на внутрішній BlurView, а дефолтний padding
 * масштабується під розмір екрана.
 */
export function GlassPanel({ children, style, intensity = 26 }: GlassPanelProps) {
  const { sw, clamp } = useResponsive();
  const defaultPadding = clamp(sw(20), 14, 22);

  return (
    <View style={[styles.wrapper, Shadow.card]}>
      {/* Highlight Edge for 3D Specular Look */}
      <View style={styles.topEdgeHighlight} />

      <BlurView
        intensity={intensity}
        tint="light"
        style={[styles.blur, { padding: defaultPadding }, style]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
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
