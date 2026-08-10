import React, { PropsWithChildren } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Gradients } from "@/constants/colors";

interface GradientBackgroundProps extends PropsWithChildren {
  dark?: boolean;
}

export function GradientBackground({ children, dark }: GradientBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const colors = dark ? Gradients.backgroundDark : Gradients.background;

  const isTablet = Math.min(width, height) > 600;
  const glowBase = isTablet ? Math.min(width, height) * 0.6 : width;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.fill}
    >
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
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
  },
});
