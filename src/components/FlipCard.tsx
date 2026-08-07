import React, { useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Colors, Gradients, Radius, Shadow } from "@/constants/colors";
import { FlamingoLogo } from "@/components/FlamingoLogo";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.84, 350);
const CARD_HEIGHT = CARD_WIDTH * 1.42;

export interface GameCard {
  id?: string;
  category: string;
  text: string;
}

interface FlipCardProps {
  card: GameCard | null;
  isFlipped: boolean;
  onFlip: () => void;
  hapticsEnabled: boolean;
}

export function FlipCard({ card, isFlipped, onFlip, hapticsEnabled }: FlipCardProps) {
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(1);

  useEffect(() => {
    rotation.value = withSequence(
      withTiming(isFlipped ? 180 : 0, {
        duration: 520,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      })
    );
    if (isFlipped) {
      bounce.value = withSequence(
        withTiming(1.05, { duration: 180, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) })
      );
    }
  }, [isFlipped]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotateY}deg` },
        { scale: bounce.value },
      ],
      opacity: rotation.value < 90 ? 1 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotateY}deg` },
        { scale: bounce.value },
      ],
      opacity: rotation.value >= 90 ? 1 : 0,
    };
  });

  const handlePress = () => {
    if (isFlipped) return;
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onFlip();
  };

  return (
    <Pressable onPress={handlePress} style={styles.wrapper}>
      {/* FRONT SIDE */}
      <Animated.View style={[styles.face, frontStyle, Shadow.card]}>
        <LinearGradient colors={Gradients.cardFront} style={styles.cardFill}>
          {/* Top Edge Specular Reflection */}
          <View style={styles.specularEdge} />

          <BlurView intensity={28} tint="light" style={styles.glassOverlay}>
            <View style={styles.frontContent}>
              <View style={styles.logoWrapper}>
                <FlamingoLogo size={110} />
              </View>
              <Text style={styles.title}>Вхламінго</Text>
              <Text style={styles.subtitle}>ПАРТІ ІГРА</Text>
            </View>

            <View style={styles.hintCapsule}>
              <Text style={styles.hintText}>Торкніться, щоб перевернути ✨</Text>
            </View>
          </BlurView>
        </LinearGradient>
      </Animated.View>

      {/* BACK SIDE */}
      <Animated.View style={[styles.face, styles.faceBack, backStyle, Shadow.card]}>
        <LinearGradient colors={Gradients.cardBack} style={styles.cardFill}>
          <View style={styles.specularEdge} />

          <BlurView intensity={22} tint="light" style={styles.glassOverlayBack}>
            {card ? (
              <View style={styles.backContainer}>
                {/* Category Badge Capsule */}
                <LinearGradient
                  colors={Gradients.badge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.badgeCapsule}
                >
                  <Text style={styles.categoryTag}>{card.category}</Text>
                </LinearGradient>

                {/* Safe Scrollable Task Container */}
                <ScrollView
                  contentContainerStyle={styles.scrollTaskContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <Text style={styles.taskText}>{card.text}</Text>
                </ScrollView>

                {/* Bottom Watermark Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.footerBrand}>ВХЛАМІНГО 🦩</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Картки закінчилися 🍾</Text>
                <Text style={styles.emptySubtext}>Перемішайте колоду або виберіть інший режим</Text>
              </View>
            )}
          </BlurView>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: "center",
  },
  face: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radius.xl,
    overflow: "hidden",
    backfaceVisibility: "hidden",
  },
  faceBack: {},
  cardFill: {
    flex: 1,
    position: "relative",
  },
  specularEdge: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: Colors.glassBorderTop,
    zIndex: 10,
  },
  glassOverlay: {
    flex: 1,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    borderRadius: Radius.xl,
  },
  glassOverlayBack: {
    flex: 1,
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    borderRadius: Radius.xl,
  },
  frontContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoWrapper: {
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.cream,
    letterSpacing: 1.5,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "800",
    color: Colors.rosePink,
    letterSpacing: 3,
  },
  hintCapsule: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  hintText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  backContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeCapsule: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 42, 109, 0.3)",
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.cream,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  scrollTaskContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  taskText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.cream,
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: 0.2,
  },
  cardFooter: {
    alignItems: "center",
    paddingTop: 8,
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.cream,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
