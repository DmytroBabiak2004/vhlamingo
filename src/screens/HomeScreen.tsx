import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
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

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Адаптивні пороги
  const isSmallScreen = windowHeight < 670; // Наприклад iPhone SE або Telegram Webview
  const isShortScreen = windowHeight < 600; // Низькі екрани / альбомна орієнтація
  const isTablet = windowWidth >= 768;      // Планшети

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

  // Розрахунок адаптивних розмірів елементів
  const headerHeight = isSmallScreen ? 42 : 50;
  const logoSize = isSmallScreen ? 26 : 32;
  const finishedLogoSize = isSmallScreen ? 70 : 90;
  const buttonHeight = isSmallScreen ? 44 : 50;

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
        {/* Максимальна ширина для планшетів */}
        <View style={[styles.contentWrapper, isTablet && styles.tabletConstraint]}>
          
          {/* 1. Хедер */}
          <View style={[styles.header, { height: headerHeight }]}>
            <View style={styles.brandContainer}>
              <FlamingoLogo size={logoSize} />
              <Text 
                style={[styles.headerTitle, isSmallScreen && styles.smallHeaderTitle]}
                maxFontSizeMultiplier={1.2}
              >
                ВХЛАМІНГО
              </Text>
            </View>
            <GlowButton
              label="☰"
              variant="glass"
              onPress={() => navigation.navigate("Menu")}
              style={{
                ...styles.menuButton,
                width: isSmallScreen ? 36 : 40,
                height: isSmallScreen ? 36 : 40,
                borderRadius: isSmallScreen ? 18 : 20,
              }}
              hapticsEnabled={settings.hapticsEnabled}
            />
          </View>

          {/* 2. Основна зона */}
          <View style={[styles.body, isShortScreen && { paddingVertical: 0 }]}>
            {!isLoading && !deckJustFinished && (
              <View 
                style={[
                  styles.cardWrapper, 
                  { maxHeight: windowHeight * (isSmallScreen ? 0.52 : 0.58) }
                ]}
              >
                <FlipCard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  hapticsEnabled={settings.hapticsEnabled}
                />
              </View>
            )}

            {/* Екран завершення колоди */}
            {deckJustFinished && (
              <View style={styles.finishedBox}>
                <View style={styles.finishedLogoWrapper}>
                  <FlamingoLogo size={finishedLogoSize} />
                </View>
                <Text 
                  style={[styles.finishedTitle, isSmallScreen && { fontSize: 18 }]}
                  maxFontSizeMultiplier={1.2}
                >
                  ВСІ КАРТКИ ВІДКРИТО!
                </Text>
                <Text 
                  style={[styles.finishedSubtitle, isSmallScreen && { fontSize: 12, marginBottom: 16 }]}
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
                <View style={[styles.counterContainer, isSmallScreen && { marginBottom: 4 }]}>
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
          count={isSmallScreen ? 80 : 120}
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
  /* Header */
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.cream,
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  smallHeaderTitle: {
    fontSize: 16,
    letterSpacing: 1,
  },
  menuButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  /* Body */
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
  /* Footer */
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
  /* Finished Screen */
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
    fontSize: 20,
    fontWeight: "900",
    color: Colors.cream,
    textAlign: "center",
    letterSpacing: 1,
  },
  finishedSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.75)",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  reshuffleButton: {
    width: "100%",
  },
});