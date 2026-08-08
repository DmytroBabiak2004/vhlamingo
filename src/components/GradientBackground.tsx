import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Gradients } from "@/constants/colors";
import { useResponsive } from "@/utils/responsive";

interface GradientBackgroundProps extends PropsWithChildren {
  dark?: boolean;
}

/**
 * Атмосферний адаптивний фон з неоновими розмитими свіченнями для вечірки.
 * Розміри плям рахуються від поточних (а не "заморожених") розмірів вікна,
 * тож коректно перераховуються при повороті екрана чи зміні розмірів (сплітскрін, веб).
 */
export function GradientBackground({ children, dark }: GradientBackgroundProps) {
  const { width, height, isTablet } = useResponsive();
  const colors = dark ? Gradients.backgroundDark : Gradients.background;

  // На планшетах/великих екранах обмежуємо розмір плям, щоб вони не виглядали
  // непропорційно величезними — орієнтуємось на меншу зі сторін.
  const glowBase = isTablet ? Math.min(width, height) * 0.6 : width;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.fill}
    >
      {/* Динамічні світящіся світлові плями, масштабовані під екрани */}
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: glowBase * 0.85,
            height: glowBase * 0.85,
            backgroundColor: Colors.rosePink,
            opacity: 0.22,
            top: -glowBase * 0.25,
            right: -glowBase * 0.2,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: glowBase * 0.95,
            height: glowBase * 0.95,
            backgroundColor: Colors.crimson,
            opacity: 0.25,
            bottom: -glowBase * 0.3,
            left: -glowBase * 0.25,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: glowBase * 0.6,
            height: glowBase * 0.6,
            backgroundColor: "#FF6B6B",
            opacity: 0.12,
            top: height * 0.35,
            left: glowBase * 0.2,
          },
        ]}
      />

      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    position: "relative",
    backgroundColor: Colors.backgroundDark,
    // Кола-підсвітки навмисно виходять за межі контейнера (для ефекту світіння
    // на краю екрана), тому без overflow: "hidden" на вебі (react-native-web)
    // вони збільшують висоту скролу сторінки, хоча видима область не змінюється.
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
  },
});
