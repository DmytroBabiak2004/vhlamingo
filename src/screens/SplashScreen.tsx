import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
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

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <FlamingoLogo size={140} />
          <Text style={styles.title}>Вхламінго</Text>
          <Text style={styles.subtitle}>{quote}</Text>
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
  },
  content: {
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 44,
    fontWeight: "800",
    color: Colors.cream,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
