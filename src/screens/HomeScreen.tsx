import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Platform, Dimensions } from "react-native";
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
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

  React.useEffect(() => {
    if (deckJustFinished) {
      setShowConfetti(true);
    }
  }, [deckJustFinished]);

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* 1. Хедер (Шапка) */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <FlamingoLogo size={38} />
            <Text style={styles.headerTitle}>ВХЛАМІНГО</Text>
          </View>
          <GlowButton
            label="☰"
            variant="glass"
            onPress={() => navigation.navigate("Menu")}
            style={styles.menuButton}
            hapticsEnabled={settings.hapticsEnabled}
          />
        </View>

        {/* 2. Основна частина (Картка гри) */}
        <View style={styles.body}>
          {!isLoading && !deckJustFinished && (
            <View style={styles.cardContainer}>
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
                <FlamingoLogo size={130} />
              </View>
              <Text style={styles.finishedTitle}>ВСІ КАРТКИ ВІДКРИТО!</Text>
              <Text style={styles.finishedSubtitle}>
                Час перемішати колоду та продовжити вечірку
              </Text>
              <GlowButton
                label="Перемішати колоду"
                onPress={handleReshuffle}
                style={styles.reshuffleButton}
                hapticsEnabled={settings.hapticsEnabled}
              />
            </View>
          )}
        </View>

        {/* 3. Футер (Лічильник та Кнопка дії) */}
        <View style={styles.footer}>
          {!deckJustFinished && (
            <>
              <View style={styles.counterWrapper}>
                <CardCounter shown={shownCount} total={totalCount} />
              </View>
              <GlowButton
                label={isFlipped ? "Наступна картка" : "Відкрити"}
                onPress={isFlipped ? handleNext : handleFlip}
                style={styles.mainButton}
                hapticsEnabled={settings.hapticsEnabled}
              />
            </>
          )}
        </View>
      </View>

      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={140}
          origin={{ x: Dimensions.get("window").width / 2, y: -20 }}
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
    justifyContent: "space-between",
  },
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: 60,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.cream,
    letterSpacing: 1.5,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  /* Body (Card Area) */
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  cardContainer: {
    width: "100%",
    maxHeight: SCREEN_HEIGHT * 0.55, // Гарантує, що картка не залізе на футер
    alignItems: "center",
    justifyContent: "center",
  },
  /* Footer */
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: "center",
    gap: 14,
  },
  counterWrapper: {
    marginBottom: 4, // Фіксована безпечна відстань над кнопкою
  },
  mainButton: {
    width: "100%",
  },
  /* Finished Screen */
  finishedBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%",
  },
  finishedLogoWrapper: {
    marginBottom: 20,
    shadowColor: "#FF007F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  finishedTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.cream,
    textAlign: "center",
    letterSpacing: 1,
  },
  finishedSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },
  reshuffleButton: {
    width: "100%",
  },
});