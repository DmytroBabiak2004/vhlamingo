import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Shadow } from "@/constants/colors";

interface CardCounterProps {
  shown: number;
  total: number;
}

export function CardCounter({ shown, total }: CardCounterProps) {
  const progressPercent = total > 0 ? Math.min((shown / total) * 100, 100) : 0;

  return (
    <View style={[styles.pill, Shadow.subtle]}>
      {/* Specular Top Border Accent */}
      <View style={styles.topBorderHighlight} />
      
      {/* Active Progress Capsule Fill */}
      <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />

      <View style={styles.contentRow}>
        <View style={styles.liveIndicator} />
        <Text style={styles.text}>
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
    paddingHorizontal: 20,
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
  text: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
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
