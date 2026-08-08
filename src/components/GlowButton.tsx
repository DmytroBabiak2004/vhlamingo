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
import { useResponsive } from "@/utils/responsive";

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  variant?: "solid" | "glass";
  style?: ViewStyle;
  hapticsEnabled?: boolean;
  /** Для компактних (напр. круглих іконних) кнопок — прибирає горизонтальний внутрішній відступ. */
  compact?: boolean;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Кнопка з підтримкою довільної висоти (передається через `style.height` з екрана).
 * Внутрішній контент завжди центрується по флексу, тож текст ніколи не обрізається
 * і не "виїжджає" за межі кнопки на маленьких екранах — на відміну від попередньої
 * версії, де фіксований paddingVertical конфліктував із динамічною висотою.
 */
export function GlowButton({
  label,
  onPress,
  variant = "solid",
  style,
  hapticsEnabled = true,
  compact = false,
}: GlowButtonProps) {
  const { font, sw } = useResponsive();
  const scale = useSharedValue(1);

  const fontSize = variant === "glass" ? font(16, 14, 18) : font(17, 15, 19);
  const paddingHorizontal = compact ? sw(6) : sw(28);
  // borderRadius (напр. для круглих іконних кнопок) має застосовуватись і до
  // видимого внутрішнього контенту, інакше форма зʼявляється лише на невидимій обгортці.
  const borderRadiusOverride = style?.borderRadius as number | undefined;

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
      <Animated.View style={[styles.defaultSize, animatedStyle, style]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={styles.pressableFill}
        >
          <View
            style={[
              styles.glassButton,
              Shadow.button,
              { paddingHorizontal },
              borderRadiusOverride !== undefined && { borderRadius: borderRadiusOverride },
            ]}
          >
            <View style={styles.topEdgeHighlight} />
            <Text
              style={[styles.glassLabel, { fontSize }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.2}
            >
              {label}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.defaultSize, animatedStyle, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.pressableFill}
      >
        <AnimatedGradient
          colors={Gradients.buttonPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.solidButton,
            Shadow.neon,
            { paddingHorizontal },
            borderRadiusOverride !== undefined && { borderRadius: borderRadiusOverride },
          ]}
        >
          {/* Внутрішній глянцевий відблиск */}
          <View style={styles.topEdgeHighlight} />
          <Text
            style={[styles.solidLabel, { fontSize }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.2}
          >
            {label}
          </Text>
        </AnimatedGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  defaultSize: {
    minHeight: 48,
    width: "100%",
  },
  pressableFill: {
    flex: 1,
  },
  solidButton: {
    flex: 1,
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
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glassButton: {
    flex: 1,
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
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
