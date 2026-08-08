import React, { useRef, useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import { RootStackParamList } from "@/types";
import { GradientBackground } from "@/components/GradientBackground";
import { FlipCard } from "@/components/FlipCard";
import { GlowButton } from "@/components/GlowButton";
import { CardCounter } from "@/components/CardCounter";
import { FlamingoLogo } from "@/components/FlamingoLogo";
import { Colors } from "@/constants/colors";
import { useDeck } from "@/hooks/useDeck";
import { useSettings } from "@/hooks/useSettings";
import { playFlipSound } from "@/services/soundService";
import { useResponsive } from "@/utils/responsive";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight, isTinyHeight, isShortHeight, isTablet, clamp, font } =
    useResponsive();

  const {
    currentCard,
    totalCount,
    shownCount,
    isDeckFinished,
    isLoading,
    drawNextCard,
    reshuffleDeck,
  } = useDeck();

  const { settings } = useSettings();
  const [isFlipped, setIsFlipped] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);

  const handleFlip = () => {
    if (currentCard === null) {
      drawNextCard();
    }
    setIsFlipped(true);
    playFlipSound(settings.soundEnabled);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (settings.hapticsEnabled) {
      Haptics.selectionAsync();
    }
    setTimeout(() => {
      drawNextCard();
    }, 260);
  };

  const handleReshuffle = () => {
    reshuffleDeck();
    setIsFlipped(false);
    setShowConfetti(false);
  };

  const deckJustFinished = isDeckFinished && !isFlipped;

  useEffect(() => {
    if (deckJustFinished) {
      setShowConfetti(true);
    }
  }, [deckJustFinished]);

  const handleBodyLayout = useCallback((e: LayoutChangeEvent) => {
    setBodyHeight(e.nativeEvent.layout.height);
  }, []);

  // Безперервне масштабування під розміри екрана
  const headerHeight = clamp(windowHeight * 0.055, 38, 52);
  const logoSize = clamp(windowWidth * 0.075, 22, 32);
  const finishedLogoSize = clamp(windowWidth * 0.2, 60, 90);
  const buttonHeight = clamp(windowHeight * 0.058, 44, 54);
  const menuButtonSize = clamp(windowWidth * 0.1, 36, 42);
  const headerTitleSize = font(16, 14, 19);
  const finishedTitleSize = font(19, 16, 22);
  const finishedSubtitleSize = font(12, 11, 14);

  // Доступний простір під картку
  const cardMaxHeight = bodyHeight > 0 ? bodyHeight * 0.96 : windowHeight * 0.5;

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <View style={[styles.contentWrapper, isTablet && styles.tabletConstraint]}>
          {/* 1. Хедер */}
          <View style={[styles.header, { height: headerHeight }]}>
            <View style={styles.brandContainer}>
              <FlamingoLogo size={logoSize} />
              <Text
                style={[styles.headerTitle, { fontSize: headerTitleSize }]}
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
              >
                ВХЛАМІНГО
              </Text>
            </View>
            <GlowButton
              label="☰"
              variant="glass"
              compact
              onPress={() => navigation.navigate("Menu")}
              style={{
                ...styles.menuButton,
                width: menuButtonSize,
                height: menuButtonSize,
                borderRadius: menuButtonSize / 2,
              }}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </View>

          {/* 2. Основна зона */}
          <View
            style={[styles.body, isShortHeight && { paddingVertical: 0 }]}
            onLayout={handleBodyLayout}
          >
            {!isLoading && !deckJustFinished && (
              <View style={[styles.cardWrapper, { maxHeight: cardMaxHeight }]}>
                <FlipCard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  hapticsEnabled={settings.hapticsEnabled}
                  maxHeight={cardMaxHeight}
                />
              </View>
            )}

            {deckJustFinished && (
              <View style={styles.finishedBox}>
                <View style={styles.finishedLogoWrapper}>
                  <FlamingoLogo size={finishedLogoSize} />
                </View>
                <Text
                  style={[styles.finishedTitle, { fontSize: finishedTitleSize }]}
                  maxFontSizeMultiplier={1.2}
                >
                  ВСІ КАРТКИ ВІДКРИТО!
                </Text>
                <Text
                  style={[
                    styles.finishedSubtitle,
                    { fontSize: finishedSubtitleSize },
                    isTinyHeight && { marginBottom: 14 },
                  ]}
                  maxFontSizeMultiplier={1.2}
                >
                  Час перемішати колоду та продовжити вечірку 🍾
                </Text>
                <GlowButton
                  label="Перемішати колоду"
                  onPress={handleReshuffle}
                  style={{
                    ...styles.reshuffleButton,
                    height: buttonHeight,
                  }}
                  hapticsEnabled={settings.hapticsEnabled}
                />
              </View>
            )}
          </View>

          {/* 3. Футер */}
          <View style={styles.footer}>
            {!deckJustFinished && (
              <>
                <View style={[styles.counterContainer, isTinyHeight && { marginBottom: 4 }]}>
                  <CardCounter shown={shownCount} total={totalCount} />
                </View>

                <GlowButton
                  label={isFlipped ? "Наступна картка ➔" : "Відкрити картку ✨"}
                  onPress={isFlipped ? handleNext : handleFlip}
                  style={{
                    ...styles.mainButton,
                    height: buttonHeight,
                  }}
                  hapticsEnabled={settings.hapticsEnabled}
                />
              </>
            )}
          </View>
        </View>
      </View>

      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={isTinyHeight ? 80 : 120}
          origin={{ x: windowWidth / 2, y: -20 }}
          fadeOut
          autoStart
          fallSpeed={2400}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  tabletConstraint: {
    maxWidth: 480,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  headerTitle: {
    fontWeight: "900",
    color: Colors.cream,
    letterSpacing: 1.2,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    flexShrink: 1,
  },
  menuButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: "100%",
  },
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: "center",
    width: "100%",
  },
  counterContainer: {
    marginBottom: 8,
  },
  mainButton: {
    width: "100%",
    justifyContent: "center",
  },
  finishedBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  finishedLogoWrapper: {
    marginBottom: 12,
    shadowColor: "#FF2A6D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  finishedTitle: {
    fontWeight: "900",
    color: Colors.cream,
    textAlign: "center",
    letterSpacing: 1,
  },
  finishedSubtitle: {
    color: "rgba(255, 255, 255, 0.75)",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  reshuffleButton: {
    width: "100%",
    justifyContent: "center",
  },
});
