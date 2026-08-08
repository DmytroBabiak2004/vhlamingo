import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Shadow } from "@/constants/colors";
import { useResponsive } from "@/utils/responsive";

interface CardCounterProps {
  shown: number;
  total: number;
}

export function CardCounter({ shown, total }: CardCounterProps) {
  const { font, sw } = useResponsive();
  const progressPercent = total > 0 ? Math.min((shown / total) * 100, 100) : 0;
  const fontSize = font(14, 12, 15);

  return (
    <View style={[styles.pill, Shadow.subtle, { paddingHorizontal: sw(20) }]}>
      {/* Specular Top Border Accent */}
      <View style={styles.topBorderHighlight} />

      {/* Active Progress Capsule Fill */}
      <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />

      <View style={styles.contentRow}>
        <View style={styles.liveIndicator} />
        <Text style={{ fontSize, fontWeight: "700", letterSpacing: 0.8 }}>
          <Text style={styles.shownText}>{shown}</Text>
          <Text style={styles.dividerText}> / </Text>
          <Text style={styles.totalText}>{total}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "center",
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glassLight,
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    overflow: "hidden",
    position: "relative",
  },
  topBorderHighlight: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: Colors.glassBorderTop,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 42, 109, 0.18)",
    borderRadius: Radius.pill,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.rosePink,
    marginRight: 8,
  },
  shownText: {
    color: Colors.cream,
    fontWeight: "800",
  },
  dividerText: {
    color: Colors.textMuted,
    fontWeight: "500",
  },
  totalText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
});
