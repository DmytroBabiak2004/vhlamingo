import React, { useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Image } from "react-native";
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
import { useResponsive } from "@/utils/responsive";

const ASPECT_RATIO = 1.42; 

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
  maxHeight?: number;
}

export function FlipCard({ card, isFlipped, onFlip, hapticsEnabled, maxHeight }: FlipCardProps) {
  const { width, height, isTablet, font, sw } = useResponsive();

  const availableHeight = maxHeight ?? height * 0.62;
  const rawMaxWidth = isTablet ? 420 : 360;

  let cardWidth = Math.min(width * 0.86, rawMaxWidth);
  let cardHeight = cardWidth * ASPECT_RATIO;

  if (cardHeight > availableHeight) {
    cardHeight = availableHeight;
    cardWidth = cardHeight / ASPECT_RATIO;
  }

  const cardScale = cardWidth / 300;
  const cf = (size: number) => Math.round(size * cardScale);

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
    <Pressable onPress={handlePress} style={{ width: cardWidth, height: cardHeight }}>
      {/* FRONT SIDE */}
      <Animated.View
        style={[styles.face, { width: cardWidth, height: cardHeight }, frontStyle, Shadow.card]}
      >
        <LinearGradient colors={Gradients.cardFront} style={styles.cardFill}>
          {/* Top Edge Specular Reflection */}
          <View style={styles.specularEdge} />

          <BlurView
            intensity={28}
            tint="light"
            style={[
              styles.glassOverlay,
              { paddingVertical: cf(36), paddingHorizontal: cf(24) },
            ]}
          >
            <View style={styles.frontContent}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("@/assets/images/flamingo2.png")}
                  style={{
                      width: cf(235),
                      height: cf(310),
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={[styles.hintCapsule, { paddingHorizontal: cf(16), paddingVertical: cf(8), maxWidth: cardWidth - cf(32) }]}>
              <Text
                style={[styles.hintText, { fontSize: cf(13) }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                Торкнись, щоб перевернути ✨
              </Text>
            </View>
          </BlurView>
        </LinearGradient>
      </Animated.View>

      {/* BACK SIDE */}
      <Animated.View
        style={[
          styles.face,
          styles.faceBack,
          { width: cardWidth, height: cardHeight },
          backStyle,
          Shadow.card,
        ]}
      >
        <LinearGradient colors={Gradients.cardBack} style={styles.cardFill}>
          <View style={styles.specularEdge} />

          <BlurView
            intensity={22}
            tint="light"
            style={[
              styles.glassOverlayBack,
              { paddingVertical: cf(28), paddingHorizontal: cf(22) },
            ]}
          >
            {card ? (
              <View style={styles.backContainer}>
                {/* Category Badge Capsule */}
                <LinearGradient
                  colors={Gradients.badge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.badgeCapsule,
                    { paddingVertical: cf(6), paddingHorizontal: cf(18) },
                  ]}
                >
                  <Text style={[styles.categoryTag, { fontSize: cf(12) }]}>{card.category}</Text>
                </LinearGradient>

                {/* Safe Scrollable Task Container */}
                <ScrollView
                  contentContainerStyle={styles.scrollTaskContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <Text
                    style={[
                      styles.taskText,
                      { fontSize: font(24, 18, 28) * cardScale, lineHeight: cf(34) },
                    ]}
                  >
                    {card.text}
                  </Text>
                </ScrollView>

                {/* Bottom Watermark Footer */}
                <View style={styles.cardFooter}>
                  <Text style={[styles.footerBrand, { fontSize: cf(10) }]}>ВХЛАМІНГО 🦩</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { fontSize: cf(22) }]}>
                  Картки закінчилися 🍾
                </Text>
                <Text style={[styles.emptySubtext, { fontSize: cf(14) }]}>
                  Перемішайте колоду або виберіть інший режим
                </Text>
              </View>
            )}
          </BlurView>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: {
    position: "absolute",
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
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.glassBorderBottom,
    borderRadius: Radius.xl,
  },
  glassOverlayBack: {
    flex: 1,
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
    fontWeight: "800",
    color: Colors.rosePink,
    letterSpacing: 3,
  },
  hintCapsule: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  hintText: {
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
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 42, 109, 0.3)",
  },
  categoryTag: {
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
    fontWeight: "700",
    color: Colors.cream,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cardFooter: {
    alignItems: "center",
    paddingTop: 8,
  },
  footerBrand: {
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
    fontWeight: "800",
    color: Colors.cream,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
});