import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { FlamingoLogo } from "@/components/FlamingoLogo";
import { Colors } from "@/constants/colors";
import { getRandomQuote } from "@/constants/quotes";
import { useResponsive } from "@/utils/responsive";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isTinyHeight, isTablet, font, clamp, height } = useResponsive();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const [quote] = useState(getRandomQuote());

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });

    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Адаптивні параметри
  const logoSize = clamp(height * 0.15, 90, 150);
  const titleFontSize = font(42, 30, 48);

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
<Animated.View
  style={[styles.content, isTablet && styles.tabletConstraint, animatedStyle]}
>
  <Image
    source={require("@/assets/images/flamingo.png")}
    style={{
      width: logoSize,
      height: logoSize,
    }}
    resizeMode="contain"
  />

  <Text
    style={[styles.title, { fontSize: titleFontSize }]}
    maxFontSizeMultiplier={1.2}
  >
    Вхламінго
  </Text>
          <Text style={[styles.subtitle, { fontSize: font(15, 13, 17) }]} maxFontSizeMultiplier={1.2}>
            {quote}
          </Text>
        </Animated.View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  title: {
    marginTop: 16,
    fontWeight: "800",
    color: Colors.cream,
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});
