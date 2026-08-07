import React, { PropsWithChildren } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Gradients } from "@/constants/colors";

const { width, height } = Dimensions.get("window");

interface GradientBackgroundProps extends PropsWithChildren {
  dark?: boolean;
}

/**
 * Атмосферний адаптивний фон з неоновими розмитими свіченнями для вечірки.
 */
export function GradientBackground({ children, dark }: GradientBackgroundProps) {
  const colors = dark ? Gradients.backgroundDark : Gradients.background;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.fill}
    >
      {/* Динамічні світящіся світлові плями, масштабовані під екрани */}
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowCenter]} />

      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    position: "relative",
    backgroundColor: Colors.backgroundDark,
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
  },
  glowTop: {
    width: width * 0.85,
    height: width * 0.85,
    backgroundColor: Colors.rosePink,
    opacity: 0.22,
    top: -width * 0.25,
    right: -width * 0.2,
  },
  glowBottom: {
    width: width * 0.95,
    height: width * 0.95,
    backgroundColor: Colors.crimson,
    opacity: 0.25,
    bottom: -width * 0.3,
    left: -width * 0.25,
  },
  glowCenter: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: "#FF6B6B",
    opacity: 0.12,
    top: height * 0.35,
    left: width * 0.2,
  },
});
