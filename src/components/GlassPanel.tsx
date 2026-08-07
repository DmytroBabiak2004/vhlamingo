import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { Colors, Radius, Shadow } from "@/constants/colors";

interface GlassPanelProps extends PropsWithChildren {
  style?: ViewStyle;
  intensity?: number;
}

export function GlassPanel({ children, style, intensity = 26 }: GlassPanelProps) {
  return (
    <View style={[styles.wrapper, Shadow.card, style]}>
      {/* Highlight Edge for 3D Specular Look */}
      <View style={styles.topEdgeHighlight} />
      
      <BlurView intensity={intensity} tint="light" style={styles.blur}>
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
    padding: 22,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    backgroundColor: Colors.glassLight,
  },
});
