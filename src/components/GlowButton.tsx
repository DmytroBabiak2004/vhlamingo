import React from "react";
import { StyleSheet, Text, ViewStyle, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Colors, Gradients, Radius, Shadow } from "@/constants/colors";

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  variant?: "solid" | "glass";
  style?: ViewStyle;
  hapticsEnabled?: boolean;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export function GlowButton({
  label,
  onPress,
  variant = "solid",
  style,
  hapticsEnabled = true,
}: GlowButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 140 });
  };

  const handlePress = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  if (variant === "glass") {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={[styles.glassButton, Shadow.button]}
        >
          <View style={styles.topEdgeHighlight} />
          <Text style={styles.glassLabel}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
        <AnimatedGradient
          colors={Gradients.buttonPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.solidButton, Shadow.neon]}
        >
          {/* Inner Gloss Light Shimmer */}
          <View style={styles.topEdgeHighlight} />
          <Text style={styles.solidLabel}>{label}</Text>
        </AnimatedGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  solidButton: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  topEdgeHighlight: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  solidLabel: {
    color: Colors.cream,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glassButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.glassLight,
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    position: "relative",
    overflow: "hidden",
  },
  glassLabel: {
    color: Colors.cream,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
