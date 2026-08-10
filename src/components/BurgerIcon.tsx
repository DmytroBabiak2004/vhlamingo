import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";

interface BurgerIconProps {
  size?: number;
}

export function BurgerIcon({ size = 18 }: BurgerIconProps) {
  const barHeight = Math.max(2, Math.round(size * 0.11));
  const gap = Math.max(3, Math.round(size * 0.24));

  return (
    <View style={[styles.container, { width: size, height: size, gap }]}>
      <View style={[styles.bar, { height: barHeight, borderRadius: barHeight / 2 }]} />
      <View
        style={[
          styles.bar,
          { height: barHeight, borderRadius: barHeight / 2, width: "72%", alignSelf: "flex-start" },
        ]}
      />
      <View style={[styles.bar, { height: barHeight, borderRadius: barHeight / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  bar: {
    width: "100%",
    backgroundColor: Colors.cream,
  },
});